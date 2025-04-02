<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use App\Models\Set;
use App\Models\Item;
use App\Models\ItemSet;

class ProductSetController extends Controller
{
    public function index()
    {
        $sets = Set::with(['items', 'commands'])->get();

        return $sets;
    }

    public function create(Request $request)
    {

        $data = $request->all();
        $file = $request->file('file');
        unset($data['file']);

        if ($file) {
            $name = $file->getClientOriginalName();
            $filePath = 'sets/'.$name;
            $storage = Storage::disk('public');
            $icon = $storage->missing($filePath) ? $storage->putFileAs('sets', $file, $name) : $filePath;
        }

        $currentSet = Set::create([
            'name' => $request->input('name'),
            'icon' => $icon ?? NULL
        ]);

        $items = json_decode($request->input('items'), true);
        $commands = json_decode($request->input('commands'), true);

        if (isset($items) && count($items) > 0) {
            foreach ($items as $item) {
                $currentSet->items()->attach($item['id'], ['amount' => $item['amount']]);

            }
        }

        if (isset($commands) && count($commands) > 0) {
            foreach ($commands as $command) {
                $currentSet->commands()->attach($command['id']);
            }
        }

        $currentSet->items = $currentSet->items()->get();
        $currentSet->commands = $currentSet->commands()->get();


        return $currentSet;
    }

    public function update(Request $request)
    {
        $data = $request->all();
        $file = $request->file('file');
        unset($data['file']);

        if ($file) {
            $name = $file->getClientOriginalName();
            $filePath = 'sets/'.$name;
            $storage = Storage::disk('public');
            $data['icon'] = $storage->missing($filePath) ? $storage->putFileAs('sets', $file, $name) : $filePath;
        }

        $currentSet = Set::find($request->id);
        $currentSet->fill(Arr::only($data, ['name', 'icon']))->update();

        if (isset($data['items'])) {
            $currentSet->items()->detach();
            $data['items'] = json_decode($data['items'], true);
            foreach ($data['items'] as $item) {
                ItemSet::create([
                    'item_id' => $item['id'],
                    'amount' => $item['amount'],
                    'set_id' => $currentSet->id
                ]);
            }
        }

        if (isset($data['commands'])) {
            $data['commands'] = json_decode($data['commands'], true);
            $currentSet->commands()->sync(Arr::pluck($data['commands'], 'id'));
        }

        $currentSet->items = $currentSet->items()->get();
        $currentSet->commands = $currentSet->commands()->get();

        return $currentSet;

    }

    public function delete(Request $request, $setId)
    {
        $currentSet = Set::find($setId);

        $currentSet->items()->detach();
        $currentSet->commands()->detach();
        $currentSet->delete();

        return $currentSet;
    }
}
