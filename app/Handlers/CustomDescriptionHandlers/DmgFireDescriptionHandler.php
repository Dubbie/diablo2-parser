<?php

namespace App\Handlers\CustomDescriptionHandlers;

class DmgFireDescriptionHandler extends BaseDamageHandler
{
    protected function getDamageType(): string
    {
        return "Fire Damage";
    }
}
