<?php

namespace App\Handlers;

use App\ValueObjects\Modifier;

interface CustomDescriptionHandlerInterface
{
    public function handle(Modifier $modifier): string;
}
