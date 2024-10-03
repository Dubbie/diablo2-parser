<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillDescription;
use Exception;
use Illuminate\Support\Facades\DB;

class SkillDescriptionSeeder extends FromFileSeeder
{
    private const DESC_LINE_TYPE_MAP = [
        'desc' => 1,
        'dsc2' => 2,
        'dsc3' => 3,
    ];

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

            DB::beginTransaction();

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

            $lines = [];

            // Max 6 Desc lines
            for ($i = 1; $i <= 6; $i++) {
                $line = $this->getDescLine($descData, 'desc', $i);
                if ($line) {
                    $lines[] = $line;
                }
            }

            // Max 4 dsc2 lines
            for ($i = 1; $i <= 4; $i++) {
                $line = $this->getDescLine($descData, 'dsc2', $i);
                if ($line) {
                    $lines[] = $line;
                }
            }

            // Max 7 dsc3 lines
            for ($i = 1; $i <= 7; $i++) {
                $line = $this->getDescLine($descData, 'dsc3', $i);
                if ($line) {
                    $lines[] = $line;
                }
            }

            $desc = $skill->description()->create($mappedData);
            $desc->lines()->createMany($lines);
            $this->command->info(" - Skill description {$mappedData['name']} created (Page: {$mappedData['page']})");

            DB::commit();
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

    private function getDescLine(array $entry, string $type, int $priority): ?array
    {
        if (!$entry["{$type}line{$priority}"]) {
            return null;
        }

        $descRaw = [
            'function' => $this->getActualValue($entry["{$type}line{$priority}"]),
            'text_a_code' => $this->getActualValue($entry["{$type}texta{$priority}"]),
            'text_b_code' => $this->getActualValue($entry["{$type}textb{$priority}"]),
            'calc_a' => $this->getActualValue($entry["{$type}calca{$priority}"]),
            'calc_b' => $this->getActualValue($entry["{$type}calcb{$priority}"]),
            'type' => self::DESC_LINE_TYPE_MAP[$type],
            'priority' => $priority
        ];

        $descRaw['text_a'] = $this->getTranslatedValue($descRaw['text_a_code'], false);
        $descRaw['text_b'] = $this->getTranslatedValue($descRaw['text_b_code'], false);

        return $descRaw;
    }
}
