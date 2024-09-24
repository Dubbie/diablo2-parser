<?php

namespace App\Models;

use App\Services\PropertyService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    public $timestamps = false;

    public const BASE_STAT_MAP = [
        'wclass' => 'weapon_class',
        '2handedwclass' => '2h_weapon_class',
        'levelreq' => 'required_level',
        'reqstr' => 'required_str',
        'reqdex' => 'required_dex',
        'speed' => 'speed',
        'minac'  => 'min_ac',
        'maxac'  => 'max_ac',
        'block'  => 'block',
        'indestructable' => 'indestructable',
        'mindam' => 'min_damage',
        'maxdam' => 'max_damage',
        '2handmindam' => 'min_2h_damage',
        '2handmaxdam' => 'max_2h_damage',
        'minmisdam' => 'min_missile_damage',
        'maxmisdam' => 'max_missile_damage',
    ];

    protected $fillable = [
        'name',
        'base_name',
        'type',
        'type2',
        'code',
        'image',
        'code_normal',
        'code_exceptional',
        'code_elite',
        'rarity',
        'one_or_two_handed',
        'two_handed',
        'spawnable',
        'base_stats',
        'str_bonus',
        'dex_bonus',
        'durability',
        'no_durability',
        'level',
        'magic_level',
        'width',
        'height',
        'has_inventory',
        'sockets',
        'gem_apply_type',
        'unique',
        'skip_base_name',
    ];

    protected $casts = [
        'base_stats' => 'array'
    ];

    public function itemProperties()
    {
        return $this->hasMany(ItemProperty::class, 'item_id', 'id');
    }

    public function scopeSearchByName($query, $name)
    {
        return $query->where('name', 'like', '%' . $name . '%')->orWhere('base_name', 'like', '%' . $name . '%');
    }

    public function scopeByItemType($query, $type)
    {
        return $query->where('item_type', $type);
    }

    public function modifiers(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getModifiers()
        );
    }

    private function getModifiers()
    {
        $propertyService = new PropertyService();
        return $propertyService->mapProperties($this);
    }
}
