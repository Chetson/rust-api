<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [ 'name' ];

    public function items()
    {
        return $this->hasMany(\App\Models\Item::class);
    }

    public function products()
    {
        return $this->hasMany(\App\Models\Product::class);
    }
}
