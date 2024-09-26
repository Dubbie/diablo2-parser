<?php

namespace App\Services;

use App\Factories\PropertyHandlerFactory;
use App\Factories\StatFunctionHandlerFactory;
use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;
use App\ValueObjects\Modifier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class PropertyService
{
    private PropertyHandlerFactory $propertyHandlerFactory;
    private StatFunctionHandlerFactory $statFunctionHandlerFactory;
    private Collection $properties;
    protected Item $item;
    protected array $mappedProperties = [];
    protected array $modifiers = [];

    public function __construct()
    {
        $this->statFunctionHandlerFactory = app(StatFunctionHandlerFactory::class);
        $this->propertyHandlerFactory = app(PropertyHandlerFactory::class);
    }

    public function mapProperties(Item $item): array
    {
        $this->item = $item;
        $this->properties = $item->itemProperties;



        // Map the properties with proper stats
        foreach ($this->properties as $itemProperty) {
            $this->mappedProperties[] = $this->handleMappingProperty($itemProperty);
        }

        // Combine all modifiers
        $this->combineModifiers();

        return $this->modifiers;
    }

    private function handleMappingProperty(ItemProperty $itemProperty): MappedProperty
    {
        return $this->propertyHandlerFactory
            ->getHandler($itemProperty->property)
            ->handle($this->item, $itemProperty);
    }

    private function combineModifiers(): void
    {
        $mappings = $this->getMappings();
        $this->applyMappings($mappings);
        $this->handleUnmappedProperties();
        $this->applyAdditionalMappings();
        $this->finalizeModifiers();
    }

    private function getMappings(): array
    {
        return [
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
    }

    private function applyMappings(array $mappings): void
    {
        $mappedProperties = array_filter($this->mappedProperties);

        foreach ($mappedProperties as $mappedProperty) {
            $propertyStats = $this->getPropertyStats($mappedProperty);

            foreach ($mappings as $mapping) {
                if (!$this->shouldMap($mapping, $propertyStats)) {
                    continue;
                }

                $newModifier = $this->createModifierFromMapping($mapping, $mappedProperty);
                $this->modifiers[] = $newModifier;

                // Remove original mapped property
                $this->removeMappedProperty($mappedProperty);
                break;
            }
        }
    }

    private function shouldMap(array $mapping, array $propertyStats): bool
    {
        if (isset($mapping['partial']) && count(array_intersect($mapping['stats'], $propertyStats)) > 1) {
            return true;
        }

        if (!empty(array_diff($mapping['stats'], $propertyStats))) {
            return false;
        }

        if (isset($mapping['match']) && $mapping['match'] && !$this->same($propertyStats, $mapping['stats'])) {
            return false;
        }

        return true;
    }

    private function createModifierFromMapping(array $mapping, MappedProperty $mappedProperty): Modifier
    {
        $newModifier = new Modifier();
        $newModifier->setName($mapping['name']);
        $newModifier->setPriority($mapping['priority']);
        $newModifier->setRange([
            'value' => [
                'min' => $mappedProperty->getMin(),
                'max' => $mappedProperty->getMax(),
            ]
        ]);

        if ($mappedProperty->getParam()) {
            $newModifier->setValues([$mappedProperty->getMax(), $mappedProperty->getParam(), $mappedProperty->getMin()]);
        }

        return $newModifier;
    }

    private function removeMappedProperty(MappedProperty $mappedProperty): void
    {
        $key = array_search($mappedProperty, $this->mappedProperties);
        unset($this->mappedProperties[$key]);
    }

    private function getPropertyStats(MappedProperty $mappedProperty): array
    {
        return array_map(fn($stat) => $stat->getStat()->stat, $mappedProperty->getStats());
    }

    private function handleUnmappedProperties(): void
    {
        foreach ($this->mappedProperties as $mappedProperty) {
            foreach ($mappedProperty->getStats() as $stat) {
                if ($stat->getStat()->stat === 'item_numsockets') {
                    continue;
                }

                $this->modifiers[] = $this->statFunctionHandlerFactory
                    ->getHandler($stat->getFunction())
                    ->handle($mappedProperty->getMin(), $mappedProperty->getMax(), $mappedProperty->getParam(), $stat);
            }
        }
    }

    private function applyAdditionalMappings(): void
    {
        $additionalMappings = [
            [
                'name' => 'dmg_normal',
                'priority' => 'secondary_mindamage',
                'stats' => ['secondary_mindamage', 'secondary_maxdamage'],
            ],
            [
                'name' => 'dmg_lightning',
                'priority' => 'lightmindam',
                'stats' => ['lightmindam', 'lightmaxdam'],
            ],
            [
                'name' => 'dmg_fire',
                'priority' => 'firemindam',
                'stats' => ['firemindam', 'firemaxdam'],
            ],
        ];

        foreach ($additionalMappings as $mapping) {
            $this->combineRelatedModifiers($mapping);
        }
    }

    private function combineRelatedModifiers(array $mapping): void
    {
        $foundModifiers = array_filter(
            $this->modifiers,
            fn($modifier) => in_array($modifier->getName(), $mapping['stats'])
        );

        if (count($foundModifiers) !== count($mapping['stats'])) {
            return;
        }

        $newModifier = $this->createCombinedModifier($mapping, $foundModifiers);
        $this->modifiers[] = $newModifier;

        $this->removeModifiers($foundModifiers);
    }

    private function createCombinedModifier(array $mapping, array $foundModifiers): Modifier
    {
        $newModifier = new Modifier();
        $newModifier->setName($mapping['name']);
        $range = [];

        foreach ($foundModifiers as $modifier) {
            $isMin = strpos($modifier->getName(), 'min') !== false;
            $fixedValue = $modifier->getValues()[0] ?? null;


            if ($isMin) {
                $range['minValue']['min'] = $fixedValue ?? $modifier->getRange()['value']['min'];
                $range['minValue']['max'] = $fixedValue ?? $modifier->getRange()['value']['max'];
            } else {
                $range['maxValue']['min'] = $fixedValue ?? $modifier->getRange()['value']['min'];
                $range['maxValue']['max'] = $fixedValue ?? $modifier->getRange()['value']['max'];
            }

            if ($modifier->getName() === $mapping['priority']) {
                $newModifier->setPriority($modifier->getPriority());
            }
        }

        $newModifier->setRange($range);
        return $newModifier;
    }

    private function removeModifiers(array $foundModifiers): void
    {
        foreach ($foundModifiers as $modifier) {
            Log::info($modifier->getName());
            $key = array_search($modifier, $this->modifiers);
            unset($this->modifiers[$key]);
        }
    }

    private function finalizeModifiers(): void
    {
        usort($this->modifiers, fn($a, $b) => $a->getPriority() < $b->getPriority());
        $this->modifiers = array_values(array_map(fn($modifier) => $modifier->toArray(), $this->modifiers));
    }


    private function same(array $modifiers, array $stats): bool
    {
        // Check if arrays have the same elements and in the same order
        return $modifiers === $stats;
    }
}
