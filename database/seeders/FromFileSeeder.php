<?php

namespace Database\Seeders;

use App\Models\TblEntry;
use Exception;
use Illuminate\Database\Seeder;

abstract class FromFileSeeder extends Seeder
{
    protected function readFile(string $path): array
    {
        // Read the file line by line
        $properties = file(storage_path($path), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        // Get headers
        $headers = explode("\t", $properties[0]);

        // Loop through the lines
        $data = [];
        for ($line = 1; $line < count($properties); $line++) {
            $split = explode("\t", $properties[$line]);

            $property = [];
            foreach ($split as $index => $value) {
                $header = $headers[$index];
                $property[$header] = $value;
            }

            $data[] = $property;
        }

        return $data;
    }

    protected function getActualValue(mixed $value, bool $forceBool = false)
    {
        if ($forceBool) {
            return (bool) $value;
        }

        if ($value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return $value;
    }

    protected function getTranslatedValue(string $value, bool $strict = true): ?string
    {
        if ($value === '') {
            return null;
        }

        $tblEntry = TblEntry::find($value);
        if ($tblEntry) {
            return $tblEntry->value;
        }

        if ($strict) {
            throw new Exception('Unknown key for translation: ' . $value);
        } else {
            return $value;
        }
    }
}
