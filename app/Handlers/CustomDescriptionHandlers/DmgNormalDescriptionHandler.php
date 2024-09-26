<?php

namespace App\Handlers\CustomDescriptionHandlers;

class DmgNormalDescriptionHandler extends BaseDamageHandler
{
    protected function getDamageType(): string
    {
        return 'Damage';
    }
}
