<?php

namespace App\ValueObjects;

use App\Models\Property;
use JsonSerializable;

class MappedProperty implements JsonSerializable
{
    private Property $property;
    private mixed $min = null;
    private mixed $max = null;
    private mixed $param = null;
    private array $stats;

    /**
     * Get the value of property
     */
    public function getProperty(): Property
    {
        return $this->property;
    }

    /**
     * Set the value of property
     */
    public function setProperty(Property $property): self
    {
        $this->property = $property;

        return $this;
    }

    /**
     * Get the value of min
     */
    public function getMin(): mixed
    {
        return $this->min;
    }

    /**
     * Set the value of min
     */
    public function setMin($min): self
    {
        $this->min = $min;

        return $this;
    }

    /**
     * Get the value of max
     */
    public function getMax(): mixed
    {
        return $this->max;
    }

    /**
     * Set the value of max
     */
    public function setMax($max): self
    {
        $this->max = $max;

        return $this;
    }

    /**
     * Get the value of param
     */
    public function getParam(): mixed
    {
        return $this->param;
    }

    /**
     * Set the value of param
     */
    public function setParam($param): self
    {
        $this->param = $param;

        return $this;
    }

    /**
     * Get the value of stats
     */
    public function getStats(): array
    {
        return $this->stats;
    }

    /**
     * Set the value of stats
     */
    public function setStats(array $stats): self
    {
        $this->stats = $stats;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'property' => $this->property->name,
            'min' => $this->min,
            'max' => $this->max,
            'param' => $this->param,
            'stats' => $this->stats
        ];
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}
