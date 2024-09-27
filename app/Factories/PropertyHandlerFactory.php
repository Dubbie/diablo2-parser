<?php

namespace App\Factories;

use App\Handlers\PropertyHandlerInterface;
use Illuminate\Container\Container;

class PropertyHandlerFactory
{
    protected array $handlers = [];
    protected Container $app;
    protected string $defaultHandlerClass;

    public function __construct(Container $app)
    {
        $this->app = $app;

        // Define the mapping between function IDs and handler classes
        $this->handlers = [
            'dmg%' => \App\Handlers\PropertyHandlers\DmgPercentPropertyHandler::class,
            'dmg-min' => \App\Handlers\PropertyHandlers\DmgMinPropertyHandler::class,
            'dmg-max' => \App\Handlers\PropertyHandlers\DmgMaxPropertyHandler::class,
            'dmg-norm' => \App\Handlers\PropertyHandlers\DmgNormPropertyHandler::class,
        ];

        // Define the default handler class
        $this->defaultHandlerClass = \App\Handlers\PropertyHandlers\DefaultPropertyHandler::class;
    }

    /**
     * Get the handler instance for a given item property.
     *
     * @param string $name
     * @return PropertyHandlerInterface
     */
    public function getHandler(string $name): PropertyHandlerInterface
    {
        // Check if there is a handler for the function ID
        if (isset($this->handlers[$name])) {
            return $this->app->make($this->handlers[$name]);
        }

        // Return the default handler if no specific handler is found
        return $this->app->make($this->defaultHandlerClass);
    }
}
