<?php

namespace App\Models;

use App\Factories\CustomDescriptionHandlerFactory;
use App\Factories\DescriptionFunctionHandlerFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ItemModifier extends Model
{
    public $timestamps = false;
    private DescriptionFunctionHandlerFactory $descriptionFunctionHandlerFactory;
    private CustomDescriptionHandlerFactory $customDescriptionHandlerFactory;

    protected $fillable = [
        'item_id',
        'name',
        'stat',
        'priority',
        'values',
        'min',
        'max',
    ];

    public $appends = ['label'];

    public $casts = [
        'values' => 'array',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->descriptionFunctionHandlerFactory = app(DescriptionFunctionHandlerFactory::class);
        $this->customDescriptionHandlerFactory = app(CustomDescriptionHandlerFactory::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->generateLabel()
        );
    }

    private function generateLabel()
    {
        return $this->name . ' label';
    }
}
