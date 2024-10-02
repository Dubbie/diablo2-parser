<?php

namespace Database\Seeders;

use App\Models\CharacterStat;
use App\Models\Item;

class CharacterSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CharacterStat::query()->delete();

        $data = $this->readFile('app/CharStats.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $line) {
            if ($line['class'] === 'Expansion') {
                continue; // Skip expansion
            }

            $char = [
                'name' => $this->getActualValue($line['class']),
                'base_attributes' => [
                    'str' => $this->getActualValue($line['str']),
                    'dex' => $this->getActualValue($line['dex']),
                    'int' => $this->getActualValue($line['int']),
                    'vit' => $this->getActualValue($line['vit']),
                ],
                'hp_extra' => $this->getActualValue($line['hpadd']),
                'life_per_level' => $this->getActualValue($line['LifePerLevel']),
                'mana_per_level' => $this->getActualValue($line['ManaPerLevel']),
                'mana_regen' => $this->getActualValue($line['ManaRegen']),
                'life_per_vitality' => $this->getActualValue($line['LifePerVitality']),
                'stat_per_level' => $this->getActualValue($line['StatPerLevel']),
                'base_block' => $this->getActualValue($line['BlockFactor']),
                'to_hit_factor' => $this->getActualValue($line['ToHitFactor']),
            ];

            CharacterStat::create($char);
            $this->command->info(" - Character {$char['name']} created");
        }
    }
}
