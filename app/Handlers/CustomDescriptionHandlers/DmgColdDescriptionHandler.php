<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DmgColdDescriptionHandler extends BaseDamageHandler
{
    protected function getDamageType(): string
    {
        return "Cold Damage";
    }

    public function handle(Modifier $modifier): ModifierLabel
    {
        $modifierLabel = parent::handle($modifier);

        $length = $modifier->getValues()['value'] ?? null;
        if ($length) {
            $modifierLabel->label .= sprintf(' (Slows for %s Seconds)', $length / 25);
            $modifierLabel->template .= sprintf(' (Slows for %s Seconds)', $length / 25);
        }

        return $modifierLabel;
    }
}
