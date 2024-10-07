import { useSkillStore } from "@/Stores/SkillStore";
import { MAX_PASSIVES } from "@/constants";

export function useSkillCalculations() {
    const DEBUG = false;
    const skillStore = useSkillStore();

    const tryCalculate = (skill, calcString, passives, isPreview) => {
        if (!calcString) return null;

        // Check ctx
        const skillStore = useSkillStore();
        const ctx = skillStore.getSkillContext(skill.name);
        if (isPreview) {
            ctx.setPreview();
        }

        let transformedCalcString = calcString;
        if (DEBUG)
            console.log(
                "- Original Calculation String: ",
                transformedCalcString
            );

        transformedCalcString = replaceSkillReferences(transformedCalcString);
        if (DEBUG)
            console.log("- After Skill Reference: ", transformedCalcString);

        transformedCalcString = replaceStatReferences(transformedCalcString);
        if (DEBUG)
            console.log("- After Stat Reference: ", transformedCalcString);

        transformedCalcString = replaceContextReferences(
            transformedCalcString,
            ctx
        );
        if (DEBUG)
            console.log("- After Context Reference: ", transformedCalcString);

        // Replace min function with Math.min
        transformedCalcString = replaceMathFunctions(transformedCalcString);
        if (DEBUG)
            console.log("- After Math Function: ", transformedCalcString);

        if (isPreview) {
            ctx.resetPreview();
        }

        // Apply integer math (specifically for division)
        transformedCalcString = applyIntegerMath(transformedCalcString);
        if (DEBUG) console.log("- After integer math: ", transformedCalcString);

        const result = evaluateExpression(transformedCalcString, calcString);
        if (DEBUG) console.log("- Result: ", transformedCalcString);

        return result;
    };

    const replaceSkillReferences = (calculation) => {
        const skillPattern = /skill\('([^']+)'\.(\w+)\)/g;

        const replacedCalcString = calculation.replace(
            skillPattern,
            (match, refSkillName, key) => {
                const refContext = skillStore.getSkillContext(
                    refSkillName,
                    true
                );
                if (!refContext) {
                    console.warn(
                        `Context for skill "${refSkillName}" not found.`
                    );
                    return calculation;
                }

                if (typeof refContext[key] === "function") {
                    return refContext[key]();
                }

                return refContext[key] || 0;
            }
        );

        return replacedCalcString;
    };

    const replaceStatReferences = (calculation) => {
        const statPattern = /stat\('([^']+)'\.(\w+)\)/g;

        const replacedCalcString = calculation.replace(
            statPattern,
            (match, refSkillName, key) => {
                // TODO: Implement stat handling for skills
                return 0;
            }
        );

        return replacedCalcString;
    };

    const replaceContextReferences = (calculation, context) => {
        Object.entries(context).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, "g");
            calculation = calculation.replace(regex, value);
        });

        return calculation;
    };

    const replaceMathFunctions = (calculation) => {
        calculation = calculation.replace(/min/g, "Math.min");
        calculation = calculation.replace(/max/g, "Math.max");
        return calculation;
    };

    const applyIntegerMath = (calculation) => {
        return calculation.replace(
            /(\d+)\s*\/\s*(\d+)/g,
            "Math.floor($1 / $2)"
        );
    };

    const evaluateExpression = (calcString, originalCalcString) => {
        // Remove all quotes from the calculation string
        calcString = calcString.replace(/['"]/g, "");

        if (DEBUG) {
            console.log(
                "- Final Calculation String Before Evaluation:",
                calcString
            );
        }

        try {
            // Evaluate the expression
            return eval(`(${calcString})`);
        } catch (error) {
            console.error("Error evaluating calculation:", error.message);
            console.error("Failed Calculation String:", calcString); // Log the problematic string
            return originalCalcString; // Return original string in case of an error
        }
    };

    return {
        tryCalculate,
    };
}

export function calculatePoisonDamage(skill, isPreview = false) {
    const { min, max, len } = calculateElementalDamage(skill, isPreview, false);
    const hitShift = Math.pow(2, skill.hit_shift);
    const x = Math.floor((min * len) / (256 / hitShift));
    const y = Math.floor((max * len) / (256 / hitShift));
    const z = Math.floor(len / 25);

    return {
        min: x,
        max: y,
        len: z,
    };
}

export const calculateElementalDamage = (
    skill,
    isPreview = false,
    doHitShift = true
) => {
    const skillStore = useSkillStore();
    const context = skillStore.getSkillContext(skill.name);
    const breakpoints = [2, 9, 17, 23, 28];
    let sLvl = isPreview ? context.lvl() + 1 : context.lvl();
    let edmn = skill.e_min;
    let edmx = skill.e_max;
    let edln = skill.e_len;
    let edmnAdd = 0;
    let edmxAdd = 0;
    let edlnAdd = 0;
    let multiplier = 1;
    let currentBreakpoint = 0;

    // Loop until we hit blvl, and add to the appropriate breakpoints
    for (let i = 1; i <= sLvl; i++) {
        if (i >= breakpoints[currentBreakpoint]) {
            currentBreakpoint++;
        }

        if (currentBreakpoint > 0) {
            edmxAdd += skill[`e_max_level_${currentBreakpoint}`];
            edmnAdd += skill[`e_min_level_${currentBreakpoint}`];
            edlnAdd += skill[`e_len_level_${Math.min(currentBreakpoint, 3)}`];
        }
    }

    // Calculate synergy here as well
    const synergyCalc = skill.e_dmg_sym_per_calc;
    if (synergyCalc) {
        // Use the useSkillCalculations to get access to tryCalculate
        const skillCalc = useSkillCalculations();

        // Call tryCalculate from the skillCalc
        const synergyResult = skillCalc.tryCalculate(skill, synergyCalc, sLvl); // percent increase
        if (synergyResult) {
            multiplier += synergyResult / 100;
        }
    }

    let min = (edmn + edmnAdd) * multiplier;
    let max = (edmx + edmxAdd) * multiplier;

    if (doHitShift) {
        min = Math.floor(min / (256 / Math.pow(2, skill.hit_shift)));
        max = Math.floor(max / (256 / Math.pow(2, skill.hit_shift)));
    }
    return {
        len: edln + edlnAdd,
        min,
        max,
    };
};

export function calculateDamage(skill, isPreview = false, bonus) {
    const skillStore = useSkillStore();
    const context = skillStore.getSkillContext(skill.name);
    const breakpoints = [2, 9, 17, 23, 28];
    let sLvl = isPreview ? context.lvl() + 1 : context.lvl();
    let min = skill.min_dam;
    let max = skill.max_dam;
    let minAdd = 0;
    let maxAdd = 0;
    let multiplier = 1;
    let currentBreakpoint = 0;

    // Loop until we hit blvl, and add to the appropriate breakpoints
    for (let i = 1; i <= sLvl; i++) {
        if (i >= breakpoints[currentBreakpoint]) {
            currentBreakpoint++;
        }

        if (currentBreakpoint > 0) {
            minAdd += skill[`min_dam_level_${currentBreakpoint}`];
            maxAdd += skill[`max_dam_level_${currentBreakpoint}`];
        }
    }

    // Calculate synergy here as well
    const synergyCalc = skill.dmg_sym_per_calc;
    if (synergyCalc) {
        // Use the useSkillCalculations to get access to tryCalculate
        const skillCalc = useSkillCalculations();

        // Call tryCalculate from the skillCalc
        const synergyResult = skillCalc.tryCalculate(skill, synergyCalc, sLvl); // percent increase
        if (synergyResult) {
            multiplier += synergyResult / 100;
        }
    }

    const bonusMulti = bonus > 0 ? bonus / 100 + 1 : 1;
    min = Math.floor(
        Math.floor(Math.floor((min + minAdd) * multiplier) * bonusMulti) /
            (256 / Math.pow(2, skill.hit_shift))
    );
    max = Math.floor(
        Math.floor(Math.floor((max + maxAdd) * multiplier) * bonusMulti) /
            (256 / Math.pow(2, skill.hit_shift))
    );

    return {
        min,
        max,
    };
}

export const calculateAvgFireDmgPerSec = (
    skill,
    isPreview = false,
    multiplier,
    divisor,
    missile = false
) => {
    const dmg = calculateElementalDamage(skill, isPreview, false);
    let min = dmg.min;
    let max = dmg.min === dmg.max ? dmg.min + 1 : dmg.max;
    let x = (min * multiplier) / divisor / Math.pow(2, skill.hit_shift);
    let y = (max * multiplier) / divisor / Math.pow(2, skill.hit_shift);

    if (missile) {
        x = (min * multiplier) / divisor;
        y = (max * multiplier) / divisor;
    }

    return {
        min: Math.floor(x),
        max: Math.floor(y),
    };
};

export const calculateAvgElemDmgPerSec = (skill, isPreview = false) => {
    const dmg = calculateElementalDamage(skill, isPreview, false);
    const x = (dmg.min * 25) / (256 / Math.pow(2, skill.hit_shift));
    const y = (dmg.max * 25) / (256 / Math.pow(2, skill.hit_shift));

    return {
        min: Math.floor(x),
        max: Math.floor(y),
        len: dmg.len / 25,
    };
};

export const calculateManaCost = (skill, isPreview = false, usmc = false) => {
    const skillStore = useSkillStore();
    const context = skillStore.getSkillContext(skill.name);
    const sLvl = isPreview ? context.lvl() + 1 : context.lvl();
    let manaCost =
        ((skill.mana + skill.mana_per_level * (sLvl - 1)) *
            Math.pow(2, skill.mana_shift)) /
        (usmc ? 1 : 256);

    return Math.max(
        skill.min_mana,
        Number.isInteger(manaCost) ? manaCost : Math.floor(manaCost * 10) / 10
    );
};

export const calculateManaCostPerSecond = (skill, isPreview = false) => {
    // TODO: Fix this calculation
    const manaCost = calculateManaCost(skill, isPreview);
    return manaCost * 10;
};

export const calculateToHit = (skill, isPreview = false) => {
    const skillStore = useSkillStore();
    const context = skillStore.getSkillContext(skill.name);
    const baseToHit = skill.to_hit;
    const toHitPerLev = skill.to_hit_per_level;
    const level = isPreview ? context.lvl() + 1 : context.lvl();

    if (skill.to_hit_calc) {
        const skillCalc = useSkillCalculations();

        // Call tryCalculate from the skillCalc
        return skillCalc.tryCalculate(skill, skill.to_hit_calc, level); // percent increase
    }

    return baseToHit + toHitPerLev * (level - 1);
};

export const getMasteryBySkill = (skill, passiveType, isPreview = false) => {
    // Check which passive we are looking for
    let passiveKey = null;
    let passiveCalc = null;

    for (let i = 1; i <= MAX_PASSIVES; i++) {
        const passiveStatKey = `passive_stat_${i}`;
        const passiveCalcKey = `passive_calc_${i}`;
        const passiveStatName = skill[passiveStatKey];

        if (!passiveStatName) continue; // Early return for empty passives

        // Split it up and check for the type
        const split = passiveStatName.split("_");
        if (split.includes(passiveType)) {
            passiveKey = passiveStatName; // Found the passive
            passiveCalc = skill[passiveCalcKey];
            break;
        }
    }

    if (!passiveKey) {
        return 0;
    }

    // Get mod
    const mod = useSkillCalculations().tryCalculate(
        skill,
        passiveCalc,
        null,
        isPreview
    );

    // Return
    return mod;
};

export const getCritMasteryBySkill = (skill, isPreview = false) =>
    getMasteryBySkill(skill, "crit", isPreview);

export const getAttackRatingMasteryBySkill = (skill, isPreview = false) =>
    getMasteryBySkill(skill, "th", isPreview);

export const getDamageMasteryBySkill = (skill, isPreview = false) =>
    getMasteryBySkill(skill, "dmg", isPreview);
