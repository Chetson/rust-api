<?php

namespace App\Http\Controllers\Store\Purchase;

use App\Http\Controllers\Controller;
use App\Services\Store\Product\PurchaseService;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public PurchaseService $service;

    public function __construct(PurchaseService $service)
    {
        $this->service = $service;
    }
}
