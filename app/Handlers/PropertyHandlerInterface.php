<?php

namespace App\Handlers;

use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;

interface PropertyHandlerInterface
{
    /**
     * Handles the mapping of item properties and returns and array of mapped properties.
     *
     * @param Item $item
     * @param ItemProperty $itemProperty
     * @return MappedProperty[]
     */
    public function handle(Item $item, ItemProperty $itemProperty): array;
}
