<?php

namespace App\Http\Controllers\Product\Category;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function __invoke(ProductCategory $productCategory)
    {
        return $productCategory->all();
    }
}
