<?php

namespace Database\Seeders;

use App\Models\Item;
use Exception;
use Illuminate\Support\Facades\Log;

class UniqueSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Cleaning up unique items...');
        $uniqueIds = Item::where('item_type', 'unique')->pluck('id')->toArray();

        foreach ($uniqueIds as $uniqueId) {
            $unique = Item::find($uniqueId);
            $unique->delete();
        }

        $data = $this->readFile('app/UniqueItems.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $itemData) {
            // Skip unneeded lines
            if ($itemData['enabled'] === '0' || $itemData['code'] === '') {
                $maps = [
                    't51',
                    't52',
                    't53'
                ];

                continue;
            }

            // First find the base
            $base = Item::where('code', $this->getActualValue($itemData['code']))->first();
            if (!$base) {
                Log::warning("Base was not found by ID, might require attention");
                Log::warning($itemData);
                $base = Item::where('base_name', $this->getActualValue($itemData['*type']))->first();
            }

            // If still not found we are cooked
            if (!$base) {
                if (in_array($itemData['code'], $maps)) {
                    continue;
                }

                throw new Exception('Base not found! ' . $itemData['code']);
            }

            $img = $this->getActualValue($itemData['invfile']);
            if (!$img) {
                $img = $base->image;
            }
            $name = $this->getTranslatedValue($itemData['index']);

            $uniqueData = $this->getItemDataFromBase($base);

            // Add base stats
            $baseStats = $base->base_stats;

            $uniqueData['base_stats'] = $baseStats;
            $uniqueData['base_stats']['required_level'] = $this->getActualValue($itemData['lvl req']);

            // Add extra stats
            $extraData = [
                'level' => $this->getActualValue($itemData['lvl']) ?? 0,
                'rarity' => $this->getActualValue($itemData['rarity']),
                'code' => $this->getActualValue($itemData['code']),
                'image' => $img,
                'name' => $name,
                'unique' => true,
            ];

            // Merge extra data into unique data
            $uniqueData = array_merge($uniqueData, $extraData);

            $item = Item::create($uniqueData);

            // Create the properties
            for ($i = 1; $i <= 12; $i++) {
                $itemPropData = [
                    'property' => str_replace('*', '', $this->getActualValue($itemData["prop{$i}"])),
                    'min' => $this->getActualValue($itemData["min{$i}"]),
                    'max' => $this->getActualValue($itemData["max{$i}"]),
                    'parameter' => $this->getActualValue($itemData["par{$i}"]),
                    'property_number' => $i,
                ];

                if ($itemPropData['property']) {
                    $item->itemProperties()->create($itemPropData);
                }
            }

            $this->command->info("Unique {$name} created with {$item->itemProperties()->count()} properties");
        }
    }

    private function getItemDataFromBase(Item $base): array
    {
        return [
            'base_name' => $base->base_name,
            'type' => $base->type,
            'type2' => $base->type2,
            'spawnable' => $base->spawnable,
            'one_or_two_handed' => $base->one_or_two_handed,
            'two_handed' => $base->two_handed,
            'str_bonus' => $base->str_bonus,
            'dex_bonus' => $base->dex_bonus,
            'durability' => $base->durability,
            'no_durability' => $base->no_durability,
            'magic_level' => $base->magic_level,
            'width' => $base->width,
            'height' => $base->height,
            'has_inventory' => $base->has_inventory,
            'sockets' => $base->sockets,
            'gem_apply_type' => $base->gem_apply_type,
            'skip_base_name' => $base->skip_base_name,
            'item_type' => 'unique',
        ];
    }
}
