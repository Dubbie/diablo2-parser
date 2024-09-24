<?php

namespace Database\Seeders;

use App\Models\Monster;
use Illuminate\Support\Facades\Log;

class MonsterSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info("Clearing old monsters...");
        $monsterIds = Monster::pluck('id')->toArray();
        foreach ($monsterIds as $monsterId) {
            $monster = Monster::find($monsterId);
            $monster->delete();
        }
        $this->command->info("Old monsters cleared");
        $data = $this->readFile('app/MonStats.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $mobData) {
            $originalName = $this->getActualValue($mobData['Id']);
            $code = $this->getActualValue($mobData['NameStr']);

            if (!$code) {
                Log::warning("Monster skipped: " . $originalName);
                continue;
            }
            $translatedName = $this->getTranslatedValue($code, false);
            $mobRaw = [
                'id' => $mobData['hcIdx'],
                'name' => $translatedName,
                'original_name' => $originalName,
                'name_code' => $code,
            ];

            Monster::create($mobRaw);
            $this->command->info(" - Monster {$translatedName} created");
        }
    }
}
