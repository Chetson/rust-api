<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Server;
use App\Models\Property;
use App\Models\PropertyHistory;
use App\Models\User;
use App\Models\Item;

use Illuminate\Database\Eloquent\Relations\MorphTo;

class PublicStoreController extends Controller
{
    public function products(Request $request, $serverId)
    {
        return Product::where(['server_id' => $serverId])
            ->with([
                'type' => function($query) { $query->select(['id', 'name', 'slug']); },
                'category' => function($query) { $query->select(['id', 'name']); },
                'item' => function($query) { $query->select(['id', 'name', 'icon']); },
                'command' => function($query) { $query->select(['id', 'name', 'icon']); },
                'set' => function($query) { $query->select(['id', 'name', 'icon']); },
            ])
            ->get();
    }


    /**
     * Закрытый метод - только для авторизованных юзверей
     */
    public function purchase(Request $request)
    {

        $product = Product::find($request->input('product'));
        $user = $request->user();
        $userBalance = floatval($user->balance);


        $totalProductPrice = floatval($product->price);

        // считаем скидку на товар от магазина
        if ($product->discount_type == 'percent') {
            $totalProductPrice = $totalProductPrice/100 * (100 - $product->discount);
        } elseif ($product->discount_type == 'amount') {
            $totalProductPrice = $totalProductPrice - $product->discount;
        }

        // считаем персональную скидку для пользователя
        if ($user->personal_discount > 0) {
            $totalProductPrice = $totalProductPrice/100 * (100 - $user->personal_discount);
        }

        $totalProductPrice = round($totalProductPrice, 2);

        // если цена товара со скидками больше цем баланс пользователя
        if ($totalProductPrice > $userBalance) {
            return response()->json([
                'error' => 'Недостаточно средств',
            ], 402);
        }

        if ($product->type->id == 1) {
            // записываем вещь в имущество
            $property = Property::create([
                'user_id' => $user->id,
                'server_id' => $product->server->id,
                'product_id' => $product->id,
                'type_id' => $product->type->id,
                'returnable' => true,
                'price' => $totalProductPrice,
            ]);
        }

        if ($product->type->id == 2) {
            // записываем команду в имущество
            $property = Property::create([
                'user_id' => $user->id,
                'server_id' => $product->server->id,
                'product_id' => $product->id,
                'type_id' => $product->type->id,
                'returnable' => false,
                'price' => $totalProductPrice,
            ]);
        }

        // записываем вещи и команды набора в имущество
        if ($product->type->id == 3) {
            return $request->all();
        }


        // записываем в историю
        $propertyHistory = PropertyHistory::create([
            'property_id' => $property->id,
            'product_id' => $product->id,
            'user_id' => $user->id,
            'event_type' => 'purchase',
            'price' => $totalProductPrice,
        ]);

        // списываем деньги с баланса
        $updatedUser = User::find($user->id)->update([
            'balance' => floatval($user->balance) - $totalProductPrice
        ]);

        return [
            'price' => $totalProductPrice,
            'balance' => $userBalance - $totalProductPrice,
        ];
    }


    public function purchaseHistory(Request $request)
    {
        $property = PropertyHistory::query()
            ->with([
                'product' => function ($query) {
                    $query->first();
                },
                'property',
            ])
            ->where('user_id', $request->user()->id)
            ->paginate(10);

        return $property;
    }
}
