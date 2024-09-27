<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DescFunc5Handler implements DescriptionFunctionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        $values = $modifier->getValues();
        $value = $values['value'] ?? null;

        // Set min and max values
        $min = $max = $value ?? $modifier->getMin();
        $max = $value ?? $modifier->getMax();

        // Modify them based on the description function
        $min = $min * 100 / 128;
        $max = $max * 100 / 128;

        $stat = $modifier->getStat();
        $template = '[value]% [string1]';
        $descValue = $stat->description->value;
        $string = $stat->description->positive;
        $formattedValue = StatFormatter::formatValue($min, $max);

        // Handle descValue logic
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
            $template = str_replace('+', '', $template);
        }

        // Replace placeholders
        $template = str_replace('[string1]', $string, $template);

        $range = $modifier->getRange();
        if (empty($range) || $range['value']['min'] === null && $range['value']['max'] === null) {
            $template = str_replace('[value]', $formattedValue, $template);
        } else {
            if ($range['value']['min'] === $range['value']['max']) {
                $template = str_replace('[value]', $range['value']['min'], $template);
            }
        }

        // Handle percentage symbol if applicable
        $statString = str_replace('[value]', $formattedValue, $template);

        return new ModifierLabel($statString, $template);
    }
}
