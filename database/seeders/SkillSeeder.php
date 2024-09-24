<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Skill;

class SkillSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info("Clearing old skills...");
        $skillIds = Skill::pluck('id')->toArray();
        foreach ($skillIds as $skillId) {
            $skill = Skill::find($skillId);
            $skill->delete();
        }
        $this->command->info("Old skills cleared");
        $data = $this->readFile('app/Skills.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $skillData) {
            $originalName = $this->getActualValue($skillData['skill']);
            $skillRaw = [
                'id' => $skillData['Id'],
                'name' => $this->getTranslatedValue($originalName, false),
                'character_class' => $this->getActualValue($skillData['charclass']),
                'required_level' => $this->getActualValue($skillData['reqlevel']),
                'max_level' => $this->getActualValue($skillData['maxlvl']),
                'original_name' => $originalName,
            ];

            Skill::create($skillRaw);
            $this->command->info(" - Skill {$skillRaw['name']} created");
        }
    }
}
