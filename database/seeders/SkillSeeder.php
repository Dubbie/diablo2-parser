<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillPrerequisite;
use Exception;

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
        $prerequisites = [];

        foreach ($data as $skillData) {
            $originalName = $this->getActualValue($skillData['skill']);
            $skillRaw = [
                'id' => $skillData['Id'],
                'name' => $this->getTranslatedValue($originalName, false),
                'character_class' => $this->getActualValue($skillData['charclass']),
                'required_level' => $this->getActualValue($skillData['reqlevel']),
                'max_level' => $this->getActualValue($skillData['maxlvl']),
                'original_name' => $originalName,
                'description_string' => $this->getActualValue($skillData['skilldesc']),
                'min_mana' => $this->getActualValue($skillData['minmana']),
                'mana_shift' => $this->getActualValue($skillData['manashift']),
                'mana' => $this->getActualValue($skillData['mana']),
                'mana_per_level' => $this->getActualValue($skillData['lvlmana']),
                'calc_1' => $this->getActualValue($skillData['calc1']),
                'calc_2' => $this->getActualValue($skillData['calc2']),
                'calc_3' => $this->getActualValue($skillData['calc3']),
                'calc_4' => $this->getActualValue($skillData['calc4']),
                'client_calc_1' => $this->getActualValue($skillData['cltcalc1']),
                'client_calc_2' => $this->getActualValue($skillData['cltcalc2']),
                'client_calc_3' => $this->getActualValue($skillData['cltcalc3']),
                'passive_state' => $this->getActualValue($skillData['passivestate']),
                'passive_item_type' => $this->getActualValue($skillData['passiveitype']),
                'passive_stat_1' => $this->getActualValue($skillData['passivestat1']),
                'passive_calc_1' => $this->getActualValue($skillData['passivecalc1']),
                'passive_stat_2' => $this->getActualValue($skillData['passivestat2']),
                'passive_calc_2' => $this->getActualValue($skillData['passivecalc2']),
                'passive_stat_3' => $this->getActualValue($skillData['passivestat3']),
                'passive_calc_3' => $this->getActualValue($skillData['passivecalc3']),
                'passive_stat_4' => $this->getActualValue($skillData['passivestat4']),
                'passive_calc_4' => $this->getActualValue($skillData['passivecalc4']),
                'passive_stat_5' => $this->getActualValue($skillData['passivestat5']),
                'passive_calc_5' => $this->getActualValue($skillData['passivecalc5']),
                'param_1' => $this->getActualValue($skillData['Param1']),
                'param_2' => $this->getActualValue($skillData['Param2']),
                'param_3' => $this->getActualValue($skillData['Param3']),
                'param_4' => $this->getActualValue($skillData['Param4']),
                'param_5' => $this->getActualValue($skillData['Param5']),
                'param_6' => $this->getActualValue($skillData['Param6']),
                'param_7' => $this->getActualValue($skillData['Param7']),
                'param_8' => $this->getActualValue($skillData['Param8']),
                'to_hit' => $this->getActualValue($skillData['ToHit']),
                'to_hit_per_level' => $this->getActualValue($skillData['LevToHit']),
                'to_hit_calc' => $this->getActualValue($skillData['ToHitCalc']),
                'hit_shift' => $this->getActualValue($skillData['HitShift']),
                'src_dmg' => $this->getActualValue($skillData['SrcDam']),
                'e_type' => $this->getActualValue($skillData['EType']),
                'e_min' => $this->getActualValue($skillData['EMin']),
                'e_min_level_1' => $this->getActualValue($skillData['EMinLev1']),
                'e_min_level_2' => $this->getActualValue($skillData['EMinLev2']),
                'e_min_level_3' => $this->getActualValue($skillData['EMinLev3']),
                'e_min_level_4' => $this->getActualValue($skillData['EMinLev4']),
                'e_min_level_5' => $this->getActualValue($skillData['EMinLev5']),
                'e_max' => $this->getActualValue($skillData['EMax']),
                'e_max_level_1' => $this->getActualValue($skillData['EMaxLev1']),
                'e_max_level_2' => $this->getActualValue($skillData['EMaxLev2']),
                'e_max_level_3' => $this->getActualValue($skillData['EMaxLev3']),
                'e_max_level_4' => $this->getActualValue($skillData['EMaxLev4']),
                'e_max_level_5' => $this->getActualValue($skillData['EMaxLev5']),
                'e_dmg_sym_per_calc' => $this->getActualValue($skillData['EDmgSymPerCalc']),
                'e_len' => $this->getActualValue($skillData['ELen']),
                'e_len_level_1' => $this->getActualValue($skillData['ELevLen1']),
                'e_len_level_2' => $this->getActualValue($skillData['ELevLen2']),
                'e_len_level_3' => $this->getActualValue($skillData['ELevLen3']),
                'e_len_sym_per_calc' => $this->getActualValue($skillData['ELenSymPerCalc']),
            ];

            $skill = Skill::create($skillRaw);

            // check for prerequisites
            for ($i = 1; $i <= 3; $i++) {
                if ($this->getActualValue($skillData["reqskill{$i}"])) {
                    $prerequisites[] = [
                        'skill_id' => $skill->id,
                        'skill_name' => $skill->name, // Debug only
                        'prerequisite' => $this->getActualValue($skillData["reqskill{$i}"]), // This will be the originalname in the Skill model.
                    ];
                }
            }

            $this->command->info(" - Skill {$skillRaw['name']} created");
        }

        // Add prerequisites
        foreach ($prerequisites as $combo) {
            $prereq = Skill::where('original_name', $combo['prerequisite'])->first();

            if (!$prereq) {
                $prereq = Skill::where('description_string', $combo['prerequisite'])->first();

                if (!$prereq) {
                    throw new Exception("Prerequisite skill not found: {$combo['prerequisite']}");
                }
            }

            SkillPrerequisite::create([
                'skill_id' => $combo['skill_id'],
                'prerequisite_id' => $prereq->id
            ]);

            $this->command->info(" - Skill {$prereq->name} added as prerequisite to {$combo['skill_name']}");
        }
    }
}
