<?php

namespace App\Services\Store\Product;

use App\Models\Product;

class Service
{
    public function getProductsByServerId($serverId, $categoryId)
    {

        $products = Product::query()->where(['server_id' => $serverId]);

        if ($categoryId != 'all') {
            $products->where(['product_category_id' => $categoryId]);
        }

        return $products->with([
                'type'      => function($query) { $query->select(['id', 'name', 'slug']); },
                'category'  => function($query) { $query->select(['id', 'name']); },
                'item'      => function($query) { $query->select(['id', 'name', 'icon']); },
                'command'   => function($query) { $query->select(['id', 'name', 'icon']); },
                'set'       => function($query) { $query->select(['id', 'name', 'icon']); },
            ])
            ->orderBy('sort', 'ASC')
            ->get();
    }
}
