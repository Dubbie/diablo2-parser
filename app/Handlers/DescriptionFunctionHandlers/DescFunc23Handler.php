<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\MonsterService;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use Exception;

class DescFunc23Handler implements DescriptionFunctionHandlerInterface
{
    private MonsterService $monsterService;

    public function __construct(MonsterService $monsterService)
    {
        $this->monsterService = $monsterService;
    }

    // monster
    public function handle(Modifier $modifier): string
    {
        $statModel = $modifier->getStat();
        $template = sprintf('+[value]%% %s [monster]', $statModel->description->positive);

        $values = $modifier->getValues();
        $param = $values[0];
        $min = $values[1];
        $max = $values[2] ?? $min;

        $formattedValue = StatFormatter::formatValue($min, $max);

        $monster = $this->monsterService->getMonsterByParam($param);
        if (!$monster) {
            throw new Exception("Monster not found with param: " . $param);
        }

        $template = str_replace('[monster]', $monster->name, $template);
        $statString = str_replace('[value]', $formattedValue, $template);

        return $statString;
    }
}
