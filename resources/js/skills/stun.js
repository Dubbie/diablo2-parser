// skills/stun.js
import { useSkillStore } from "@/Stores/SkillStore";
import { calculateSkillDamage } from "@/utils/skillUtils"; // Import the new function

export function useStun() {
    const calculate = (skill, attributes, character) => {
        const skillStore = useSkillStore();
        const context = skillStore.getSkillContext(skill.name);
        const clc1 = context.clc1(); // Damage% added to each hit
        const clc2 = context.clc2(); // Drain damage added to each hit

        // Calculate damage using the shared function
        const stunDamage = calculateSkillDamage(
            skill,
            attributes,
            character,
            clc1,
            clc2
        );

        return { stunDamage };
    };

    return { calculate };
}
