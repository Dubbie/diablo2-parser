<?php

namespace App\Handlers\CustomDescriptionHandlers;

use App\Handlers\CustomDescriptionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;

class DmgPoisonDescriptionHandler implements CustomDescriptionHandlerInterface
{
    public function handle(Modifier $modifier): ModifierLabel
    {
        $min = $modifier->getRange('minValue')['min'];
        $max = $modifier->getRange('minValue')['max'];
        $length = $modifier->getValues()['value'];

        $dmg = $this->calculatePoisonDamage($min, $max, $length);
        $formattedValue = StatFormatter::formatValue($dmg['min'], $dmg['max'], '');
        $string = sprintf('+%s Poison Damage Over %s Seconds', $formattedValue, $dmg['duration']);
        return new ModifierLabel($string, $string);
    }

    private function calculatePoisonDamage(int $poisMin, int $poisMax, int $poisLen)
    {
        // Convert poison length to seconds (length is given in frames, 25 frames per second)
        $poisLenFrames = $poisLen;

        // Damage per frame is in 1/256ths, so convert to damage per frame
        $poisMinPerFrame = $poisMin / 256.0;
        $poisMaxPerFrame = $poisMax / 256.0;

        // Total damage over the duration in frames
        $poisTotalMin = $poisMinPerFrame * $poisLenFrames;
        $poisTotalMax = $poisMaxPerFrame * $poisLenFrames;

        // Convert duration from frames to seconds
        $poisLenSeconds = $poisLenFrames / 25.0;

        return [
            'min' => ceil($poisTotalMin),
            'max' => ceil($poisTotalMax),
            'duration' => round($poisLenSeconds),
        ];
    }
}
