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
            $mappedProperty = $this->createMappedProperty($itemProperty, $propertyName, $isMin);
            $result[] = $mappedProperty;
        }

        return $result;
    }

    /**
     * Creates a MappedProperty with the correct min/max values and associated stats.
     *
     * @param ItemProperty $itemProperty
     * @param string $propertyName
     * @param bool $isMin
     * @return MappedProperty
     */
    private function createMappedProperty(ItemProperty $itemProperty, string $propertyName, bool $isMin): MappedProperty
    {
        $mappedProperty = new MappedProperty();
        $property = Property::where('name', $propertyName)->first();

        // Set the property details
        $mappedProperty->setProperty($property);

        // Assign min/max based on the flag
        if ($isMin) {
            $mappedProperty->setMin($itemProperty->min);
            $mappedProperty->setMax($itemProperty->min);
        } else {
            $mappedProperty->setMin($itemProperty->max);
            $mappedProperty->setMax($itemProperty->max);
        }

        // Set the associated stats
        $mappedProperty->setStats($this->getMappedStats($itemProperty, $isMin));

        return $mappedProperty;
    }

    /**
     * Retrieves the MappedStat array for the given itemProperty.
     *
     * @param ItemProperty $itemProperty
     * @param bool $isMin
     * @return MappedStat[]
     */
    private function getMappedStats(ItemProperty $itemProperty, bool $isMin): array
    {
        $stats = [];

        foreach ($itemProperty->baseProperty->propertyStats as $propertyStat) {
            $isStatMin = strpos($propertyStat->stat, 'min') !== false;
            $isStatMax = strpos($propertyStat->stat, 'max') !== false;

            if (($isMin && $isStatMin) || (!$isMin && $isStatMax)) {
                $mappedStat = new MappedStat();
                $mappedStat->setStat($propertyStat->baseStat);
                $stats[] = $mappedStat;
            }
        }

        return $stats;
    }
}
