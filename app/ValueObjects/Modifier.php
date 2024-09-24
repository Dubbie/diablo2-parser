<?php

namespace App\ValueObjects;

use App\Factories\CustomDescriptionHandlerFactory;
use App\Factories\DescriptionFunctionHandlerFactory;
use App\Models\Stat;
use Exception;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use JsonSerializable;

class Modifier implements JsonSerializable
{
    private string $name;
    private array $values = [];
    private ?Stat $stat = null;
    private bool $corrupted = false;
    private int $priority;
    private ?int $min = null;
    private ?int $max = null;

    private DescriptionFunctionHandlerFactory $descriptionFunctionHandlerFactory;
    private CustomDescriptionHandlerFactory $customDescriptionHandlerFactory;

    public function __construct()
    {
        $this->descriptionFunctionHandlerFactory = app(DescriptionFunctionHandlerFactory::class);
        $this->customDescriptionHandlerFactory = app(CustomDescriptionHandlerFactory::class);
    }

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
     * Get the value of stat
     */
    public function getStat(): ?Stat
    {
        return $this->stat;
    }

    /**
     * Set the value of stat
     */
    public function setStat(?Stat $stat): self
    {
        $this->stat = $stat;

        return $this;
    }

    /**
     * Get the value of label
     */
    public function getLabel(): string
    {
        // Label generation for modifiers
        try {
            $handler = null;

            if ($this->stat === null) {
                $handler = $this->customDescriptionHandlerFactory->getHandler($this->name);
            } else {
                $handler = $this->descriptionFunctionHandlerFactory->getHandler($this->stat->description->function);
            }

            return $handler->handle($this);
        } catch (InvalidArgumentException $e) {
            $descFunc = $this->stat->description->function ?? 'N/A';
            return $this->name . ' (Desc_func: ' . $descFunc . ')';
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return $this->name;
        }
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
            'stat' => $this->stat ? $this->stat->toArray() : null,
            'values' => $this->values,
            'label' => $this->getLabel(),
            'corrupted' => $this->corrupted,
            'priority' => $this->priority,
            'desc_func' => $this->stat->description->function ?? null,
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
