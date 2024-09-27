<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        return Inertia::render('Items/Index');
    }

    public function show(Item $item)
    {
        $previousId = (Item::where('id', '<', $item->id)->orderByDesc('id')->first())->id ?? null;
        $nextId = (Item::where('id', '>', $item->id)->orderBy('id')->first())->id ?? null;

        $item = $item->append('modifiers');

        return Inertia::render(
            'Items/Show',
            [
                'item' => $item->append('modifiers'),
                'max' => Item::orderByDesc('id')->first()->id,
                'previousId' => $previousId,
                'nextId' => $nextId
            ]
        );
    }
}
