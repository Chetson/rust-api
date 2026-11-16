<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductTypeController;
use App\Http\Controllers\CommandController;
use App\Http\Controllers\ProductSetController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/steam/login', \App\Http\Controllers\Auth\LoginController::class);

Route::get('/product/categories', \App\Http\Controllers\Product\Category\IndexController::class);
Route::get('/product/{productId}', \App\Http\Controllers\Store\Goods\GetProductController::class);

Route::get('/servers', [ServerController::class, 'index']);

// получение товаров по ИД сервера
Route::get('/products', \App\Http\Controllers\Store\Goods\IndexController::class);

// Прием колбеков от Юкасса
Route::post('/yookassa/transactions/callback', \App\Http\Controllers\Transaction\CallbackController::class);


Route::middleware('auth:sanctum')->group(function() {
    Route::get('/steam/user', function (Request $request) {
        $user = $request->user();
        $user->permission = $user->tokens->first()->abilities;

        return $user;
    });

    Route::get('/steam/logout', \App\Http\Controllers\Auth\LogoutController::class);
    Route::post('/server/create', [ServerController::class, 'create']);
    Route::post('/server/destroy', [ServerController::class, 'destroy']);

    // генерация демо серверов и демо шмоток - парсинг с сайта https://ru.rustlabs.com
    Route::get('/admin/server/fake', [ServerController::class, 'createFakeServers']);
    Route::post('/admin/items/fake', [ItemController::class, 'createFakeItems']);
    Route::get('/admin/create/items', [ServerController::class, 'createAllProducts']);

    // загрузка вещей с картинками с другого сайта
    Route::get('/admin/items/fakeload', [ItemController::class, 'parseItemsToServer']);

    // получение всех вещей
    Route::get('/admin/items', [ItemController::class, 'index']);
    // получение списка категорий стандартных вещей
    Route::get('/admin/items/categories', [ItemController::class, 'categories']);


    Route::get('/admin/productCategories', [ProductCategoryController::class, 'index']);
    Route::get('/admin/productServers', [ServerController::class, 'index']);
    Route::get('/admin/productTypes', [ProductTypeController::class, 'index']);

    // Servers CRUD
    Route::get('/admin/server', [ServerController::class, 'index']);
    Route::put('/admin/server', [ServerController::class, 'create']);
    Route::patch('/admin/server/{serverId}', [ServerController::class, 'update']);
    Route::delete('/admin/server/{serverId}', [ServerController::class, 'delete']);

    // Products Items CRUD
    Route::get('/admin/products', \App\Http\Controllers\Admin\Product\IndexController::class);
    Route::post('/admin/product/create', \App\Http\Controllers\Admin\Product\StoreController::class);
    Route::post('/admin/product/update', \App\Http\Controllers\Admin\Product\UpdateController::class);
    Route::delete('/admin/product/delete/{itemId}', \App\Http\Controllers\Admin\Product\DestroyController::class);

    // Product Categories CRUD
    Route::get('/admin/product/category', [ProductCategoryController::class, 'index']);
    Route::put('/admin/product/category', [ProductCategoryController::class, 'create']);
    Route::patch('/admin/product/category', [ProductCategoryController::class, 'update']);
    Route::delete('/admin/product/category/{categoryId}', [ProductCategoryController::class, 'delete']);

    // Product Commands CRUD
    Route::get('/admin/command', [CommandController::class, 'index']);
    Route::post('/admin/command/create', [CommandController::class, 'create']);
    Route::post('/admin/command/update', [CommandController::class, 'update']);
    Route::delete('/admin/command/{categoryId}', [CommandController::class, 'delete']);

    // Product Sets CRUD
    Route::get('/admin/set', [ProductSetController::class, 'index']);
    Route::post('/admin/set/create', [ProductSetController::class, 'create']);
    Route::post('/admin/set/update', [ProductSetController::class, 'update']);
    Route::delete('/admin/set/{setId}', [ProductSetController::class, 'delete']);

    // Покупка товара
    Route::post('/product/purchase', \App\Http\Controllers\Store\Purchase\PurchaseController::class);
    Route::get('/product/purchase/history', \App\Http\Controllers\Store\Purchase\HistoryController::class);

    // Transactions
    Route::get('/profile/transactions', \App\Http\Controllers\Transaction\IndexController::class);
    Route::post('/profile/transaction', \App\Http\Controllers\Transaction\CreateController::class);
});


Route::get('/items', [\App\Http\Controllers\Api\ItemController::class, 'index']);
Route::get('/items/get', [\App\Http\Controllers\Api\ItemController::class, 'get']);
Route::get('/check', [\App\Http\Controllers\Api\ItemController::class, 'checkServer']);
Route::get('/server/stats', [\App\Http\Controllers\Api\ItemController::class, 'updateStat']);
Route::get('/server/status', [\App\Http\Controllers\Api\ItemController::class, 'serverStatus']);
