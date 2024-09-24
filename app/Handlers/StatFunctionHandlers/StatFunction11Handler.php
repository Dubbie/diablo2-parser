<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class StatFunction11Handler implements StatFunctionHandlerInterface
{
    public function handle(mixed $min, mixed $max, mixed $param, MappedStat $mappedStat): Modifier
    {
        // Create a modifier
        $modifier = new Modifier();
        $label = $mappedStat->getStat()->stat;

        $modifier->setValues([$max, $param, $min]);
        $label .= sprintf(', 0: %s, 1: %s, 2: %s', $max, $param, $min);

        $modifier->setName($mappedStat->getStat()->stat);
        $modifier->setPriority($mappedStat->getStat()->description->priority ?? 999);
        $modifier->setLabel($label);

        return $modifier;
    }
}
