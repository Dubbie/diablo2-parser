<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\SkillService;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc13Handler implements DescriptionFunctionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        $param = $modifier->getValues()[0];
        $classData = StatFormatter::getClassStrings($param);
        if (!$classData) {
            throw new Exception("Class not found with param: " . $param);
        }

        $template = "+[value] " . $classData['strAllSkills'];
        $formattedValue = StatFormatter::formatValue($modifier->getMin(), $modifier->getMax());

        // Handle range
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
