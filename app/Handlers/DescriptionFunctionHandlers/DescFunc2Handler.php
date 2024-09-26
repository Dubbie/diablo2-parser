<?php

namespace App\Handlers\DescriptionFunctionHandlers;

class DescFunc2Handler extends BaseDescriptionFunctionHandler
{
    // [value]% [string1]
    protected function getTemplate(): string
    {
        return "[value]% [string1]";
    }
}
