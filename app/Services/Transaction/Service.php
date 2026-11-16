<?php

namespace App\Services\Transaction;

use App\Enums\Transaction\StatusEnum;
use App\Models\PaymentSale;
use App\Models\Transaction;
use App\Models\User;
use YooKassa\Client;
use YooKassa\Model\NotificationEventType;
use YooKassa\Model\Notification\NotificationWaitingForCapture;
use YooKassa\Model\Notification\NotificationSucceeded;
use YooKassa\Model\Notification\NotificationCanceled;
use YooKassa\Model\Notification\NotificationRefundSucceeded;
use YooKassa\Model\Notification\NotificationDealClosed;
use YooKassa\Model\Notification\NotificationPayoutCanceled;
use YooKassa\Model\Notification\NotificationPayoutSucceeded;

class Service
{
    public Client $client;

    public function __construct()
    {
        $this->client = new Client();

        $this->client->setAuth(
            config('services.yookassa.shop_id'),
            config('services.yookassa.secret_key'),
        );
    }

    public function get(int $userId)
    {
        return Transaction::query()->where('user_id', $userId)->get();
    }

    public function create(float $amount, int $userId): string|bool
    {
        $description = "Пополнение баланса";

        $transaction = Transaction::create([
            'amount' => $amount,
            'description' => $description,
            'user_id' => $userId,
        ]);

        if ($transaction) {
            return $this->createTransaction($amount, $description, [
                'transaction_id' => $transaction->id,
                'user_id' => $userId,
            ]);
        }

        return false;
    }

    public function createTransaction(float $amount, string $description, array $options = []): string
    {
        $payment = $this->client->createPayment(
            [
                'amount' => [
                    'value' => $amount,
                    'currency' => 'RUB',
                ],
                'confirmation' => [
                    'type' => 'redirect',
                    'return_url' => config('services.yookassa.redirect_url'),
                ],
                'capture' => false,
                'description' => $description,
                'metadata' => [
                    'transaction_id' => $options['transaction_id'],
                    'user_id' => $options['user_id'],
                ],
            ],
            uniqid('', true)
        );

        return $payment->getConfirmation()->getConfirmationUrl();
    }

    public function notification($requestBody)
    {
        if (!isset($requestBody) || !isset($requestBody['event'])) {
            return false;
        }

        switch ($requestBody['event']) {
            case NotificationEventType::PAYMENT_WAITING_FOR_CAPTURE:
                return new NotificationWaitingForCapture($requestBody);
            case NotificationEventType::PAYMENT_SUCCEEDED:
                return new NotificationSucceeded($requestBody);
            case NotificationEventType::PAYMENT_CANCELED:
                return new NotificationCanceled($requestBody);
            case NotificationEventType::REFUND_SUCCEEDED:
                return new NotificationRefundSucceeded($requestBody);
            case NotificationEventType::DEAL_CLOSED:
                return new NotificationDealClosed($requestBody);
            case NotificationEventType::PAYOUT_CANCELED:
                return new NotificationPayoutCanceled($requestBody);
            case NotificationEventType::PAYOUT_SUCCEEDED:
                return new NotificationPayoutSucceeded($requestBody);
        }
    }

    public function callback($requestBody)
    {
        try {
            $notification = $this->notification($requestBody);
            if (!$notification) {
                return \Log::info('No Notification ---------------');
            }

            $payment = $notification->getObject();

            // если в ответе нет статуса то невозможно определить какой статус у платежа
            if (!isset($payment->status)) {
                \Log::info('Не найден статус в объекте $payment');
                return ['error' => 'Не найден статус в объекте $payment'];
            }

            // если нет Метадаты то невозможно привязать статус к платежу
            if (!isset($payment->metadata)) {
                \Log::info('Не найдены доп данные для поиска транзации в ответе');
                return ['error' => 'Не найдены доп данные для поиска транзации в ответе'];
            } else {
                $metadata = (object)$payment->metadata;
            }

            // если нет ID транзакции то смысла нет что-то записывать в БД
            if (!isset($metadata->transaction_id)) {
                \Log::info('Не найден идентификатор платежа в ответе');
                return ['error' => 'Не найден идентификатор платежа в ответе'];
            }

            $paidStatus = (bool)$payment->paid;

            $transactionId = (int)$metadata->transaction_id;
            $transaction = Transaction::find($transactionId);

            // подтверждение платежа на нашей стороне
            if ($payment->status === 'waiting_for_capture') {
                if ((bool)$paidStatus === true) {
                    $transaction->status = StatusEnum::WAITING;
                }

                // автоматически подтверждаем платеж
                $this->client->capturePayment(
                    ['amount' => $payment->amount],
                    $payment->id,
                    uniqid('', true)
                );
            }

            // создание платежа и перевод в CONFIRMED
            if ($payment->status === 'succeeded') {
                if ((bool)$paidStatus === true) {
                    $transaction->status = StatusEnum::CONFIRMED;

                    $user = User::query()->where('id', $metadata->user_id)->first();

                    if (!$user) {
                        return ['error' => 'Не найден пользователь транзакции'];
                    }

                    $paymentSales = PaymentSale::all();
                    $paymentValue = (float)$payment->amount->value;
                    $prevRatio = 1;

                    foreach ($paymentSales as $paymentSale) {
                        if ($paymentSale->lower_limit > $paymentValue) {
                            $paymentValue = round($paymentValue * $prevRatio, 2);
                            break;
                        }

                        $prevRatio = $paymentSale->ratio;
                    }

                    $user->update([
                        'balance' =>
                            $user->balance
                            + $paymentValue
                    ]);

                }
            }

            // отмена платежа
            if ($payment->status === 'canceled') {
                \Log::info('CANCELED - Платеж отменен');
                \Log::info((string)$paidStatus);
                if ((bool)$paidStatus === false) {
                    $transaction->status = StatusEnum::CANCELED;
                }
            }


            $transaction->save();

            return request('', 200);
        } catch (Exception $e) {
            \Log::info('Ошибка обработки статуса платежа');
            \Log::info($e);
            return ['error' => 'Ошибка обработки статуса платежа'];
        }
    }
}
