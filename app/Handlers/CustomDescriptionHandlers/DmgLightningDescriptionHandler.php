<?php

namespace App\Handlers\CustomDescriptionHandlers;

class DmgLightningDescriptionHandler extends BaseDamageHandler
{
    protected function getDamageType(): string
    {
        return "Lightning Damage";
    }
}
