<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function __invoke()
    {
        $products = Product::query()
            ->orderBy('sort', 'ASC')
            ->with([
                'server' => function($query) { $query->select(['id', 'name']); },
                'type' => function($query) { $query->select(['id', 'name', 'slug']); },
                'category' => function($query) { $query->select(['id', 'name']); },
                'item' => function($query) { $query->select(['id', 'name', 'icon']); },
                'set',
                'command'
            ]);

        return response()->json($products->paginate(15));
    }
}
