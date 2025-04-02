<?php

namespace App\Http\Controllers;
use App\Models\Server;
use App\Models\ProductType;
use App\Models\ItemCategory;
use App\Models\ProductCategory;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ServerController extends Controller
{
    public function index()
    {
        return Server::all();
    }

    public function create(Request $request)
    {

        $data = $request->all();

        $newServerData = Arr::only($data, [
            'name',
        ]);

        return Server::create($newServerData);
    }

    public function update(Request $request, $serverId)
    {
        $data = $request->all();

        $newServerData = Arr::only($data, [
            'name',
        ]);

        $server = Server::find($serverId);
        $server->update($newServerData);

        return $server;
    }

    public function delete(Request $request, $serverId)
    {
        $server = Server::find($serverId);

        return $server->destroy($serverId);
    }

    public function createFakeServers()
    {
        $serv1 = Server::create(['name' => 'Classic']);
        $serv2 = Server::create(['name' => 'Trio']);
        $serv3 = Server::create(['name' => 'Duo']);

        $itemCategories = [
            ['name' => 'Оружие', 'slug' => 'weapons', 'description' => NULL],
            ['name' => 'Постройки', 'slug' => 'build', 'description' => NULL],
            ['name' => 'Предметы', 'slug' => 'items', 'description' => NULL],
            ['name' => 'Ресурсы', 'slug' => 'resources', 'description' => NULL],
            ['name' => 'Одежда', 'slug' => 'clothing', 'description' => NULL],
            ['name' => 'Инструменты', 'slug' => 'tools', 'description' => NULL],
            ['name' => 'Медикаменты', 'slug' => 'medical', 'description' => NULL],
            ['name' => 'Еда', 'slug' => 'food', 'description' => NULL],
            ['name' => 'Боеприпасы', 'slug' => 'ammo', 'description' => NULL],
            ['name' => 'Ловушки', 'slug' => 'traps', 'description' => NULL],
            ['name' => 'Разное', 'slug' => 'misc', 'description' => NULL],
            ['name' => 'Компоненты', 'slug' => 'components', 'description' => NULL],
            ['name' => 'Электричество', 'slug' => 'electrical', 'description' => NULL],
            ['name' => 'Развлечение', 'slug' => 'fun', 'description' => NULL],
        ];

        $productTypes = [
            ['name' => 'Вещь', 'slug' => 'item'],
            ['name' => 'Команда', 'slug' => 'command'],
            ['name' => 'Набор', 'slug' => 'set'],
        ];


        foreach ($productTypes as $type) {
            ProductType::create($type);
        }

        foreach ($itemCategories as $category) {
            ItemCategory::create($category);
        }

        foreach ($itemCategories as $category) {
            ProductCategory::create(['name' => $category['name'], 'description' => $category['description']]);
        }


        return response([$serv1, $serv2, $serv3], 200);
    }
}
