<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;

class DescFunc2Handler implements DescriptionFunctionHandlerInterface
{
    // [value]% [string1]
    public function handle(Modifier $modifier): string
    {
        $min = $modifier->getMin() ?? $modifier->getValues()[0];
        $max = $modifier->getMax() ?? $modifier->getValues()[0];
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
        $statString = str_replace('[value]', $formattedValue, $template);

        return $statString;
    }
}
