<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class StatFunction21Handler implements StatFunctionHandlerInterface
{
    // Uses Value to update the param.
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

        // Set the value based on the value of the mapped stat,
        // this is the class ID
        $values = ['param' => $mappedStat->getValue()];

        $modifier->setValues($values);
        $modifier->setName($stat->stat);
        $modifier->setStat($stat);
        $modifier->setPriority($stat->description->priority ?? 999);

        return $modifier;
    }
}
