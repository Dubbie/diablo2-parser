<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;

class DescFunc20Handler implements DescriptionFunctionHandlerInterface
{
    // [value * -1]% [string1]
    public function handle(Modifier $modifier): string
    {
        $min = $modifier->getMin() ?? $modifier->getValues()[0];
        $max = $modifier->getMax() ?? $modifier->getValues()[0];
        $stat = $modifier->getStat();
        $template = "-[value]% [string1]";
        $descValue = $stat->description->value;
        $string = $stat->description->positive;
        $formattedValue = StatFormatter::formatValue($min, $max);

        if ($descValue !== null) {
            switch ($descValue) {
                case 0:
                    $template = '[string1]';
                    break;
                case 2:
                    $template = '[string1] -[value]%';
                    break;
                default:
                    break;
            }
        }

        // Replace placeholders
        $template = str_replace('[string1]', $string, $template);
        $statString = str_replace('[value]', $formattedValue, $template);

        return $statString;
    }
}
