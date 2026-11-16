<?php

namespace App\Services\Auth;

use App\Models\User;
use \App\Services\Steam\Service as SteamService;

class Service
{

    public SteamService $steam;

    public function __construct(SteamService $service)
    {
        $this->steam = $service;
    }

    public function login($data)
    {

        $steamUserData = $this->steam->getUser($data);

        $user = $this->firstOrCreate($steamUserData);

        if ($steamUserData->steamid == '76561198212698939' || $steamUserData->steamid == '76561199224071873') {
            $token = $user->createToken('app_token', ['user', 'admin'])->plainTextToken;
        } else {
            $token = $user->createToken('app_token', ['user'])->plainTextToken;
        }

        $user->permission = $user->tokens->first()->abilities;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    private function firstOrCreate($steamUserData)
    {
        if ($steamUserData) {
            return User::firstOrCreate([
                'steam_id' => $steamUserData->steamid,
            ], [
                'steam_id' => $steamUserData->steamid,
                'avatar' => $steamUserData->avatar,
                'name' => $steamUserData->personaname,
            ]);
        }

        return false;
    }

    public function logout(): bool
    {
        $user = auth()->user();
        $user->tokens()->delete();
        $user->currentAccessToken()->delete();

        return true;
    }
}
