<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class ItemService
{
    public function createItem(int $itemId, array $modifiers)
    {
        DB::beginTransaction();
        try {
            $item = Item::find($itemId);

            $itemAttributes = $item->getAttributes();
            $itemAttributes['is_template'] = false;

            // If base_stats is a JSON string, decode it into an array before saving
            if (isset($itemAttributes['base_stats']) && is_string($itemAttributes['base_stats'])) {
                $itemAttributes['base_stats'] = json_decode($itemAttributes['base_stats'], true);
            }

            $createdItem = Item::create($itemAttributes);

            $cleanedModifiers = array_map(function ($modifier) {
                return [
                    'name' => $modifier['name'],
                    'stat' => $modifier['stat'] ? $modifier['name'] : null,
                    'values' => $modifier['values'],
                    'priority' => $modifier['priority'],
                    'min' => $modifier['min'] ?? null,
                    'max' => $modifier['max'] ?? null,
                ];
            }, $modifiers);

            $createdItem->itemModifiers()->createMany($cleanedModifiers);

            DB::commit();

            return response()->json([
                'message' => 'Item created successfully',
                'item' => $createdItem->append('modifiers')->toArray(),
                'success' => true
            ], 201);
        } catch (QueryException $e) {
            DB::rollBack();
            throw $e;

            return response()->json([
                'message' => 'An error occurred while creating the item',
                'success' => false
            ], 500);
        }
    }

    public function updateItem(int $itemId, array $modifiers)
    {
        DB::beginTransaction();
        try {
            $item = Item::find($itemId);

            $itemAttributes = $item->getAttributes();
            $itemAttributes = $item->getAttributes();
            $itemAttributes['is_template'] = false;

            // If base_stats is a JSON string, decode it into an array before saving
            if (isset($itemAttributes['base_stats']) && is_string($itemAttributes['base_stats'])) {
                $itemAttributes['base_stats'] = json_decode($itemAttributes['base_stats'], true);
            }

            $item->update($itemAttributes);

            $cleanedModifiers = array_map(function ($modifier) {
                return [
                    'name' => $modifier['name'],
                    'stat' => $modifier['stat'] ? $modifier['name'] : null,
                    'values' => $modifier['values'],
                    'priority' => $modifier['priority'],
                    'min' => $modifier['min'] ?? null,
                    'max' => $modifier['max'] ?? null,
                ];
            }, $modifiers);

            // Delete all old modifiers
            $item->itemModifiers()->delete();

            // Create new modifiers
            $item->itemModifiers()->createMany($cleanedModifiers);

            DB::commit();

            // Refresh the item
            $item->refresh();

            return response()->json([
                'message' => 'Item updated successfully',
                'item' => $item->append('modifiers'),
                'success' => true
            ], 200);
        } catch (QueryException $e) {
            DB::rollBack();
            throw $e;

            return response()->json([
                'message' => 'An error occurred while creating the item',
                'success' => false
            ], 500);
        }
    }
}
