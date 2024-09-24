<?php

namespace App\Services;

use App\Factories\DescriptionFunctionHandlerFactory;
use App\Factories\PropertyHandlerFactory;
use App\Factories\StatFunctionHandlerFactory;
use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\MappedStat;
use App\ValueObjects\Modifier;
use Illuminate\Database\Eloquent\Collection;

class PropertyService
{
    private PropertyHandlerFactory $propertyHandlerFactory;
    private StatFunctionHandlerFactory $statFunctionHandlerFactory;
    private DescriptionFunctionHandlerFactory $descriptionFunctionHandlerFactory;
    private Collection $properties;
    protected Item $item;
    protected array $mappedProperties = [];
    protected array $modifiers = [];

    public function __construct()
    {
        $this->statFunctionHandlerFactory = app(StatFunctionHandlerFactory::class);
        $this->propertyHandlerFactory = app(PropertyHandlerFactory::class);
        $this->descriptionFunctionHandlerFactory = app(DescriptionFunctionHandlerFactory::class);
    }

    public function mapProperties(Item $item): array
    {
        $this->item = $item;
        $this->properties = $item->itemProperties;

        // Map the properties with proper stats
        foreach ($this->properties as $itemProperty) {
            $this->mappedProperties[] = $this->handleMappingProperty($itemProperty);
        }

        // Get all the stats with their values
        // foreach ($this->mappedProperties as $i => $mappedProperty) {
        //     foreach ($mappedProperty->getStats() as $stat) {
        //         $this->modifiers[] = $this->statFunctionHandlerFactory->getHandler($stat->getFunction())
        //             ->handle(
        //                 $mappedProperty->getMin(),
        //                 $mappedProperty->getMax(),
        //                 $mappedProperty->getParam(),
        //                 $stat
        //             );
        //     }
        // }

        // Combine all modifiers
        $this->combineModifiers();

        return $this->modifiers;
    }

    private function handleMappingProperty(ItemProperty $itemProperty): MappedProperty
    {
        return $this->propertyHandlerFactory->getHandler($itemProperty->property)->handle($this->item, $itemProperty);
    }

    private function combineModifiers(): void
    {
        $mappings = [
            [
                'priority' => 36,
                'name' => 'all_resist',
                'match' => true,
                'stats' => ['fireresist', 'lightresist', 'coldresist', 'poisonresist'],
            ],
            [
                'priority' => 120,
                'name' => 'maxdamage_percent',
                'stats' => ['item_maxdamage_percent'],
            ],
        ];

        $mappedProperties = array_filter($this->mappedProperties); // Clean up falsy values

        /** @var MappedProperty $mappedProperty */
        foreach ($mappedProperties as $mappedProperty) {
            $propertyStats = array_map(fn($stat) => $stat->getStat()->stat, $mappedProperty->getStats());

            $mapped = false;
            foreach ($mappings as $mapping) {
                // Filter mappings based on conditions
                if (isset($mapping['partial']) && count(array_intersect($mapping['stats'], $propertyStats)) > 1) {
                    $match = true;
                } elseif (!empty(array_diff($mapping['stats'], $propertyStats))) {
                    continue; // Skip if not all stats are found
                } elseif (array_key_exists('match', $mapping) && $mapping['match'] && !$this->same($propertyStats, $mapping['stats'])) {
                    continue; // If 'match' is true and doesn't fully match, skip
                }

                // Create new modifier
                $newModifier = new Modifier();
                $newModifier->setName($mapping['name']);
                $newModifier->setPriority($mapping['priority']);
                $newModifier->setMin($mappedProperty->getMin());
                $newModifier->setMax($mappedProperty->getMax());

                if ($mappedProperty->getParam()) {
                    $newModifier->setValues([$mappedProperty->getMax(), $mappedProperty->getParam(), $mappedProperty->getMin()]);
                }

                // Add to modifiers
                $this->modifiers[] = $newModifier;

                $mapped = true;
                break;
            }

            if (!$mapped) {

                foreach ($mappedProperty->getStats() as $stat) {
                    if ($stat->getStat()->stat === 'item_numsockets') {
                        continue;
                    }

                    // if ($stat->getStat()->stat === 'item_addskill_tab') {
                    //     dd($stat->getFunction());
                    // }

                    $this->modifiers[] = $this->statFunctionHandlerFactory->getHandler($stat->getFunction())
                        ->handle(
                            $mappedProperty->getMin(),
                            $mappedProperty->getMax(),
                            $mappedProperty->getParam(),
                            $stat
                        );
                }
            }
        }
    }

    private function same(array $modifiers, array $stats): bool
    {
        // Check if arrays have the same elements and in the same order
        return $modifiers === $stats;
    }
}
