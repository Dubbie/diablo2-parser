<?php

namespace App\Handlers\PropertyHandlers;

use App\Handlers\PropertyHandlerInterface;
use App\Models\Item;
use App\Models\ItemProperty;
use App\Models\Stat;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\MappedStat;
use Illuminate\Support\Facades\Log;

class DmgMaxPropertyHandler implements PropertyHandlerInterface
{
    public const MAX_ADDED_DAMAGE_STATS = [
        'max_damage',
        'maxdamage',
        'secondary_maxdamage',
        'item_throw_maxdamage',
    ];

    private const BASE_STAT_MODIFIER_MAP = [
        'max_damage' => 'maxdamage',
        'max_2h_damage' => 'secondary_maxdamage',
    ];

    public function handle(Item $item, ItemProperty $itemProperty): array
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
        return [$mappedProperty];
    }
}
