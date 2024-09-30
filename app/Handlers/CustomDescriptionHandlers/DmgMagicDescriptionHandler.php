<?php

namespace App\Handlers\CustomDescriptionHandlers;

class DmgMagicDescriptionHandler extends BaseDamageHandler
{
    protected function getDamageType(): string
    {
        return "Magic Damage";
    }
}
