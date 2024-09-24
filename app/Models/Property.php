<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    protected $with = ['propertyStats'];

    public function propertyStats()
    {
        return $this->hasMany(PropertyStat::class, 'property_id', 'id');
    }
}
