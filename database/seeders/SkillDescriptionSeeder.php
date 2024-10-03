<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillDescription;
use Exception;

class SkillDescriptionSeeder extends FromFileSeeder
{
    private const CLASS_MAP = [
        'ama' => 'AmSkillicon_0_[id].png',
        'ass' => 'AsSkillicon_0_[id].png',
        'bar' => 'BaSkillicon_0_[id].png',
        'nec' => 'NeSkillicon_0_[id].png',
        'pal' => 'PaSkillicon_0_[id].png',
        'sor' => 'SoSkillicon_0_[id].png',
        'dru' => 'DrSkillicon_0_[id].png',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info("Clearing old skill descriptions...");
        SkillDescription::query()->delete();
        $this->command->info("Old skill desciprtions cleared");
        $data = $this->readFile('app/Skilldesc.txt');

        $this->createData($data);
    }

    private function createData(array $data)
    {
        foreach ($data as $descData) {
            if (!$this->getActualValue($descData['str short'])) {
                continue;
            }

            $skill = Skill::where('description_string', $this->getActualValue($descData['skilldesc']))->first();
            if (!$skill) {
                $this->command->error("Skill {$descData['skilldesc']} not found");
                continue;
            }

            $translateData = [
                'name_code' => $this->getActualValue($descData['str name']),
                'short_code' => $this->getActualValue($descData['str short']),
                'long_code' => $this->getActualValue($descData['str long']),
                'alt_code' => $this->getActualValue($descData['str alt']),
                'mana_code' => $this->getActualValue($descData['str mana']),
            ];


            $iconUsable = $this->getIconString($skill, $descData['IconCel'], true);
            $iconUnusable = $this->getIconString($skill, $descData['IconCel'], false);

            $mappedData = [
                'page' => $this->getActualValue($descData['SkillPage']),
                'skill_row' => $this->getActualValue($descData['SkillRow']),
                'skill_column' => $this->getActualValue($descData['SkillColumn']),
                'damage' => $this->getActualValue($descData['descdam']),
                'icon_usable' => $iconUsable,
                'icon_unusable' => $iconUnusable,
            ];

            foreach ($translateData as $key => $code) {
                $translated = null;
                if ($code) {
                    $translated = $this->getTranslatedValue($code);
                    if (!$translated) {
                        throw new Exception("Unknown translation for {$key}: {$code}");
                    }
                }

                $_key = str_replace('_code', '', $key);
                $mappedData[$_key] = $translated;
                $mappedData[$key] = $code;
            }

            $skill->description()->create($mappedData);
            $this->command->info(" - Skill description {$mappedData['name']} created (Page: {$mappedData['page']})");
        }
    }

    private function getIconString(Skill $skill, int $iconId, bool $usable = true): string
    {
        $template = self::CLASS_MAP[$skill->character_class] ?? 'Skillicon_0_[id].png';

        if ($usable) {
            $template = str_replace('[id]', $iconId, $template);
        } else {
            $template = str_replace('[id]', $iconId + 1, $template);
        }

        return $template;
    }
}
