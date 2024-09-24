<?php

namespace App\Services;

use App\Factories\PropertyHandlerFactory;
use App\Factories\StatFunctionHandlerFactory;
use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;
use Illuminate\Database\Eloquent\Collection;

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

        // Get all the stats with their values
        foreach ($this->mappedProperties as $i => $mappedProperty) {
            foreach ($mappedProperty->getStats() as $stat) {
                $this->modifiers[] = $this->statFunctionHandlerFactory->getHandler($stat->getFunction())
                    ->handle(
                        $mappedProperty->getMin(),
                        $mappedProperty->getMax(),
                        $mappedProperty->getParam(),
                        $stat
                    );
            }
        }

        return $this->modifiers;
    }

    private function handleMappingProperty(ItemProperty $itemProperty): MappedProperty
    {
        return $this->propertyHandlerFactory->getHandler($itemProperty->property)->handle($this->item, $itemProperty);
    }
}
