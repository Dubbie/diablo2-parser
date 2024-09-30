<?php

namespace App\Factories;

use App\Handlers\DescriptionFunctionHandlerInterface;
use Illuminate\Container\Container;

class DescriptionFunctionHandlerFactory
{
    protected array $handlers = [];
    protected Container $app;

    public function __construct(Container $app)
    {
        $this->app = $app;

        // Define the mapping between function IDs and handler classes
        $this->handlers = [
            1 => \App\Handlers\DescriptionFunctionHandlers\DescFunc1Handler::class,
            2 => \App\Handlers\DescriptionFunctionHandlers\DescFunc2Handler::class,
            3 => \App\Handlers\DescriptionFunctionHandlers\DescFunc3Handler::class,
            4 => \App\Handlers\DescriptionFunctionHandlers\DescFunc4Handler::class,
            5 => \App\Handlers\DescriptionFunctionHandlers\DescFunc5Handler::class,
            6 => \App\Handlers\DescriptionFunctionHandlers\DescFunc6Handler::class,
            12 => \App\Handlers\DescriptionFunctionHandlers\DescFunc1Handler::class, // Same as 1
            13 => \App\Handlers\DescriptionFunctionHandlers\DescFunc13Handler::class,
            14 => \App\Handlers\DescriptionFunctionHandlers\DescFunc14Handler::class,
            15 => \App\Handlers\DescriptionFunctionHandlers\DescFunc15Handler::class,
            16 => \App\Handlers\DescriptionFunctionHandlers\DescFunc16Handler::class,
            20 => \App\Handlers\DescriptionFunctionHandlers\DescFunc20Handler::class,
            23 => \App\Handlers\DescriptionFunctionHandlers\DescFunc23Handler::class,
            24 => \App\Handlers\DescriptionFunctionHandlers\DescFunc24Handler::class,
            27 => \App\Handlers\DescriptionFunctionHandlers\DescFunc27Handler::class,
            28 => \App\Handlers\DescriptionFunctionHandlers\DescFunc28Handler::class
        ];
    }

    /**
     * Get the handler instance for a given stat description function
     *
     * @param int $functionId
     * @return DescriptionFunctionHandlerInterface
     */
    public function getHandler(?int $functionId): DescriptionFunctionHandlerInterface
    {
        // Check if there is a handler for the function ID
        if (isset($this->handlers[$functionId])) {
            return $this->app->make($this->handlers[$functionId]);
        }

        // Throw an error if no specific handler is found
        throw new \InvalidArgumentException("No handler found for description function: $functionId");
    }
}
