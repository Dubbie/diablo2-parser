<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DescFunc11Handler implements DescriptionFunctionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        $value = $modifier->getValues()['param'] ?? null;
        $value = 100 / $value;

        $template = "Repairs 1 Durability In [value] Seconds";
        $template = str_replace('[value]', $value, $template);

        return new ModifierLabel($template, $template);
    }
}
