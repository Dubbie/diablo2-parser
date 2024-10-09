<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\SkillService;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc16Handler implements DescriptionFunctionHandlerInterface
{
    private SkillService $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    // Level [sLvl] [skill] Aura When Equipped
    public function handle(Modifier $modifier): ModifierLabel
    {
        $values = $modifier->getValues();
        $skill = $values['skill'];
        $skillName = $skill->name ?? $skill;
        $template = "Level [value] [skill] Aura When Equipped";

        // Replace placeholders
        $template = str_replace('[skill]', $skillName, $template);

        // Value
        $formattedValue = StatFormatter::formatValue($modifier->getMin(), $modifier->getMax());
        if (is_numeric($formattedValue)) {
            $template = str_replace('[value]', $formattedValue, $template);
        }

        $statString = str_replace('[value]', $formattedValue, $template);

        return new ModifierLabel($statString, $template);
    }
}
