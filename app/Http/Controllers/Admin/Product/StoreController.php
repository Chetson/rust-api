<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class StoreController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->all();

        $newProductData = Arr::only($data, [
            'title',
            'description',
            'product_type_id',
            'server_id',
            'item_id',
            'command_id',
            'set_id',
            'amount',
            'price',
            'discount',
            'discount_type',
            'returnable',
            'product_category_id',
            'sort',
        ]);

        return Product::query()->create($newProductData);
    }
}
