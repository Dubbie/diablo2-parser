<?php

namespace App\Handlers;

use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;

interface PropertyHandlerInterface
{
    public function handle(Item $item, ItemProperty $itemProperty): MappedProperty;
}
