<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DmgPoisonDescriptionHandler extends BaseDamageHandler
{
    protected function getDamageType(): string
    {
        return "Poison Damage";
    }

    public function handle(Modifier $modifier): ModifierLabel
    {
        $modifierLabel = parent::handle($modifier);
        $statString = $modifierLabel->label;
        $template = $modifierLabel->template;
        $template .= ' Over [duration] Seconds';
        str_replace('[duration]', $modifier->getValues()['value'], $template);
        $statString .= ' Over ' . $modifier->getValues()['value'] . ' Seconds';
        $template = str_replace('Adds ', '+', $template);
        $statString = str_replace('Adds ', '+', $statString);
        return new ModifierLabel($statString, $template);
    }
}
