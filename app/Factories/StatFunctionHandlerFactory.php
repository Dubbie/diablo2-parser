<?php

namespace App\Factories;

use App\Handlers\StatFunctionHandlerInterface;
use App\Handlers\StatFunctionHandlers\DefaultStatFunctionHandler;
use Illuminate\Container\Container;

class StatFunctionHandlerFactory
{
    protected array $handlers = [];
    protected Container $app;
    protected string $defaultHandlerClass;

    public function __construct(Container $app)
    {
        $this->app = $app;

        // Define the mapping between function IDs and handler classes
        $this->handlers = [
            10 => \App\Handlers\StatFunctionHandlers\StatFunction10Handler::class,
            11 => \App\Handlers\StatFunctionHandlers\StatFunction11Handler::class,
            17 => \App\Handlers\StatFunctionHandlers\StatFunction17Handler::class,
            24 => \App\Handlers\StatFunctionHandlers\StatFunction24Handler::class
        ];

        // Define the default handler class
        $this->defaultHandlerClass = DefaultStatFunctionHandler::class;
    }

    /**
     * Get the handler instance for a given function ID.
     *
     * @param int $functionId
     * @return StatFunctionHandlerInterface
     */
    public function getHandler(?int $functionId): StatFunctionHandlerInterface
    {
        if ($functionId === null) {
            return $this->app->make($this->defaultHandlerClass);
        }

        // Check if there is a handler for the function ID
        if (isset($this->handlers[$functionId])) {
            return $this->app->make($this->handlers[$functionId]);
        }

        // Return the default handler if no specific handler is found
        return $this->app->make($this->defaultHandlerClass);
    }
}
