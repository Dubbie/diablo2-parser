<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyStat extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'property_id',
        'stat_set',
        'value',
        'function',
        'stat',
        'stat_number'
    ];

    protected $with = ['baseStat'];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id', 'id');
    }

    public function baseStat()
    {
        return $this->belongsTo(Stat::class, 'stat', 'stat');
    }
}
