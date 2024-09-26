<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class StatFunction10Handler implements StatFunctionHandlerInterface
{
    public function handle(mixed $min, mixed $max, mixed $param, MappedStat $mappedStat): Modifier
    {
        // Create a modifier
        $modifier = new Modifier();
        $values = [];
        $values[] = $param;

        if ($min !== $max) {
            $values[] = $min;
            $values[] = $max;
        } else {
            $values[] = $max;
        }

        $modifier->setValues($values);
        $modifier->setName($mappedStat->getStat()->stat);
        $modifier->setStat($mappedStat->getStat());
        $modifier->setPriority($mappedStat->getStat()->description->priority ?? 999);

        return $modifier;
    }
}
