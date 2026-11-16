<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Server;
use App\Models\Product;
use App\Models\ItemCategory;
use DiDom\Document;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{

    public function categories()
    {
        return ItemCategory::query()->get();
    }

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


    public function index(Request $request)
    {
        $data = $request->all();

        if (!isset($data['category'])) {
            return response()->json(['error' => 'Param `category` is required'], 401);
        }

        $category = ItemCategory::query()->where('slug', '=', $data['category'])->first();

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $items = Item::query()->where('category_id', '=', $category->id)->get();

        return response()->json($items);
    }

    public function serverItems(Request $request, $serverId)
    {
        return Product::where('server_id', $serverId)->with([
            'server' => function($query) { $query->select(['id', 'name']); },
            'item' => function($query) { $query->select(['id', 'name', 'icon']); },
        ])->get();
    }

    public function parseItemsToServer(Request $request)
    {
        $resourceURL = 'https://ru.rustlabs.com';

        $data = $request->all();

        if (!isset($data['slug'])) {
            return response()->json(['error' => 'не указан SLUG категории']);
        }

        $category_slug = $data['slug'];

        $category = ItemCategory::query()->where('slug', '=', $category_slug)->first();



        $html = file_get_contents($resourceURL.'/group='.$category->slug);

        $document = new Document($html);

        $links = $document->find('.pad');

        $storage = Storage::disk('public');

        foreach ($links as $key => $value) {

            $html = file_get_contents($resourceURL.$value->attr('href'));
            $document = new Document($html);

            $title = $document->first('h1')->text();
            $description = $document->first('p')->text();
            $img = $document->first('.main-icon')->attr('src');
            $hash = $document->first('.stats-table')->first('tbody')->first('tr')->find('td')[1]->text();
            $stackSize = $document->first('.stats-table')->first('tbody')->find('tr')[1]->find('td')[1]->text();

            $fi = pathinfo('https:'.$img);
            $filename = $fi['basename'];


            if ($storage->missing('items/'.$filename))
            {
                $storage->putFileAs('items', 'https:'.$img, $filename);
            }



            $item = Item::query()->create([
                'uniqname' => $fi['filename'],
                'name' => $title,
                'description' => $description,
                'icon' => 'items/'.$filename,
                'hash' => $hash,
                'stacksize' => (int) preg_replace("/[^0-9]/", '', $stackSize),
                'category_id' => $category->id,
            ]);

        }
    }
}
