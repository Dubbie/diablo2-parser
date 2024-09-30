<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\SkillService;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DescFunc24Handler implements DescriptionFunctionHandlerInterface
{
    private SkillService $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    // Level [sLvl] [skill] ([charges] Charges)
    public function handle(Modifier $modifier): ModifierLabel
    {
        $charges = $modifier->getMin();
        $level = $modifier->getMax();
        $param = $modifier->getValues()['param'];

        $template = "Level [sLvl] [skill] ([charges] Charges)";
        $skill = $this->skillService->findByParam($param);

        if (!$skill) {
            $output = "Skill with param: $param not found";
            return new ModifierLabel($output, $template);
        }

        $template = str_replace('[sLvl]', $level, $template);
        $template = str_replace('[skill]', $skill->name, $template);
        $template = str_replace('[charges]', $charges, $template);

        return new ModifierLabel($template, $template);
    }
}
