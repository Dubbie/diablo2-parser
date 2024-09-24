<?php

namespace App\Handlers\StatFunctionHandlers;

use App\Handlers\StatFunctionHandlerInterface;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

class DefaultStatFunctionHandler implements StatFunctionHandlerInterface
{
    public function handle(mixed $min, mixed $max, mixed $param, MappedStat $mappedStat): Modifier
    {
        // Create a modifier
        $modifier = new Modifier();
        $label = $mappedStat->getStat()->stat;

        if (is_numeric($min) && is_numeric($max)) {
            $modifier->setMin($min);
            $modifier->setMax($max);
            $label .= sprintf(', Min: %s, Max: %s', $min, $max);
        } else {
            $modifier->setValues([$param, $min, $max]);
            $label .= sprintf(', Param: %s, Min: %s, Max: %s', $param, $min, $max);
        }

        $modifier->setName($mappedStat->getStat()->stat);
        $modifier->setPriority($mappedStat->getStat()->description->priority ?? 999);
        $modifier->setLabel($label);

        return $modifier;
    }
}
