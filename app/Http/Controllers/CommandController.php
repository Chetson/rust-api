<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Command;
use Illuminate\Support\Facades\Storage;

class CommandController extends Controller
{
    public function index()
    {
        return Command::all();
    }

    public function create(Request $request)
    {
        $file = $request->file('file');
        $data = $request->all();
        unset($data['file']);



        if ($file) {
            $name = $file->getClientOriginalName();
            $filePath = 'commands/'.$name;
            $storage = Storage::disk('public');
            $data['icon'] = $storage->missing($filePath) ? $storage->putFileAs('commands', $file, $name) : $filePath;
        }

        return Command::create($data);
    }

    public function update(Request $request)
    {
        $req = $request->all();

        $file = $request->file('file');
        $data = $request->all();
        unset($data['file']);

        if ($file) {
            $name = $file->getClientOriginalName();
            $filePath = 'commands/'.$name;
            $storage = Storage::disk('public');
            $data['icon'] = $storage->missing($filePath) ? $storage->putFileAs('commands', $file, $name) : $filePath;
        }

        $command = Command::find($data['id']);

        $command->name = $data['name'];
        $command->comma = $data['comma'];
        $command->icon = $data['icon'];

        $command->update();

        return $command;
    }

    public function delete(Request $request, $commandId)
    {
        $command = Command::find($commandId)->delete();

        return $command;
    }
}
