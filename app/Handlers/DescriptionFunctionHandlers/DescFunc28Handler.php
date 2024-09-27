<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\SkillService;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc28Handler implements DescriptionFunctionHandlerInterface
{
    // +[value] to [skill]
    private SkillService $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    public function handle(Modifier $modifier): ModifierLabel
    {
        $template = "+[value] to [skill]";

        $skillParam = $modifier->getValues()['param'];
        $skill = $this->skillService->findByParam($skillParam);
        if (!$skill) {
            throw new Exception("Skill not found with param: " . $skillParam);
        }

        // Skill name and class lookup
        $skillName = $skill->name;

        // Get the formatted value
        $formattedValue = StatFormatter::formatValue($modifier->getMin(), $modifier->getMax());

        // Start piecing it together
        $template = str_replace('[skill]', $skillName, $template);

        // Check range
        $range = $modifier->getRange();
        if (empty($range) || $range['value']['min'] === null && $range['value']['max'] === null) {
            $template = str_replace('[value]', $formattedValue, $template);
        } else {
            if ($range['value']['min'] === $range['value']['max']) {
                $template = str_replace('[value]', $formattedValue, $template);
            }
        }

        // Final stat string
        $statString = str_replace('[value]', $formattedValue, $template);

        // Let's go!
        return new ModifierLabel($statString, $template);
    }
}
