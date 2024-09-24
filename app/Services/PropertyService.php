<?php

namespace App\Services;

use App\Factories\PropertyHandlerFactory;
use App\Models\Item;
use App\Models\ItemProperty;
use App\ValueObjects\MappedProperty;
use Illuminate\Database\Eloquent\Collection;

class PropertyService
{
    // private StatFunctionHandlerFactory $statFunctionHandlerFactory;
    private PropertyHandlerFactory $propertyHandlerFactory;
    private Collection $properties;
    protected Item $item;
    protected array $mappedProperties = [];
    protected array $modifiers = [];

    public function __construct()
    {
        // $this->statFunctionHandlerFactory = app(StatFunctionHandlerFactory::class);
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


        return $this->mappedProperties;
    }

    private function handleMappingProperty(ItemProperty $itemProperty): MappedProperty
    {
        return $this->propertyHandlerFactory->getHandler($itemProperty->property)->handle($this->item, $itemProperty);
    }
}
