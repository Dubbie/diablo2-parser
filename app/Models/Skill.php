<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    public $timestamps = false;
    public $incrementing = false;

    public const CLASSMAP = [
        'ama' => 'Amazon',
        'ass' => 'Assassin',
        'bar' => 'Barbarian',
        'pal' => 'Paladin',
        'nec' => 'Necromancer',
        'sor' => 'Sorceress',
        'dru' => 'Druid'
    ];

    public const CLASS_ID_MAP = [
        0 => 'Amazon',
        1 => 'Sorceress',
        2 => 'Necromancer',
        3 => 'Paladin',
        4 => 'Barbarian',
        5 => 'Druid',
        6 => 'Assassin',
    ];

    protected $fillable = [
        'name',
        'id',
        'original_name',
        'character_class',
        'required_level',
        'max_level',
        'description_string',
    ];

    public function description()
    {
        return $this->hasOne(SkillDescription::class);
    }
}
