<?php

namespace Database\Seeders;

use App\Models\TblEntry;
use Illuminate\Database\Seeder;

class TblEntrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all entries
        TblEntry::query()->delete();

        // Get entries
        $entries = $this->getEntries();

        // Create entries
        $this->createEntries($entries);
    }

    private function getEntries(): array
    {
        $base = $this->getEntriesFromFile('app/translations.csv');
        $patch = $this->getEntriesFromFile('app/translations_patch.csv');
        $exp = $this->getEntriesFromFile('app/translations_exp.csv');

        return array_merge($base, $exp, $patch);
    }

    private function getEntriesFromFile(string $path): array
    {
        // Read the file line by line
        $properties = file(storage_path($path), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        // Loop through the lines
        $entries = [];
        for ($line = 0; $line < count($properties); $line++) {
            $split = explode(";", $properties[$line]);

            // Check if length is too long
            if (strlen($split[0]) > 255) {
                echo "Too long: " . $split[0] . PHP_EOL;
                continue;
            }

            $data = [];
            $data['key'] = $split[0];
            $data['value'] = $split[1];

            $entries[] = $data;
        }

        return $entries;
    }

    private function createEntries(array $entries): void
    {
        foreach ($entries as $value) {
            try {
                TblEntry::updateOrCreate(['key' => $value['key']], ['value' => $value['value']]);

                echo "Created / Updated: " . $value['key'] . PHP_EOL;
            } catch (\Exception $e) {
                echo $e->getMessage() . PHP_EOL;

                TblEntry::updateOrCreate(['key' => $value['key']], ['value' => 'FIX: ' . $value['key']]);
            }
        }
    }
}
