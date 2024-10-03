<?php

namespace App\Services;

class SkillFormatter
{
    const FUNC_MAP = [
        1 => 'Boolean',
        2 => 'S1 + C1 S2',
        3 => 'S1 C1 S2',
        4 => 'S1+C1',
        5 => 'S1 C1',
        6 => '+C1 S1',
        7 => 'C1 S1',
        8 => 'S1 S2',
        9 => 'S1 S2 Damage: +C2',
        10 => 'S1 S2 Damage: C2',
        18 => 'S1',
        73 => 'C1/C2 S1',
    ];

    public static function formatDescriptionLine(int $function, ?string $textA, ?string $textB, ?string $calcA, ?string $calcB): string
    {
        if (!isset(self::FUNC_MAP[$function])) {
            return 'Uhandled function: ' . $function;
        }

        $template = self::FUNC_MAP[$function];
        $template = str_replace('S1', $textA, $template);
        $template = str_replace('S2', $textB, $template);
        $template = str_replace('C1', $calcA, $template);
        $template = str_replace('C2', $calcB, $template);

        return $template;
    }
}
