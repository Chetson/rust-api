<?php

namespace App\Http\Controllers\Store\Purchase;

use App\Http\Controllers\Controller;
use App\Models\PropertyHistory;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function __invoke(Request $request)
    {
        $property = PropertyHistory::query()
            ->orderBy('created_at', 'DESC')
            ->with([
                'product' => function ($query) {
                    $query->first();
                },
                'property',
            ])
            ->where('user_id', $request->user()->id)
            ->paginate(10);

        return response($property);
    }
}
