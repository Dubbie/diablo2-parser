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
        $q = $request->input('q');
        $itemType = $request->input('item_type');
        $templates = array_key_exists('templates', $request->all()) && $request->all()['templates'] == 'true' ? true : false;
        $slot = $request->input('slot') ?? null;

        $items = Item::query();

        if ($q) {
            $items = $items->searchByName($q);
        }

        if ($itemType) {
            $items = $items->byItemType($itemType);
        }

        if ($templates) {
            $items = $items->where('is_template', true);
        }

        if ($slot) {
            $items = $items->bySlot($slot);
        }

        $items = $items->get()->map(fn($item) => $item->append('modifiers'));

        return response()->json($items);
    }

    public function details(Item $item)
    {
        $item = $item->append('modifiers');
        return response()->json($item);
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
