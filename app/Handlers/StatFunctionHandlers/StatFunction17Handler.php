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
        if ($mappedStat->getStat()->operations->count() > 0) {
            $min = $max = $param;
            $param = $mappedStat->getStat()->operations[0]->parameter;
        }

        $values = [];
        $values[] = $param;

        if ($min !== $max) {
            $values[] = $min;
            $values[] = $max;
        } else {
            $values[] = $min;
        }

        $modifier->setValues($values);
        $modifier->setName($mappedStat->getStat()->stat);
        $modifier->setStat($mappedStat->getStat());
        $modifier->setPriority($mappedStat->getStat()->description->priority ?? 999);

        return $modifier;
    }
}
