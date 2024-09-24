<?php

namespace Database\Seeders;

use App\Models\Item;

class ArmorSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $armorIds = Item::where('item_type', 'armor')->pluck('id')->toArray();

        foreach ($armorIds as $armorId) {
            $armor = Item::find($armorId);
            $armor->delete();
        }

        $data = $this->readFile('app/Armor.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $itemData) {
            // Skip empty line
            if ($itemData['code'] === '' || $itemData['type'] === 'tpot') {
                continue;
            }

            $img = $this->getActualValue($itemData['invfile']);
            $name = $this->getTranslatedValue($itemData['namestr']);
            $baseStats = [];

            $armorData = [
                'name' => null,
                'base_name' => $name ? $name : $this->getActualValue($itemData['name']),
                'type' => $this->getActualValue($itemData['type']),
                'type2' => $this->getActualValue($itemData['type2']),
                'code' => $this->getActualValue($itemData['code']),
                'image' => $img,
                'rarity' => $this->getActualValue($itemData['rarity']),
                'spawnable' => $this->getActualValue($itemData['spawnable']) === true,
                'str_bonus' => $this->getActualValue($itemData['StrBonus']),
                'durability' => $this->getActualValue($itemData['durability']),
                'no_durability' => $this->getActualValue($itemData['nodurability'], true),
                'level' => $this->getActualValue($itemData['level']),
                'magic_level' => $this->getActualValue($itemData['magic lvl']),
                'code_normal' => $this->getActualValue($itemData['normcode']),
                'code_exceptional' => $this->getActualValue($itemData['ubercode']),
                'code_elite' => $this->getActualValue($itemData['ultracode']),
                'width' => $this->getActualValue($itemData['invwidth']),
                'height' => $this->getActualValue($itemData['invheight']),
                'has_inventory' => $this->getActualValue($itemData['hasinv'], true),
                'sockets' => $this->getActualValue($itemData['gemsockets']),
                'gem_apply_type' => $this->getActualValue($itemData['gemapplytype']),
                'unique' => $this->getActualValue($itemData['unique'], true),
                'skip_base_name' => $this->getActualValue($itemData['SkipName'], true),
                'item_type' => 'armor',
            ];

            // Check for base stats
            foreach ($itemData as $key => $value) {
                if (isset(Item::BASE_STAT_MAP[$key])) {
                    $baseStats[Item::BASE_STAT_MAP[$key]] = $this->getActualValue($value);
                }
            }

            $armorData['base_stats'] = $baseStats;

            Item::create($armorData);

            $this->command->info("Armor {$name} created");
        }
    }
}
