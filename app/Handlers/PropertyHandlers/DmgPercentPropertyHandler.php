<?php

namespace App\Handlers\PropertyHandlers;

use App\Handlers\PropertyHandlerInterface;
use App\Models\Item;
use App\Models\ItemProperty;
use App\Models\Stat;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\MappedStat;

class DmgPercentPropertyHandler implements PropertyHandlerInterface
{
    public const MIN_ADDED_DAMAGE_STATS = [
        'min_damage',
        'mindamage',
        'secondary_mindamage',
        'item_throw_mindamage',
    ];

    public const MAX_ADDED_DAMAGE_STATS = [
        'max_damage',
        'maxdamage',
        'secondary_maxdamage',
        'item_throw_maxdamage',
        // 'item_maxdamage_perlevel',
    ];

    public const ADDED_DAMAGE_STATS = ['item_normaldamage'];

    public const MIN_DAMAGE_PERCENT_STATS = [
        'item_mindamage_percent',
        'maxdamage_percent',
        // 'maxdamage_percent_perlevel',
    ];

    public const MAX_DAMAGE_PERCENT_STATS = [
        'item_maxdamage_percent',
        // 'item_maxdamage_percent_perlevel',
        'maxdamage_percent',
        // 'maxdamage_percent_perlevel',
    ];

    public function handle(Item $item, ItemProperty $itemProperty): MappedProperty
    {
        $mappedProperty = new MappedProperty();
        $mappedProperty->setProperty($itemProperty->baseProperty);
        $mappedProperty->setMin($itemProperty->min);
        $mappedProperty->setMax($itemProperty->max);
        $mappedProperty->setParam($itemProperty->param);

        $stats = [];
        $mappedStat = new MappedStat();
        // $mappedStat->setFunction($propertyStat->function);
        // $mappedStat->setSet($propertyStat->stat_set);
        // $mappedStat->setValue($propertyStat->value);
        $mappedStat->setStat(Stat::find('item_maxdamage_percent'));
        $stats[] = $mappedStat;

        $mappedProperty->setStats($stats);
        return $mappedProperty;
    }
}
