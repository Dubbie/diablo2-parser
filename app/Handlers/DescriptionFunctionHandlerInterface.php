<?php

namespace App\Handlers;

use App\ValueObjects\Modifier;

interface DescriptionFunctionHandlerInterface
{
    public function handle(Modifier $modifier): string;
}
