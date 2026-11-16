<?php

namespace App\Http\Controllers\Store\Goods;

use App\Http\Controllers\Controller;
use App\Services\Store\Product\Service;

class BaseController extends Controller
{

    public Service $service;
    public function __construct(Service $service)
    {
        $this->service = $service;
    }
}
