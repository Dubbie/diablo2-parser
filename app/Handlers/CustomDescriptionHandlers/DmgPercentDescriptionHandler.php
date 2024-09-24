<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Handlers\CustomDescriptionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;

class DmgPercentDescriptionHandler implements CustomDescriptionHandlerInterface
{
    public function handle(Modifier $modifier): string
    {
        $formattedValue = StatFormatter::formatValue($modifier->getMin(), $modifier->getMax());
        return '+' . $formattedValue . '% Enhanced Damage';
    }
}
