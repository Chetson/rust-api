<?php

namespace App\Http\Controllers\Auth;

use App\Services\Auth\Service;

class LogoutController extends BaseController
{
    public function __invoke(Service $service)
    {
        $service->logout();

        return response([
            'message' => 'token destroy',
        ], 204);
    }
}
