<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DescFunc2Handler implements DescriptionFunctionHandlerInterface
{
    // [value]% [string1]
    public function handle(Modifier $modifier): ModifierLabel
    {
        // Get values from the modifier
        $values = $modifier->getValues();

        // Determine if there's only one value
        $value = count($values) === 1 ? $values[0] : null;

        // Set min and max values based on the availability of a single value or multiple
        $min = $max = $value ?? $modifier->getMin() ?? $values[0];
        $max = $value ?? $modifier->getMax() ?? ($values[1] ?? $values[0]);

        // Set the stat string based on the description
        $stat = $modifier->getStat();
        $template = "[value]% [string1]";
        $descValue = $stat->description->value;
        $string = $stat->description->positive;
        $formattedValue = StatFormatter::formatValue($min, $max);

        if ($descValue !== null) {
            switch ($descValue) {
                case 0:
                    $template = '[string1]';
                    break;
                case 2:
                    $template = '[string1] [value]%';
                    break;
                default:
                    break;
            }
        }

        $isNegative = is_numeric($min) && $min < 0;
        if ($isNegative) {
            $min = abs($min);
            $max = abs($max);
            $string = $stat->description->negative;
        }

        // Replace placeholders
        $template = str_replace('[string1]', $string, $template);

        // Check for range
        $range = $modifier->getRange();
        if (empty($range) || $range['value']['min'] === null && $range['value']['max'] === null) {
            $template = str_replace('[value]', $formattedValue, $template);
        } else {
            if ($range['value']['min'] === $range['value']['max']) {
                $template = str_replace('[value]', $range['value']['min'], $template);
            }
        }

        $statString = str_replace('[value]', $formattedValue, $template);

        return new ModifierLabel($statString, $template);
    }
}
