<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillPrerequisite extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'skill_id',
        'prerequisite_id',
    ];
}
