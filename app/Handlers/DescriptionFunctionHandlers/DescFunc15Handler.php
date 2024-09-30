<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\SkillService;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc15Handler implements DescriptionFunctionHandlerInterface
{
    private SkillService $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    // +[value] [string1]
    public function handle(Modifier $modifier): ModifierLabel
    {
        $values = $modifier->getValues();
        $level = $modifier->getMax() ?? $values['value'];
        $skillParameter = $values['param'];
        $chance = $modifier->getMin() ?? $values['value'];

        $stat = $modifier->getStat();
        $template = "[string1]";
        $descValue = $stat->description->value;
        $string = $stat->description->positive;

        if ($descValue !== null) {
            switch ($descValue) {
                case 0:
                    $template = '[string1]';
                    break;
                case 1:
                case 2:
                default:
                    throw new Exception("Desc Func 15 Handler Desc Value " . $descValue . " not implemented");
                    break;
            }
        }

        $skill = $this->skillService->findByParam($skillParameter);
        if (!$skill) {
            throw new Exception("Skill not found with param: " . $skillParameter);
        }

        // Replace placeholders
        $template = str_replace('[string1]', $string, $template);
        $statString = str_replace('[value]', $level, $template);
        $statString = str_replace('%d%', $chance, $statString);
        $statString = str_replace('%d', $level, $statString);
        $statString = str_replace('%s', $skill->name, $statString);

        return new ModifierLabel($statString, $statString);
    }
}
