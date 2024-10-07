import { useSkillStore } from "@/Stores/SkillStore";

const skillCalcFunctions = {
    1: (skill) => {
        return handleSrvDo1(skill);
    },
    3: (skill) => {
        return handleSrvDo3(skill);
    },
};

export function useSkillDamageCalculations() {
    const skillStore = useSkillStore();

    // Store skill data and calculations
    const calculateSkillDamage = (skill) => {
        const context = skillStore.getSkillContext(skill.name);
        if (!context) {
            console.warn(`Skill Context "${skillName}" not found.`);
            return 0;
        }

        const skillFunc = skillCalcFunctions[skill.server_do_function];
        if (!skillFunc) {
            console.warn(
                `srvdofunc "${skill.server_do_function}" not implemented for skill "${skill.description.name}".`
            );
            return 0;
        }

        return skillFunc(skill);
    };

    return {
        calculateSkillDamage,
    };
}

const handleSrvDo1 = (skill) => {
    return "Do Func 1";
};

const handleSrvDo3 = (skill) => {
    return "Do Func 3";
};
