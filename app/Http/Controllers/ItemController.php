<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Server;
use App\Models\Product;
use App\Models\ItemCategory;
use DiDom\Document;

class ItemController extends Controller
{
    public function createFakeItems(Request $request)
    {

        $server = \App\Models\Server::find($request->input('serverId'));

        $server->items()->saveMany([
            new Item([ 'name' => 'item 1' ]),
            new Item([ 'name' => 'item 2' ]),
            new Item([ 'name' => 'item 3' ]),
        ]);

        return $server->items;
    }

    /**
     * Админский метод
     *
     * должен выбрать шмотки из библиотеки для выбора в набор
     * либо для выбора в продукт как отдельную шмотку
     */
    public function index()
    {

        // return Product::query()->addSelect([
        //     'server_name' => Server::select(['name'])->whereColumn('server_id', 'servers.id')
        // ])-get();

        return Item::all();
    }

    public function serverItems(Request $request, $serverId)
    {
        return Product::where('server_id', $serverId)->with([
            'server' => function($query) { $query->select(['id', 'name']); },
            'item' => function($query) { $query->select(['id', 'name', 'icon']); },
        ])->get();
    }

    public function parseItemsToServer()
    {
        $resourceURL = 'https://ru.rustlabs.com';



        $html = file_get_contents($resourceURL.'/group=weapons');

        $document = new Document($html);

        $links = $document->find('.pad');

        foreach ($links as $key => $value) {

            $html = file_get_contents($resourceURL.$value->attr('href'));
            $document = new Document($html);

            $title = $document->first('h1')->text();
            $description = $document->first('p')->text();
            $img = $document->first('.main-icon')->attr('src');
            $hash = $document->first('.stats-table')->first('tbody')->first('tr')->find('td')[1]->text();
            $stackSize = $document->first('.stats-table')->first('tbody')->find('tr')[1]->find('td')[1]->text();

            $fi = pathinfo('https:'.$img);
            $name = $fi['filename'];

            $item = Item::query()->create([
                'uniqname' => $name,
                'name' => $title,
                'description' => $description,
                'icon' => 'items/'.$fi['basename'],
                'hash' => $hash,
                'stacksize' => (int)mb_substr($stackSize, 1),
            ]);

        }
    }
}
