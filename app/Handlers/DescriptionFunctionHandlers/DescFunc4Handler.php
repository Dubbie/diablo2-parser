<?php

namespace App\Handlers\DescriptionFunctionHandlers;

class DescFunc4Handler extends BaseDescriptionFunctionHandler
{
    // +[value]% [string1]
    protected function getTemplate(): string
    {
        return "+[value]% [string1]";
    }
}
