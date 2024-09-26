<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Models\Skill;
use App\Services\SkillService;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc27Handler implements DescriptionFunctionHandlerInterface
{
    // +[value] to [skill] ([class] Only)
    private SkillService $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    public function handle(Modifier $modifier): ModifierLabel
    {
        $template = "+[value] to [skill] ([class] Only)";

        $skillParam = $modifier->getValues()[0];
        $skill = $this->skillService->findByParam($skillParam);
        if (!$skill) {
            throw new Exception("Skill not found with param: " . $skillParam);
        }

        // Skill name and class lookup
        $skillName = $skill->name;
        $skillClass = Skill::CLASSMAP[$skill->character_class];

        // Get the formatted value
        $formattedValue = StatFormatter::formatValue($modifier->getMin(), $modifier->getMax());

        // Start piecing it together
        $template = str_replace('[skill]', $skillName, $template);
        $template = str_replace('[class]', $skillClass, $template);
        $statString = str_replace('[value]', $formattedValue, $template);

        // Let's go!
        return new ModifierLabel($statString, $template);
    }
}
