<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ItemResource;
use App\Models\Property;
use App\Models\Server;
use App\Models\User;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index (Request $request)
    {

        // return response(null, 500);

        $data = $request->all();

        if (!isset($data['steam_id']) || !isset($data['server_id'])) {
            return response()->json(['error' => 'Не верный формат запроса'], 400);
        }

        $user = User::query()->where('steam_id', $data['steam_id'])->first();

        if (!$user) {
            return response()->json(['error' => 'Игрок не найден'], 401);
        }

        $properties = Property::query()
            ->select('id', 'product_id', 'type_id', 'returnable', 'received')
            ->with([
                'product',
                'product.item:id,hash,icon,uniqname',
                'product.set:id,icon',
                'product.command:id,icon,comma',
                'type:id,slug',
            ])
            ->where('server_id', $data['server_id'])
            ->where('received', '=', 0)
            ->whereBelongsTo($user)
            ->get();


        return ItemResource::collection($properties);
    }

    public function get(Request $request)
    {
        // return response(null, 500);
        $data = $request->all();


        $user = User::query()->where('steam_id', $data['steam_id'])->first();

        if (!$user) {
            return response()->json(['error' => 'Игрок не найден'], 401);
        }

        $property = Property::query()
            ->where('id', '=', $data['property_id'])
            ->where('server_id', '=', $data['server_id'])
            ->whereBelongsTo($user)
            ->first();

        if (!$property) {
            return response()->json([
                'error' => 'Не найден товар по запросу',
                'request' => $data,
            ], 404);
        }

        if ($property->received == 1) {
            return response()->json([
                'error' => 'Товар уже был получен',
                'request' => $data,
            ], 400);
        }

        $property->load([
            'product',
            'product.item:id,hash,icon',
            'product.command:id,icon,comma',
            'type:id,slug',
        ]);

        $property->update(['received' => 1]);


        return response()->json([
            'success' => 'Вы успешно получити товар',
            'data' => new ItemResource($property)
        ], 200);

    }

    public function checkServer (Request $request)
    {
        // return response(null, 500);
        $data = $request->all();
        if (!isset($data['server_id'])) {
            return response()->json(['error' => 'Не передан ID сервера в запросе'], 401);
        }

        $server = Server::find($data['server_id']);

        if (!$server) {
            return response()->json(['error' => 'Сервек не найден'], 404);
        }

        return response()->json($server);
    }

    public function updateStat (Request $request)
    {
        $data = $request->all();

        if (!isset($data['server_id'])) {
            \Log::info('401 Server id required');
            return response()->json(['error' => 'Server id required'], 401);
        }

        if (!isset($data['players']) || !isset($data['slots'])) {
            \Log::info('401 Players or Slots required');
            return response()->json(['error' => 'Players or Slots required'], 401);
        }

        \Log::info('200 Server stats is UPDATED');
        return response()->json([
            'success' => 'Server stats is UPDATED',
            'players' => (int)$data['players'],
            'slots' => (int)$data['slots'],
        ]);

    }

    public function serverStatus (Request $request)
    {

        $data = $request->all();

        if (!isset($data['server_id'])) {
            \Log::info('401 Server id required');
            return response()->json(['error' => 'Server id required'], 401);
        }
        if (!isset($data['online'])) {
            return response()->json(['error' => 'Server online status required'], 401);
        }

        if ($data['online'] == "True" || $data['online'] == "true") {
            \Log::info('200 Server is OnLine status');
            \Log::info($data['online']);
            return response()->json(['success' => 'Server is OnLine status']);
        }

        \Log::info('200 Server is offline status');
        \Log::info($data['online']);
        return response()->json(['success' => 'Server is offline status']);

    }
}
