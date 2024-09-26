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
    private array $range = [];
    private string $template = "";

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

            $result = $handler->handle($this);

            // Update the template based on result
            $this->template = $result->template;

            return $result->label;
        } catch (InvalidArgumentException $e) {
            $descFunc = $this->stat->description->function ?? 'N/A';
            return $this->name . ' (Desc_func: ' . $descFunc . ')';
        } catch (Exception $e) {
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());
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
     * Get the value of range
     */
    public function getRange(?string $key = null): array
    {
        if ($key === null) {
            return $this->range;
        }

        if (!isset($this->range[$key])) {
            throw new InvalidArgumentException('Invalid key for range: ' . $key);
        }

        return $this->range[$key];
    }

    /**
     * Set the value of range
     */
    public function setRange(array $range): self
    {
        $this->range = $range;

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

    public function getMin(?string $key = 'value')
    {
        return $this->getRange()[$key]['min'] ?? null;
    }

    public function getMax(?string $key = 'value')
    {
        return $this->getRange()[$key]['max'] ?? null;
    }

    public function __toString(): string
    {
        return $this->name;
    }

    public function toArray(): array
    {
        $label = $this->getLabel();

        $result = [
            'name' => $this->name,
            'stat' => $this->stat ? $this->stat->toArray() : null,
            'values' => $this->values,
            'label' => $label,
            'corrupted' => $this->corrupted,
            'priority' => $this->priority,
            'template' => $this->template,
            'range' => $this->range,
            'desc_func' => $this->stat ? $this->stat->description->function : null
        ];

        return $result;
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
