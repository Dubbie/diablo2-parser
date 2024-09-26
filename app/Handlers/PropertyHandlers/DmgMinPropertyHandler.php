<?php

namespace App\Handlers\PropertyHandlers;

use App\Handlers\PropertyHandlerInterface;
use App\Models\Item;
use App\Models\ItemProperty;
use App\Models\Stat;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\MappedStat;
use Illuminate\Support\Facades\Log;

class DmgMinPropertyHandler implements PropertyHandlerInterface
{
    public const MIN_ADDED_DAMAGE_STATS = [
        'min_damage',
        'mindamage',
        'secondary_mindamage',
        'item_throw_mindamage',
    ];

    private const BASE_STAT_MODIFIER_MAP = [
        'min_damage' => 'mindamage',
        'min_2h_damage' => 'secondary_mindamage',
    ];

    public function handle(Item $item, ItemProperty $itemProperty): MappedProperty
    {
        $mappedProperty = new MappedProperty();
        $mappedProperty->setProperty($itemProperty->baseProperty);
        $mappedProperty->setMin($itemProperty->min);
        $mappedProperty->setMax($itemProperty->max);
        $mappedProperty->setParam($itemProperty->param);

        $stats = [];
        foreach ($item->base_stats as $baseStat => $value) {
            if ($value > 0 && in_array($baseStat, array_keys(self::BASE_STAT_MODIFIER_MAP))) {
                $mappedStat = new MappedStat();
                $mappedStat->setStat(Stat::find(self::BASE_STAT_MODIFIER_MAP[$baseStat]));
                Log::info("Added stat: " . self::BASE_STAT_MODIFIER_MAP[$baseStat]);
                $stats[] = $mappedStat;
            }
        }

        $mappedProperty->setStats($stats);
        return $mappedProperty;
    }
}
