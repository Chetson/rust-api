<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentSale extends Model
{
    use HasFactory;

    protected $fillable = ['ratio', 'lower_limit'];
}
