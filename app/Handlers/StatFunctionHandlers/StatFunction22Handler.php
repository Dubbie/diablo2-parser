<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class StatFunction22Handler implements StatFunctionHandlerInterface
{
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

        $modifier->setValues([$param]);
        $modifier->setName($stat->stat);
        $modifier->setStat($stat);
        $modifier->setPriority($stat->description->priority ?? 999);

        return $modifier;
    }
}
