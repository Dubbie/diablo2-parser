<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Handlers\CustomDescriptionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

abstract class BaseDamageHandler implements CustomDescriptionHandlerInterface
{
    /**
     * Get the type of damage.
     *
     * @return string
     */
    protected function getDamageType(): string
    {
        return "Damage"; // Default damage type
    }

    /**
     * Handle the processing of the modifier.
     *
     * @param Modifier $modifier
     * @return ModifierLabel
     */
    public function handle(Modifier $modifier): ModifierLabel
    {
        // Build the template and range data based on the min/max values
        $range = [];
        $template = $this->buildTemplate($modifier, $range);

        // Build the final stat string
        $statString = $this->buildStatString($modifier, $template);

        return new ModifierLabel($statString, $template);
    }

    /**
     * Build the template based on the min/max values and ranges.
     *
     * @param Modifier $modifier
     * @param array $range
     * @return string
     */
    private function buildTemplate(Modifier $modifier, array &$range): string
    {
        // Default template for simple values
        $template = "Adds [value] " . $this->getDamageType();

        $template = "Adds [minValue] to [maxValue] " . $this->getDamageType();

        // Process minValue array
        $template = $this->processMinMaxArray($modifier->getRange('minValue'), '[minValue]', $range, $template);

        // Process maxValue array
        $template = $this->processMinMaxArray($modifier->getRange('maxValue'), '[maxValue]', $range, $template);

        return $template;
    }

    /**
     * Process min/max arrays and modify template if min == max.
     *
     * @param array $value
     * @param string $placeholder
     * @param array &$range
     * @param string $template
     * @return string
     */
    protected function processMinMaxArray(array $value, string $placeholder, array &$range, string $template): string
    {
        if ($value['min'] === $value['max']) {
            // Replace the placeholder if min == max
            return str_replace($placeholder, StatFormatter::formatValue($value['min'], $value['max']), $template);
        }

        // Store range data if min != max
        $range[str_replace(['[', ']'], '', $placeholder)] = $value;
        return $template;
    }

    /**
     * Build the final stat string by replacing placeholders in the template.
     *
     * @param [type] $modifier
     * @param string $template
     * @return string
     */
    protected function buildStatString($modifier, string $template): string
    {
        $minFormatted =  StatFormatter::formatValue($modifier->getMin('minValue'), $modifier->getMax('minValue'));
        $maxFormatted =  StatFormatter::formatValue($modifier->getMin('maxValue'), $modifier->getMax('maxValue'));

        // Replace placeholders in the template
        return str_replace(
            ['[minValue]', '[maxValue]', '[value]'],
            [$minFormatted, $maxFormatted, StatFormatter::formatValue($minFormatted, $maxFormatted)],
            $template
        );
    }
}
