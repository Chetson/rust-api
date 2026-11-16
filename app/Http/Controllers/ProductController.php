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





    public function delete($itemId)
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
