<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Handlers\CustomDescriptionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class AllResistDescriptionHandler implements CustomDescriptionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        // Get values from the modifier
        $values = $modifier->getValues();

        // Determine if there's only one value
        $value = $values['value'] ?? null;

        // Set min and max values based on the availability of a single value or multiple
        $min = $max = $value ?? $modifier->getMin();
        $max = $value ?? $modifier->getMax();

        // Set the stat string based on the description
        $formattedValue = StatFormatter::formatValue($min, $max);

        return new ModifierLabel('All resistances +' . $formattedValue . '%', "All resistances +[value]%");
    }
}
