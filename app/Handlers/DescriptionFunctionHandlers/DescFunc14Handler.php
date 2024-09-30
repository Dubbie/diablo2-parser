<?php

namespace App\Handlers\DescriptionFunctionHandlers;

use App\Handlers\DescriptionFunctionHandlerInterface;
use App\Services\StatFormatter;
use App\ValueObjects\Modifier;
use App\ValueObjects\ModifierLabel;
use Exception;

class DescFunc14Handler implements DescriptionFunctionHandlerInterface
{
    // +[value] to [skilltab] Skill Levels ([class] Only)
    public function handle(Modifier $modifier): ModifierLabel
    {
        $param = $modifier->getValues()['param'] ?? null;
        if ($param === null) {
            throw new Exception("Random class skill levels not supported yet.");
        }

        $skillTab = StatFormatter::SKILLTAB_MAP[$param] ?? null;
        if ($skillTab === null) {
            throw new Exception("Skill tab not found with param: " . $param);
        }

        $value = $modifier->getValues()['value'] ?? null;
        $min = $max = $value ?? $modifier->getMin();
        $max = $value ?? $modifier->getMax();

        // Get the formatted value
        $formattedValue = StatFormatter::formatValue($min, $max);

        // Start piecing it together
        $template = '+[value] to [skilltab] ([class] Only)';
        if (is_numeric($formattedValue)) {
            $template = str_replace('[value]', $formattedValue, $template);
        }

        $template = str_replace('[class]', $skillTab['class'], $template);
        $template = str_replace('[skilltab]', $skillTab['skilltab'], $template);
        $statString = str_replace('[value]', $formattedValue, $template);

        return new ModifierLabel($statString, $template);
    }
}
