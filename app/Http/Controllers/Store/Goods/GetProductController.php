<?php

namespace App\Http\Controllers\Store\Goods;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Set;
use Illuminate\Http\JsonResponse;

class GetProductController extends Controller
{
    public function __invoke(int $productId): JsonResponse
    {
        $product = Product::query()
            ->with('type')
            ->where('id', $productId)
            ->first();

        if ($product->type->slug === 'set') {
            $product->setData = Set::query()
                ->with(['items', 'commands'])
                ->where('id', $product->set->id)
                ->first();
        }

        if ($product->type->slug === 'item') {
            $product->item->get();
        }

        if ($product->type->slug === 'command') {
            $product->command->get();
        }


        return response()->json($product);
    }
}
