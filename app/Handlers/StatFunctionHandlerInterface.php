<?php

namespace App\Handlers;

use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;

interface StatFunctionHandlerInterface
{
    public function handle(mixed $min, mixed $max, mixed $param, MappedStat $transformedStat): Modifier;
}
