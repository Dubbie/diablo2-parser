// composables/useSkillDamage.js
import { useAttack } from "@/skills/attack";
import { useBash } from "@/skills/bash";
import { useConcentrate } from "@/skills/concentrate";
import { useStun } from "@/skills/stun";
import { useThrow } from "@/skills/throw";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";

const skillModules = {
    Attack: useAttack,
    Throw: useThrow,
    Bash: useBash,
    Stun: useStun,
    Concentrate: useConcentrate,
};

export function useSkillDamage() {
    const calculateSkillDamage = (skill) => {
        const skillName = skill.description.name;
        const { attributes } = useStatCalculationStore();
        const { character } = useCharacterStore();

        if (!skillModules[skillName]) {
            console.warn(`No module found for skill ${skillName}.`);
            return 0;
        }

        const skillModule = skillModules[skillName]();
        return skillModule.calculate(skill, attributes, character);
    };

    return { calculateSkillDamage };
}
