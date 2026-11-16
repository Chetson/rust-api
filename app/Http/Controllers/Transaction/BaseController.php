<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Services\Transaction\Service;
use Illuminate\Http\Request;

class BaseController extends Controller
{

    public Service $service;
    public function __construct(Service $service)
    {
        $this->service = $service;
    }
}
