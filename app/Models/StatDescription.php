<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatDescription extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = 'stat';

    protected $fillable = [
        'stat',
        'priority',
        'function',
        'value',
        'positive_code',
        'negative_code',
        'extra_code',
        'positive',
        'negative',
        'extra',
        'group',
        'group_priority',
        'group_function',
        'group_value',
        'group_positive_code',
        'group_negative_code',
        'group_extra_code',
        'group_positive',
        'group_negative',
        'group_extra',
    ];
}
