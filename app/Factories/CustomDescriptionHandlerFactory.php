<?php

namespace App\Factories;

use App\Handlers\CustomDescriptionHandlerInterface;
use Illuminate\Container\Container;

class CustomDescriptionHandlerFactory
{
    protected array $handlers = [];
    protected Container $app;

    public function __construct(Container $app)
    {
        $this->app = $app;

        // Define the mapping between function IDs and handler classes
        $this->handlers = [
            'all_resist' => \App\Handlers\CustomDescriptionHandlers\AllResistDescriptionHandler::class,
            'maxdamage_percent' => \App\Handlers\CustomDescriptionHandlers\DmgPercentDescriptionHandler::class,
            'dmg_normal' => \App\Handlers\CustomDescriptionHandlers\DmgNormalDescriptionHandler::class,
            'dmg_lightning' => \App\Handlers\CustomDescriptionHandlers\DmgLightningDescriptionHandler::class,
            'dmg_fire' => \App\Handlers\CustomDescriptionHandlers\DmgFireDescriptionHandler::class,
            'dmg_poison' => \App\Handlers\CustomDescriptionHandlers\DmgPoisonDescriptionHandler::class,
            'dmg_cold' => \App\Handlers\CustomDescriptionHandlers\DmgColdDescriptionHandler::class
        ];
    }

    /**
     * Get the handler instance for a given stat description function
     *
     * @param string $modifierName
     * @return CustomDescriptionHandlerInterface
     */
    public function getHandler(string $modifierName): CustomDescriptionHandlerInterface
    {
        // Check if there is a handler for the function ID
        if (isset($this->handlers[$modifierName])) {
            return $this->app->make($this->handlers[$modifierName]);
        }

        // Throw an error if no specific handler is found
        throw new \InvalidArgumentException("No handler found for custom description: $modifierName");
    }
}
