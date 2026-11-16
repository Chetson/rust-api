<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item;
use App\Models\ItemSet;
use App\Models\ItemCommand;

class Set extends Model
{
    use HasFactory;

    public function items()
    {
        return $this
            ->belongsToMany(Item::class, 'item_sets')
            ->using(ItemSet::class)
            ->withPivot('amount');
    }

    public function commands()
    {
        return $this->belongsToMany(Command::class, 'command_sets')
            ->using(ItemCommand::class);
    }

    protected $fillable = [
        'name', 'icon'
    ];
}
