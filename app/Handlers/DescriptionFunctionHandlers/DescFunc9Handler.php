<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc9Handler implements DescriptionFunctionHandlerInterface
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
        $template = "[perLevel] [string1] [string2]";
        $statDescription = $modifier->getStat()->description;
        $string = $statDescription->positive;
        $descVal = $statDescription->value;
        $extra = $statDescription->extra;
        // Replace Based on with %s per
        $extra = sprintf(str_replace('Based on', '%s per', $extra), $perLevel);
        if ($descVal !== null) {
            switch ($descVal) {
                case 0:
                    $template = "[string1]";
                    break;
                case 2:
                    $template = "[string1] [perLevel] [string2]";
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
