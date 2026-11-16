<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CallbackController extends BaseController
{
    public function __invoke()
    {
        $source = file_get_contents('php://input');
        $requestBody = json_decode($source, true);
        \Log::info($requestBody);

        $result = $this->service->callback($requestBody);

        if (!isset($result) && $result && $result['error']) {
            return response($result['error'], 200);
        }

        return response('OK', 200);
    }
}
