<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'stat';

    protected $fillable = [
        'stat',
        'id',
        'done',
        'direct',
        'max_stat',
        'item_specific',
        'damage_related',
    ];

    protected $with = ['operations', 'description'];

    public function operations()
    {
        return $this->hasMany(StatOperation::class, 'stat', 'stat');
    }

    public function maxStat()
    {
        return $this->hasOne(Stat::class, 'stat', 'max_stat');
    }

    public function description()
    {
        return $this->hasOne(StatDescription::class, 'stat', 'stat');
    }

    public function scopeSearch($query, $searchValue)
    {
        return $query->where(function ($query) use ($searchValue) {
            $query->where('stat', 'like', "%{$searchValue}%")
                ->orWhere('id', 'like', "%{$searchValue}%")
                ->orWhereHas('description', function ($query) use ($searchValue) {
                    $query->where('positive', 'like', "%{$searchValue}%")
                        ->orWhere('negative', 'like', "%{$searchValue}%")
                        ->orWhere('extra', 'like', "%{$searchValue}%")
                        ->orWhere('group_positive', 'like', "%{$searchValue}%")
                        ->orWhere('group_negative', 'like', "%{$searchValue}%")
                        ->orWhere('group_extra', 'like', "%{$searchValue}%");
                });
        });
    }
}
