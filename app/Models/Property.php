<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'server_id', 'product_id', 'type_id', 'received', 'returnable', 'price'
    ];

    protected $attributes = [
        'received' => false,
        'returnable' => false,
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

    public function type()
    {
        return $this->belongsTo(\App\Models\ProductType::class);
    }
}
