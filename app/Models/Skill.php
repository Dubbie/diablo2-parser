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
        'min_mana',
        'mana_shift',
        'mana',
        'mana_per_level',
        'calc_1',
        'calc_2',
        'calc_3',
        'calc_4',
        'client_calc_1',
        'client_calc_2',
        'client_calc_3',
        'aura_filter',
        'aura_state',
        'aura_target_state',
        'aura_len_calc',
        'aura_range_calc',
        'aura_stat_1',
        'aura_stat_2',
        'aura_stat_3',
        'aura_stat_4',
        'aura_stat_5',
        'aura_stat_6',
        'aura_calc_1',
        'aura_calc_2',
        'aura_calc_3',
        'aura_calc_4',
        'aura_calc_5',
        'aura_calc_6',
        'server_start_function',
        'server_do_function',
        'passive_state',
        'passive_item_type',
        'passive_stat_1',
        'passive_calc_1',
        'passive_stat_2',
        'passive_calc_2',
        'passive_stat_3',
        'passive_calc_3',
        'passive_stat_4',
        'passive_calc_4',
        'passive_stat_5',
        'passive_calc_5',
        'param_1',
        'param_2',
        'param_3',
        'param_4',
        'param_5',
        'param_6',
        'param_7',
        'param_8',
        'to_hit',
        'to_hit_per_level',
        'to_hit_calc',
        'hit_shift',
        'src_dmg',
        'min_dam',
        'min_dam_level_1',
        'min_dam_level_2',
        'min_dam_level_3',
        'min_dam_level_4',
        'min_dam_level_5',
        'max_dam',
        'max_dam_level_1',
        'max_dam_level_2',
        'max_dam_level_3',
        'max_dam_level_4',
        'max_dam_level_5',
        'dmg_sym_per_calc',
        'e_type',
        'e_min',
        'e_min_level_1',
        'e_min_level_2',
        'e_min_level_3',
        'e_min_level_4',
        'e_min_level_5',
        'e_max',
        'e_max_level_1',
        'e_max_level_2',
        'e_max_level_3',
        'e_max_level_4',
        'e_max_level_5',
        'e_dmg_sym_per_calc',
        'e_len',
        'e_len_level_1',
        'e_len_level_2',
        'e_len_level_3',
        'e_len_sym_per_calc',
    ];

    public function description()
    {
        return $this->hasOne(SkillDescription::class);
    }

    public function skillPrerequisites()
    {
        return $this->hasMany(SkillPrerequisite::class);
    }
}
