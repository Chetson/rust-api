<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\LoginRequest;

class LoginController extends BaseController
{
    public function __invoke(LoginRequest $request)
    {
        $validated = $request->validated();
        $response = $this->service->login($validated);

        return response($response, 201);
    }
}
