<?php

namespace App\Services\Steam;

use GuzzleHttp\Client;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;

class Service
{

    public string $apiKey;
    public $httpClient;

    public function __construct()
    {
        $this->apiKey = Config::get('auth.steam_api_key');
        $this->httpClient = new Client([
            'base_uri' => 'http://api.steampowered.com/',
            'timeout' => 2.0,
        ]);
    }

    private function parseSteamId($string): int|bool
    {
        preg_match(
            '#^https?://steamcommunity.com/openid/id/([0-9]{17,25})#',
            $string,
            $matches
        );

        return is_numeric($matches[1]) ? $matches[1] : false;
    }

    public function getUser($data)
    {
        if (!isset($data['openid.claimed_id'])) {
            return false;
        }

        $steamId = $this->parseSteamId($data['openid.claimed_id']);
        $response = $this->httpClient->request('GET', 'ISteamUser/GetPlayerSummaries/v0002/', [
            'query' => [
                'key' => $this->apiKey,
                'steamids' => $steamId
            ]
        ]);

        $result = $response->getBody()->getContents();
        $resultDecoded = json_decode($result);
        $player = Arr::first($resultDecoded->response->players);

        if($player) {
            return $player;
        }

        return false;
    }
}
