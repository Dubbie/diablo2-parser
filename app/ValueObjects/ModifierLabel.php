<?php

namespace App\ValueObjects;

class ModifierLabel
{
    public string $label;
    public string $template;

    public function __construct(string $label, string $template)
    {
        $this->label = $label;
        $this->template = $template;
    }
}
