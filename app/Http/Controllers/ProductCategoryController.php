<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductCategory;

class ProductCategoryController extends Controller
{
    public function index()
    {
        return ProductCategory::all();
    }

    public function create(Request $request)
    {
        return ProductCategory::create($request->all());
    }

    public function update(Request $request)
    {
        $req = $request->all();

        $category = ProductCategory::find($req['id']);

        $category->name = $req['name'];
        $category->description = $req['description'];

        $category->update();

        return $category;
    }

    public function delete(Request $request, $categoryId)
    {
        $category = ProductCategory::find($categoryId)->delete();

        return $category;
    }
}
