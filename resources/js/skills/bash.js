import { useCharacterStore } from "@/Stores/CharacterStore";
import { useSkillStore } from "@/Stores/SkillStore";
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { calculateWeaponDamage, log } from "@/utils/skillUtils";

// skills/bash.js
export function useBash() {
    const calculate = (skill, attributes, character) => {
        // TODO
        const skillStore = useSkillStore();
        const context = skillStore.getSkillContext(skill.name);

        const clc1 = context.clc1(); // Damage% added to each hit
        const clc2 = context.clc2(); // Drain damage added to each hit
        // const clc3 = context.clc3(); // Server side Attack Rate bonus
        // const clc4 = context.clc4(); // Damage converted to elem
        const { equippedItems } = character;
        log("clc1=%s", clc1);
        log("clc2=%s", clc2);
        // log("clc3=%s", clc3);
        // log("clc4=%s", clc4);

        const weapon = equippedItems?.larm;
        const weaponDamage = calculateWeaponDamage(
            attributes,
            weapon,
            equippedItems,
            false
        );
        const { min, max } = weaponDamage;
        let totalMin = min;
        let totalMax = max;
        totalMin = Math.floor(totalMin * (clc1 / 100 + 1) + clc2);
        totalMax = Math.floor(totalMax * (clc1 / 100 + 1) + clc2);

        let result = {
            bashDamage: {
                min: totalMin,
                max: totalMax,
            },
        };

        return result;
    };

    return { calculate };
}
