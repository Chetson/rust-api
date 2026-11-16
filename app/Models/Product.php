<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public function server()
    {
        return $this->belongsTo(\App\Models\Server::class);
    }

    public function type()
    {
        return $this->belongsTo(\App\Models\ProductType::class, 'product_type_id');
    }

    public function category()
    {
        return $this->belongsTo(\App\Models\ProductCategory::class, 'product_category_id');
    }

    public function item()
    {
        return $this->belongsTo(\App\Models\Item::class, 'item_id');
    }

    public function set()
    {
        return $this->belongsTo(\App\Models\Set::class, 'set_id');
    }

    public function command()
    {
        return $this->belongsTo(\App\Models\Command::class, 'command_id');
    }

    protected $fillable = [
        'title',
        'description',
        'amount',
        'price',
        'discount',
        'discount_type',
        'returnable',
        'sort',
        'product_type_id',
        'product_category_id',
        'server_id',
        'item_id',
        'command_id',
        'set_id',
        'blocked_until',
    ];
    protected $attributes = [
        'description' => '__',
    ];
}
