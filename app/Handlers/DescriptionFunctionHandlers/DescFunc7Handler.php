<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc7Handler implements DescriptionFunctionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        // Get values from the modifier
        $values = $modifier->getValues();

        // Determine if there's only one value
        $value = $values['value'] ?? null;

        // Param is the first value
        $perLevel = $values['perLevel'];

        // Modify the min max values
        $min = floor(1 * $perLevel);
        $max = floor(99 * $perLevel);

        // Templating
        $statDescription = $modifier->getStat()->description;
        $string = $statDescription->positive;
        $template = "[perLevel]% [string1] [string2]";
        $descVal = $statDescription->value;
        $extra = $statDescription->extra;
        // Replace Based on with %s per
        $extra = sprintf(str_replace('Based on', '+%s%% per', $extra), $perLevel);
        if ($descVal !== null) {
            switch ($descVal) {
                case 0:
                    $template = "[string1]";
                    break;
                case 2:
                    throw new Exception("Desc7Handler description value 2 not implemented");
                default:
                    break;
            }
        }

        $value = StatFormatter::formatValue($min, $max);
        $template = str_replace('[string1]', $string, $template);
        $template = str_replace('[string2]', $extra, $template);
        $template = str_replace('[perLevel]', $value, $template);

        return new ModifierLabel($template, $template);
    }
}
