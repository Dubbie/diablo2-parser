// composables/useSkillDamage.js
import { useAttack } from "@/skills/attack";
import { useBash } from "@/skills/bash";
import { useThrow } from "@/skills/throw";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";

const skillModules = {
    Attack: useAttack,
    Throw: useThrow,
    Bash: useBash,
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
