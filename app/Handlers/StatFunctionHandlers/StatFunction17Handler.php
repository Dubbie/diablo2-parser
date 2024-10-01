<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class StatFunction17Handler implements StatFunctionHandlerInterface
{
    // Use only param.
    public function handle(mixed $min, mixed $max, mixed $param, MappedStat $mappedStat): Modifier
    {
        // Create a modifier
        $modifier = new Modifier();

        // Handle if we have op param
        $perLevel = 0;
        if ($mappedStat->getStat()->operations->count() > 0) {
            if ($param) {
                $min = $max = intval($param);
            }
            $param = $mappedStat->getStat()->operations[0]->parameter;
            $opParam = pow(2, $param);
            $perLevel = $min / $opParam;

            $modifier->setValues([
                'perLevel' => $perLevel
            ]);
        } else {
            $modifier->setValues([
                'param' => $param
            ]);
        }

        $modifier->setName($mappedStat->getStat()->stat);
        $modifier->setStat($mappedStat->getStat());
        $modifier->setPriority($mappedStat->getStat()->description->priority ?? 999);

        return $modifier;
    }
}
