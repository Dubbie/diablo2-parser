<?php

namespace App\Http\Controllers\Api;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController
{
    public function fetch(Request $request)
    {
        $data = $request->validate([
            'search' => 'nullable|string',
            'slot' => 'nullable|string',
        ]);

        $searchValue = $data['search'] ?? "";
        $items = Item::searchByName($searchValue)->get();

        return $items;
    }
}
