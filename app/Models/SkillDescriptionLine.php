<?php

namespace App\Models;

use App\Services\SkillFormatter;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class SkillDescriptionLine extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'skill_description_id',
        'type',
        'function',
        'text_a',
        'text_b',
        'text_a_code',
        'text_b_code',
        'calc_a',
        'calc_b',
        'priority',
    ];

    public function skillDescription()
    {
        return $this->belongsTo(SkillDescription::class);
    }
}
