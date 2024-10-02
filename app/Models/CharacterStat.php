<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharacterStat extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'name';

    protected $fillable = [
        'name',
        'base_attributes',
        'hp_extra',
        'life_per_level',
        'mana_per_level',
        'mana_regen',
        'life_per_vitality',
        'stat_per_level',
        'base_block',
        'to_hit_factor',
    ];

    protected $casts = [
        'base_attributes' => 'array',
    ];
}
