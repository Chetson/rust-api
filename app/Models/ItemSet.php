<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ItemSet extends Pivot
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'item_sets';

    protected $fillable = [
        'item_id', 'amount', 'set_id'
    ];
}
