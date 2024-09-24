<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Monster extends Model
{
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'name',
        'name_code',
        'original_name',
        'id'
    ];
}
