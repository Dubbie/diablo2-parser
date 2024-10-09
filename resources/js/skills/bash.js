// skills/bash.js
import { useSkillStore } from "@/Stores/SkillStore";
import { calculateWeaponDamage, log } from "@/utils/skillUtils";

export function useBash() {
    const calculate = (skill, attributes, character) => {
        const { equippedItems } = character;
        const skillStore = useSkillStore();
        const context = skillStore.getSkillContext(skill.name);
        const clc1 = context.clc1(); // Damage% added to each hit
        const clc2 = context.clc2(); // Drain damage added to each hit
        // const clc3 = context.clc3(); // Server side Attack Rate bonus
        // const clc4 = context.clc4(); // Damage converted to elem
        log("clc1=%s", clc1);
        log("clc2=%s", clc2);
        // log("clc3=%s", clc3);
        // log("clc4=%s", clc4);

        const weapon = equippedItems?.larm;
        const { min, max } = calculateWeaponDamage(
            attributes,
            weapon,
            equippedItems,
            false,
            clc1
            // clc2 - Flat damage, shown in the Character Screen, but not calculated during damage. Only while leech is calculated.
        );

        let result = {
            bashDamage: {
                min,
                max,
            },
        };

        return result;
    };

    return { calculate };
}
