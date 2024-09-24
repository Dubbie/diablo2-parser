<?php

namespace App\Handlers;

use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

interface DescriptionFunctionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel;
}
