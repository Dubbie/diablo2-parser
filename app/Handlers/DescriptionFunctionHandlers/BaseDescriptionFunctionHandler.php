<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

abstract class BaseDescriptionFunctionHandler implements DescriptionFunctionHandlerInterface
{
    protected string $template;

    // Abstract method for the specific template
    abstract protected function getTemplate(): string;

    public function handle(Modifier $modifier): ModifierLabel
    {
        $values = $modifier->getValues();
        $value = count($values) === 1 ? $values[0] : null;

        // Set min and max values
        $min = $max = $value ?? $modifier->getMin() ?? $values[0];
        $max = $value ?? $modifier->getMax() ?? ($values[1] ?? $values[0]);

        $stat = $modifier->getStat();
        $this->template = $this->getTemplate();
        $descValue = $stat->description->value;
        $string = $stat->description->positive;
        $formattedValue = StatFormatter::formatValue($min, $max);

        // Handle descValue logic
        if ($descValue !== null) {
            switch ($descValue) {
                case 0:
                    $this->template = '[string1]';
                    break;
                case 2:
                    $this->template = str_replace('[value]', $formattedValue, $this->template);
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
            $this->template = str_replace('+', '', $this->template);
        }

        // Replace placeholders
        $this->template = str_replace('[string1]', $string, $this->template);

        $range = $modifier->getRange();
        if (empty($range) || $range['value']['min'] === null && $range['value']['max'] === null) {
            $this->template = str_replace('[value]', $formattedValue, $this->template);
        } else {
            if ($range['value']['min'] === $range['value']['max']) {
                $this->template = str_replace('[value]', $range['value']['min'], $this->template);
            }
        }

        // Handle percentage symbol if applicable
        $statString = str_replace('[value]', $formattedValue, $this->template);

        return new ModifierLabel($statString, $this->template);
    }
}
