<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ItemProperty extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'item_id',
        'property',
        'parameter',
        'min',
        'max',
        'property_number',
    ];

    protected $with = ['baseProperty'];

    protected function property(): Attribute
    {
        return Attribute::make(
            get: fn($value) => strtolower($value),
            set: fn($value) => strtolower($value),
        );
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function baseProperty()
    {
        return $this->belongsTo(Property::class, 'property', 'name');
    }
}
