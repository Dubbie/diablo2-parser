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
        $value = $values['value'] ?? null;

        // Set min and max values
        $min = $max = $value ?? $modifier->getMin();
        $max = $value ?? $modifier->getMax();

        $stat = $modifier->getStat();
        $this->template = $this->getTemplate();
        $descValue = $stat->description->value;
        $string = $stat->description->positive;
        $extra = $stat->description->extra;
        $formattedValue = StatFormatter::formatValue($min, $max);

        // Handle descValue logic
        if ($descValue !== null) {
            switch ($descValue) {
                case 0:
                    $this->template = '[string1]';
                    break;
                case 2:
                    $split = explode(' ', $this->template);
                    $tmp = $split[0];
                    $split[0] = $split[1];
                    $split[1] = $tmp;
                    $this->template = implode(' ', $split);
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
        $this->template = str_replace('[string2]', $extra, $this->template);

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
