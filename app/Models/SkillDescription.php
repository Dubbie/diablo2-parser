<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class SkillDescription extends Model
{
    public $timestamps = false;

    public const CLASS_MAP = [
        'Amazon' => 'ama',
        'Assassin' => 'ass',
        'Barbarian' => 'bar',
        'Necromancer' => 'nec',
        'Paladin' => 'pal',
        'Sorceress' => 'sor',
        'Druid' => 'dru',
    ];

    protected $fillable = [
        'skill_id',
        'page',
        'skill_row',
        'skill_column',
        'icon_usable',
        'icon_unusable',
        'name_code',
        'name',
        'short_code',
        'short',
        'long_code',
        'long',
        'alt_code',
        'alt',
        'mana_code',
        'mana',
        'damage',
    ];

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
