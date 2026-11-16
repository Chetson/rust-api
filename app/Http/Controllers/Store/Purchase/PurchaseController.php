<?php

namespace App\Http\Controllers\Store\Purchase;

use App\Http\Requests\Store\Purchase\PurchaseRequest;
use Illuminate\Http\JsonResponse;

class PurchaseController extends BaseController
{
    public function __invoke(PurchaseRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Пользователь не найден'
            ], 402);
        }

        $productId = $data['product'];
        $userId = $user->id;
        $amount = $data['amount'];

        $result = $this->service->purchase($productId, $amount, $userId);

        if (isset($result['error'])) {
            return response()->json($result, 402);
        }

        if (isset($result['success'])) {
            return response()->json($result, 200);
        }

        return response()->json(['info' => 'Что-то пошло не так'],404);
    }
}
