<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'hash',
        'uniqname',
        'icon',
        'description',
        'stacksize',
    ];

    protected $attributes = [
        'hash' => null,
        'uniqname' => null,
        'icon' => null,
        'stacksize' => 1,
    ];

    public function server()
    {
        return $this->belongsTo(\App\Models\Server::class);
    }
}
