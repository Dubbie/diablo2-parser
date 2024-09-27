<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Handlers\CustomDescriptionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DmgMinDescriptionHandler implements CustomDescriptionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        $template = "+[value] Minimum Damage";
        $fixedValue = $modifier->getValues()['value'] ?? null;
        $min = $fixedValue ?? $modifier->getMin();
        $max = $fixedValue ?? $modifier->getMax();

        $formattedValue = StatFormatter::formatValue($min, $max);
        if (is_numeric($formattedValue)) {
            $template = str_replace('[value]', $formattedValue, $template);
        }

        $statString = str_replace('[value]', $formattedValue, $template);

        return new ModifierLabel($statString, $template);
    }
}
