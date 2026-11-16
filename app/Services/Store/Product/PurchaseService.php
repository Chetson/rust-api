<?php

namespace App\Services\Store\Product;

use App\Models\Product;
use App\Models\Property;
use App\Models\PropertyHistory;
use App\Models\User;

class PurchaseService
{
    public function calculatePrice(Product $product, User $user): float
    {
        $price = floatval($product->price);

        if ($product->discount_type == 'percent') {
            $price = $price/100 * (100 - $product->discount);
        }

        if ($product->discount_type == 'amount') {
            $price = $price - $product->discount;
        }

        $price = $price/100 * (100 - $user->personal_discount);

        return round($price, 2);

    }

    public function purchase($productId, $amount, $userId)
    {
        $product = Product::query()->find($productId);
        if (!$product) {
            return [ 'error' => 'Не найден товар' ];
        }

        $user = User::query()->find($userId);
        if (!$user) {
            return [ 'error' => 'Пользователь не найден' ];
        }

        $price = $this->calculatePrice($product, $user);

        if ($user->balance < ($price * $amount)) {
            return [ 'error' => 'Недостаточно средств' ];
        }

        if ($product->type->id < 3) {
            for ($i = 0; $i < $amount; $i++)
            {
                $property = Property::create([
                    'user_id' => $user->id,
                    'server_id' => $product->server->id,
                    'product_id' => $product->id,
                    'type_id' => $product->type->id,
                    'returnable' => $product->type->id === 1,
                    'price' => $price,
                ]);
            }

        }

        if ($product->type->id === 3) {
            return $product;
        }

        for ($i = 0; $i < $amount; $i++)
        {
            // записываем в историю
            PropertyHistory::create([
                'property_id' => $property->id,
                'product_id' => $product->id,
                'user_id' => $user->id,
                'event_type' => 'purchase',
                'price' => $price,
            ]);
        }

        $user->update([
            'balance' => round(floatval($user->balance) - ($price * $amount), 2)
        ]);

        return [
            'success' => 'Товар успешно приобретен',
            'status' => 200,
            'balance' => round($user->balance, 2),
        ];

    }
}
