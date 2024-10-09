<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\Services\SkillService;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class StatFunction22Handler implements StatFunctionHandlerInterface
{
    private SkillService $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    public function handle(mixed $min, mixed $max, mixed $param, MappedStat $mappedStat): Modifier
    {
        $stat = $mappedStat->getStat();

        // Create a modifier
        $modifier = new Modifier();

        // Set the range
        $modifier->setRange([
            'value' => [
                'min' => $min,
                'max' => $max
            ]
        ]);

        $skill = $this->skillService->findByParam($param) ?? $param;

        $modifier->setValues(['skill' => $skill]);
        $modifier->setName($stat->stat);
        $modifier->setStat($stat);
        $modifier->setPriority($stat->description->priority ?? 999);

        return $modifier;
    }
}
