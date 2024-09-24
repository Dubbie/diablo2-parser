<?php

namespace App\Services;

use App\Models\TblEntry;

class StatFormatter
{
    public const CLASS_STRINGS = [
        '0' => [
            'strAllSkills' => 'ModStr3a',
            'strSkillTab1' => 'StrSklTabItem3',
            'strSkillTab2' => 'StrSklTabItem2',
            'strSkillTab3' => 'StrSklTabItem1',
            'strClassOnly' => 'AmaOnly',
        ],
        '1' => [
            'strAllSkills' => 'ModStr3d',
            'strSkillTab1' => 'StrSklTabItem15',
            'strSkillTab2' => 'StrSklTabItem14',
            'strSkillTab3' => 'StrSklTabItem13',
            'strClassOnly' => 'SorOnly',
        ],
        '2' => [
            'strAllSkills' => 'ModStr3c',
            'strSkillTab1' => 'StrSklTabItem8',
            'strSkillTab2' => 'StrSklTabItem7',
            'strSkillTab3' => 'StrSklTabItem9',
            'strClassOnly' => 'NecOnly',
        ],
        '3' => [
            'strAllSkills' => 'ModStr3b',
            'strSkillTab1' => 'StrSklTabItem6',
            'strSkillTab2' => 'StrSklTabItem5',
            'strSkillTab3' => 'StrSklTabItem4',
            'strClassOnly' => 'PalOnly',
        ],
        '4' => [
            'strAllSkills' => 'ModStr3e',
            'strSkillTab1' => 'StrSklTabItem11',
            'strSkillTab2' => 'StrSklTabItem12',
            'strSkillTab3' => 'StrSklTabItem10',
            'strClassOnly' => 'BarOnly',
        ],
        '5' => [
            'strAllSkills' => 'ModStre8a_PD2',
            'strSkillTab1' => 'StrSklTabItem16',
            'strSkillTab2' => 'StrSklTabItem17',
            'strSkillTab3' => 'StrSklTabItem18',
            'strClassOnly' => 'DruOnly',
        ],
        '6' => [
            'strAllSkills' => 'ModStre8b_PD2',
            'strSkillTab1' => 'StrSklTabItem19',
            'strSkillTab2' => 'StrSklTabItem20',
            'strSkillTab3' => 'StrSklTabItem21',
            'strClassOnly' => 'AssOnly',
        ],
    ];

    public const SKILLTAB_MAP = [
        0 => [
            'skilltab' => 'Bow and Crossbow Skills',
            'class' => 'Amazon'
        ],
        1 => [
            'skilltab' => 'Passive and Magic Skills',
            'class' => 'Amazon'
        ],
        2 => [
            'skilltab' => 'Javelin and Spear Skills',
            'class' => 'Amazon'
        ],
        3 => [
            'skilltab' => 'Fire Spells',
            'class' => 'Sorceress',
        ],
        4 => [
            'skilltab' => 'Lightning Spells',
            'class' => 'Sorceress',
        ],
        5 => [
            'skilltab' => 'Cold Spells',
            'class' => 'Sorceress',
        ],
        6 => [
            'skilltab' => 'Curses',
            'class' => 'Necromancer'
        ],
        7 => [
            'skilltab' => 'Poison and Bone Skills',
            'class' => 'Necromancer'
        ],
        8 => [
            'skilltab' => 'Summoning Skills',
            'class' => 'Necromancer'
        ],
        9 => [
            'skilltab' => 'Combat Skills',
            'class' => 'Paladin'
        ],
        10 => [
            'skilltab' => 'Offensive Auras',
            'class' => 'Paladin'
        ],
        11 => [
            'skilltab' => 'Defensive Auras',
            'class' => 'Paladin'
        ],
        12 => [
            'skilltab' => 'Combat Skills',
            'class' => 'Barbarian'
        ],
        13 => [
            'skilltab' => 'Combat Masteries',
            'class' => 'Barbarian'
        ],
        14 => [
            'skilltab' => 'Warcries',
            'class' => 'Barbarian'
        ],
        15 => [
            'skilltab' => 'Summoning Skills',
            'class' => 'Druid'
        ],
        16 => [
            'skilltab' => 'Shape Shifting Skills',
            'class' => 'Druid'
        ],
        17 => [
            'skilltab' => 'Elemental Skills',
            'class' => 'Druid'
        ],
        18 => [
            'skilltab' => 'Traps',
            'class' => 'Assassin',
        ],
        19 => [
            'skilltab' => 'Shadow Disciplines',
            'class' => 'Assassin',
        ],
        20 => [
            'skilltab' => 'Martial Arts',
            'class' => 'Assassin',
        ],
    ];

    public static function formatValue(mixed $min, mixed $max, string $bracketType = '[]'): string
    {
        $template = '[%s-%s]';

        switch ($bracketType) {
            case '()':
                $template = '(%s-%s)';
                break;
            case '':
                $template = '%s-%s';
                break;
            default:
                break;
        }

        $value = sprintf($template, $min, $max);

        if ($min == $max) {
            $value = $min;
        }

        return $value ?? '';
    }

    public static function getClassStrings(?string $id)
    {
        if ($id === null) {
            return null;
        }

        if (!isset(self::CLASS_STRINGS[$id])) {
            return null;
        }

        $data = self::CLASS_STRINGS[$id];
        foreach ($data as $key => $value) {
            $data[$key] = TblEntry::find($value)->value ?? $value;
        }

        return $data;
    }

    public static function getClassOnlyBySkillTab(string $strSkillTab): ?string
    {
        foreach (self::CLASS_STRINGS as $classData) {
            // Go through strSkillTab1,2,3 and find if it matches $strSkillTab
            if (
                $classData['strSkillTab1'] === $strSkillTab ||
                $classData['strSkillTab2'] === $strSkillTab ||
                $classData['strSkillTab3'] === $strSkillTab
            ) {
                return TblEntry::find($classData['strClassOnly'])->value ?? $classData['strClassOnly'];
            }
        }

        return null;
    }
}
