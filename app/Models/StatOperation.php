<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatOperation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'stat',
        'operation',
        'parameter',
        'value',
        'base',
        'affected_stat',
    ];

    public function stat()
    {
        return $this->belongsTo(Stat::class, 'stat', 'stat');
    }
}
