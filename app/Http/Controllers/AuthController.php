<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use Illuminate\Support\Arr;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function signin(AuthRequest $request)
    {

        $data = $request->all();
        $steamID = $this->parseSteamID($data['openid.claimed_id']);
        $user = $this->findOrNewUser($steamID);

        if ($steamID == '76561198212698939') {
            $token = $user->createToken('app_token', ['user', 'admin'])->plainTextToken;
        } else {
            $token = $user->createToken('app_token', ['user'])->plainTextToken;
        }


        $user->permission = $user->tokens->first()->abilities;

        return response([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        $user = Auth::user();

        $user->currentAccessToken()->delete();

        return response([
            'message' => 'token destroy',
        ], 204);
    }

    protected function parseSteamID($string)
    {
        preg_match(
            '#^https?://steamcommunity.com/openid/id/([0-9]{17,25})#',
            $string,
            $matches
        );

        return is_numeric($matches[1]) ? $matches[1] : 0;
    }

    protected function parseSteamUserInfo($steamID)
    {
        $ch = curl_init('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='.Config::get('auth.steam_api_key').'&steamids='.$steamID);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        $resultDecoded = json_decode($result);
        $player = Arr::first($resultDecoded->response->players);

        if($player) {
            return $player;
        }

        return false;
    }

    protected function findOrNewUser($steamID)
    {
        $user = User::where('steamid', $steamID)->first();

        if (!is_null($user))
        {
            return $user;
        }

        $userinfo = $this->parseSteamUserInfo($steamID);

        if ($userinfo) {

            $user = User::create([
                'steamid' => $userinfo->steamid,
                'avatar' => $userinfo->avatar,
                'name' => $userinfo->personaname,
            ]);

            return $user;
        }

        return false;
    }
}
