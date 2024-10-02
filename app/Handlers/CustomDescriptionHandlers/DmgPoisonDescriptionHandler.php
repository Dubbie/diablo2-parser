<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Handlers\CustomDescriptionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DmgPoisonDescriptionHandler implements CustomDescriptionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        $values = $modifier->getValues();
        $min = $values['minValue'];
        $max = $values['maxValue'];
        $duration = $values['value'];

        $formattedValue = StatFormatter::formatValue($min, $max, '');
        $string = sprintf('+%s Poison Damage Over %s Seconds', $formattedValue, $duration);
        return new ModifierLabel($string, $string);
    }
}
