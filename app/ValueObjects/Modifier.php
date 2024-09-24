<?php

namespace App\ValueObjects;

use JsonSerializable;

class Modifier implements JsonSerializable
{
    private string $name;
    private array $values = [];
    private string $label;
    private bool $corrupted = false;
    private int $priority;
    private ?int $min = null;
    private ?int $max = null;

    /**
     * Get the value of name
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Set the value of name
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get the value of values
     */
    public function getValues(): array
    {
        return $this->values;
    }

    /**
     * Set the value of values
     */
    public function setValues(array $values): self
    {
        $this->values = $values;

        return $this;
    }

    /**
     * Get the value of label
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * Set the value of label
     */
    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Get the value of priority
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Set the value of priority
     */
    public function setPriority(int $priority): self
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * Get the value of min
     */
    public function getMin(): ?int
    {
        return $this->min;
    }

    /**
     * Set the value of min
     */
    public function setMin(?int $min): self
    {
        $this->min = $min;

        return $this;
    }

    /**
     * Get the value of max
     */
    public function getMax(): ?int
    {
        return $this->max;
    }

    /**
     * Set the value of max
     */
    public function setMax(?int $max): self
    {
        $this->max = $max;

        return $this;
    }

    /**
     * Get the value of corrupted
     */
    public function isCorrupted(): bool
    {
        return $this->corrupted;
    }

    /**
     * Set the value of corrupted
     */
    public function setCorrupted(bool $corrupted): self
    {
        $this->corrupted = $corrupted;

        return $this;
    }

    public function __toString(): string
    {
        return $this->name;
    }

    public function toArray(): array
    {
        $result = [
            'name' => $this->name,
            'values' => $this->values,
            'label' => $this->label,
            'corrupted' => $this->corrupted,
            'priority' => $this->priority,
        ];

        if (isset($this->min) && isset($this->max)) {
            $result['min'] = $this->min;
            $result['max'] = $this->max;
        }

        return $result;
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
