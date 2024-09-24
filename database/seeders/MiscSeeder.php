<?php

namespace Database\Seeders;

use App\Models\Item;

class MiscSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $miscIds = Item::where('item_type', 'misc')->pluck('id')->toArray();

        foreach ($miscIds as $miscId) {
            $misc = Item::find($miscId);
            $misc->delete();
        }

        $data = $this->readFile('app/Misc.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $itemData) {
            $interested = [
                'Charm Small' => [
                    'img' => 'invch4',
                ],
                'Charm Large' => [
                    'img' => 'invch3',
                ],
                'Charm Medium' => [
                    'img' => 'invch8',
                ],
                'Jewel' => [
                    'img' => 'invjw1',
                ],
                'amulet' => [
                    'img' => 'invamu2',
                ],
                'ring' => [
                    'img' => 'invrin5',
                ]
            ];

            // Skip empty line
            if (!in_array($itemData['name'], array_keys($interested))) {
                continue;
            }

            $img = $interested[$itemData['name']]['img'];
            $name = $this->getTranslatedValue($itemData['namestr']);
            $baseStats = [];

            $miscData = [
                'name' => null,
                'base_name' => $name ? $name : $this->getActualValue($itemData['name']),
                'type' => $this->getActualValue($itemData['type']),
                'type2' => $this->getActualValue($itemData['type2']),
                'code' => $this->getActualValue($itemData['code']),
                'image' => $img,
                'rarity' => $this->getActualValue($itemData['rarity']),
                'spawnable' => $this->getActualValue($itemData['spawnable']) === true,
                'no_durability' => $this->getActualValue($itemData['nodurability'], true),
                'level' => $this->getActualValue($itemData['level']),
                'width' => $this->getActualValue($itemData['invwidth']),
                'height' => $this->getActualValue($itemData['invheight']),
                'has_inventory' => $this->getActualValue($itemData['hasinv'], true),
                'sockets' => $this->getActualValue($itemData['gemsockets']),
                'gem_apply_type' => $this->getActualValue($itemData['gemapplytype']),
                'unique' => $this->getActualValue($itemData['unique'], true),
                'skip_base_name' => $this->getActualValue($itemData['SkipName'], true),
                'item_type' => 'misc',
            ];

            // Check for base stats
            foreach ($itemData as $key => $value) {
                if (isset(Item::BASE_STAT_MAP[$key])) {
                    $baseStats[Item::BASE_STAT_MAP[$key]] = $this->getActualValue($value);
                }
            }


            $miscData['base_stats'] = $baseStats;

            Item::create($miscData);

            $this->command->info("Misc item {$name} created");
        }
    }
}
