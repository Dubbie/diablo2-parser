<?php

namespace App\Handlers\PropertyHandlers;

use App\Handlers\PropertyHandlerInterface;
use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\MappedStat;

class DefaultPropertyHandler implements PropertyHandlerInterface
{
    public function handle(Item $item, ItemProperty $itemProperty): MappedProperty
    {
        $mappedProperty = new MappedProperty();
        $mappedProperty->setProperty($itemProperty->baseProperty);
        $mappedProperty->setMin($itemProperty->min);
        $mappedProperty->setMax($itemProperty->max);
        $mappedProperty->setParam($itemProperty->parameter);

        $stats = [];
        foreach ($itemProperty->baseProperty->propertyStats as $propertyStat) {
            $mappedStat = new MappedStat();
            $mappedStat->setFunction($propertyStat->function);
            $mappedStat->setSet($propertyStat->stat_set);
            $mappedStat->setValue($propertyStat->value);
            $mappedStat->setStat($propertyStat->baseStat);

            $stats[] = $mappedStat;
        }

        $mappedProperty->setStats($stats);
        return $mappedProperty;
    }
}
