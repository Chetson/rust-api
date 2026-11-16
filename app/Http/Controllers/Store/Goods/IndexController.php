<?php

namespace App\Http\Controllers\Store\Goods;

use Illuminate\Http\Request;

class IndexController extends BaseController
{
    public function __invoke(Request $request)
    {
        $data = $request->all();

        if (!isset($data['server_id'])) {
            return response()->json(['error' => 'Param server_id is required']);
        }

        if (!isset($data['category'])) {
            return response()->json(['error' => 'Param category is required']);
        }

        $products = $this->service->getProductsByServerId($data['server_id'], $data['category']);

        return response($products, 200);
    }
}
