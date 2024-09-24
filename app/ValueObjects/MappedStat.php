<?php

namespace App\ValueObjects;

use App\Models\Stat;
use JsonSerializable;

class MappedStat implements JsonSerializable
{
    private Stat $stat;
    private mixed $value = null;
    private ?bool $set = null;
    private ?int $function = null;

    /**
     * Get the value of stat
     */
    public function getStat(): mixed
    {
        return $this->stat;
    }

    /**
     * Set the value of stat
     */
    public function setStat($stat): self
    {
        $this->stat = $stat;

        return $this;
    }

    /**
     * Get the value of value
     */
    public function getValue(): mixed
    {
        return $this->value;
    }

    /**
     * Set the value of value
     */
    public function setValue($value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get the value of set
     */
    public function isSet(): ?bool
    {
        return $this->set;
    }

    /**
     * Set the value of set
     */
    public function setSet(?bool $set): self
    {
        $this->set = $set;

        return $this;
    }

    /**
     * Get the value of function
     */
    public function getFunction(): ?int
    {
        return $this->function;
    }

    /**
     * Set the value of function
     */
    public function setFunction(int $function): self
    {
        $this->function = $function;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'stat' => $this->stat,
            'value' => $this->value,
            'set' => $this->set,
            'function' => $this->function
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
