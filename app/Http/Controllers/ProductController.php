<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Models\Product;
use App\Models\Set;

class ProductController extends Controller
{

    public function info(Request $request, $productId)
    {
        $product = Product::query($productId)->with('type')->where('id', $productId)->first();

        if ($product->type->slug == 'set') {
            $product->setData = Set::query()->with(['items', 'commands'])->where('id', $product->set->id)->first();
        }

        if ($product->type->slug == 'item') {
            $product->item = $product->item;
        }

        if ($product->type->slug == 'command') {
            $product->command = $product->command;
        }


        return $product;
    }

    public function get()
    {
        $products = Product::with([
            'server' => function($query) { $query->select(['id', 'name']); },
            'type' => function($query) { $query->select(['id', 'name', 'slug']); },
            'category' => function($query) { $query->select(['id', 'name']); },
            'item' => function($query) { $query->select(['id', 'name', 'icon']); },
            'set',
            'command'
        ])->get();

        return $products;
    }

    public function create(Request $request)
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
            'product_category_id'
        ]);

        return Product::create($newProductData);
    }

    public function update(Request $request)
    {
        $data = $request->all();

        $product = Product::find($data['id']);


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
            'product_category_id'
        ]);


        $product->fill($newProductData)->update();



        return [
            $product,
            $newProductData,
        ];
    }

    public function delete(Request $request, $itemId)
    {
        $product = Product::find($itemId);
        return $product->delete();
    }

    public function index()
    {
        return Product::query()->addSelect([
            'server_name' => Server::select(['name'])->whereColumn('server_id', 'servers.id')
        ])-get();
    }
}
