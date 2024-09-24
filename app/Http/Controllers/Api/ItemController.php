<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\CreateItemRequest;
use App\Models\Item;
use App\Services\ItemService;
use Illuminate\Http\Request;

class ItemController
{
    private ItemService $itemService;

    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }

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

    public function create(CreateItemRequest $request)
    {
        $data = $request->validated();

        return $this->itemService->createItem($data['item_id'], $data['modifiers']);
    }

    public function update(CreateItemRequest $request)
    {
        $data = $request->validated();

        return $this->itemService->updateItem($data['item_id'], $data['modifiers']);
    }
}
