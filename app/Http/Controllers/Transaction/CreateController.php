<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CreateController extends BaseController
{
    public function __invoke(Request $request)
    {
        $amount = (float)$request->input('amount');
        $result = $this->service->create($amount, $request->user()->id);

        return response()->json($result);
    }
}
