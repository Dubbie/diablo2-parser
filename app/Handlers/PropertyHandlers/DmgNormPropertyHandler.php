<?php

namespace App\Handlers\PropertyHandlers;

use App\Handlers\PropertyHandlerInterface;
use App\Models\Item;
use App\Models\ItemProperty;
use App\Models\Property;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\MappedStat;

class DmgNormPropertyHandler implements PropertyHandlerInterface
{
    private const PROPERTIES = ['dmg-min', 'dmg-max'];

    public function handle(Item $item, ItemProperty $itemProperty): array
    {
        $result = [];

        foreach (self::PROPERTIES as $propertyName) {
            $isMin = strpos($propertyName, 'min') !== false;

            $mappedProperty = new MappedProperty();
            $mappedProperty->setProperty(Property::where('name', $propertyName)->first());

            if ($isMin) {
                $mappedProperty->setMin($itemProperty->min);
                $mappedProperty->setMax($itemProperty->min);
            } else {
                $mappedProperty->setMin($itemProperty->max);
                $mappedProperty->setMax($itemProperty->max);
            }

            $stats = [];
            foreach ($itemProperty->baseProperty->propertyStats as $propertyStat) {
                if ($isMin && strpos($propertyStat->stat, 'min') !== false) {
                    $mappedStat = new MappedStat();
                    $mappedStat->setStat($propertyStat->baseStat);
                    $stats[] = $mappedStat;
                }

                if (!$isMin && strpos($propertyStat->stat, 'max') !== false) {
                    $mappedStat = new MappedStat();
                    $mappedStat->setStat($propertyStat->baseStat);
                    $stats[] = $mappedStat;
                }
            }

            $mappedProperty->setStats($stats);
            $result[] = $mappedProperty;
        }

        return $result;
    }
}
