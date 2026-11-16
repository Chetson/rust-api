<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'server_id', 'product_id', 'property_id', 'price', 'event_type'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function server()
    {
        return $this->belongsTo(\App\Models\Server::class);
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\Product::class);
    }

    public function property()
    {
        return $this->belongsTo(\App\Models\Property::class);
    }
}
