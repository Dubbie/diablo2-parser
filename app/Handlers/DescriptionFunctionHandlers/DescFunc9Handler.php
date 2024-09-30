<?php

namespace App\Handlers\DescriptionFunctionHandlers;

class DescFunc9Handler extends BaseDescriptionFunctionHandler
{
    protected function getTemplate(): string
    {
        return '[value] [string1] [string2]';
    }
}
