import { useSkillStore } from "@/Stores/SkillStore";

export function useSkillCalculations() {
    const DEBUG = true;
    const skillStore = useSkillStore();

    const tryCalculate = (skill, calcString, passives, isPreview) => {
        if (!calcString) return null;

        // Check ctx
        const ctx = skill.context;
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

        transformedCalcString = replaceContextReferences(
            transformedCalcString,
            ctx
        );
        if (DEBUG)
            console.log("- After Context Reference: ", transformedCalcString);

        // Replace min function with Math.min
        transformedCalcString = transformedCalcString.replace(
            /min/g,
            "Math.min"
        );

        if (isPreview) {
            ctx.resetPreview();
        }

        // Apply integer math (specifically for division)
        transformedCalcString = applyIntegerMath(transformedCalcString);

        const result = evaluateExpression(transformedCalcString, calcString);
        console.log(" - Result: ", result);

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

    const replaceContextReferences = (calculation, context) => {
        Object.entries(context).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, "g");
            calculation = calculation.replace(regex, value);
        });

        return calculation;
    };

    const applyIntegerMath = (calculation) => {
        return calculation.replace(
            /(\d+)\s*\/\s*(\d+)/g,
            "Math.floor($1 / $2)"
        );
    };

    const evaluateExpression = (calcString, originalCalcString) => {
        // Remove any surrounding quotes, if present
        calcString = calcString.replace(/^["']|["']$/g, "");

        if (DEBUG)
            console.log(
                "- Final Calculation String Before Evaluation:",
                calcString
            );

        try {
            // return Function(`'use strict'; return (${calcString})`)();
            return eval(`(${calcString})`);
        } catch (error) {
            console.error("Error evaluating calculation:", error.message);
            return originalCalcString; // Return original string in case of an error
        }
    };

    return {
        tryCalculate,
    };
}

export function calculatePoisonDamage(skill, isPreview = false) {
    const { min, max, len } = calculateElemBonus(skill, isPreview);
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

export const calculateElemBonus = (skill, isPreview = false) => {
    let sLvl = isPreview ? skill.context.lvl() + 1 : skill.context.lvl();
    console.log("slvl : ", sLvl);

    let edmn = skill.e_min;
    let edmx = skill.e_max;
    let edln = skill.e_len;
    let edmnAdd = 0;
    let edmxAdd = 0;
    let edlnAdd = 0;
    let multiplier = 1;
    const breakpoints = [2, 9, 17, 23, 28];
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
        console.log(" - Synergy Calc: ", synergyResult); // Output the result
        if (synergyResult) {
            multiplier += synergyResult / 100;
        }
    }

    console.log("Calculated min: ");
    console.log(parseFloat((edmn + edmnAdd) * multiplier));

    console.log("Calculated max: ", parseFloat((edmx + edmxAdd) * multiplier));
    console.log("Calculated len: ", edln + edlnAdd);

    console.log("Multiplied by: ", multiplier);

    return {
        len: edln + edlnAdd,
        min: (edmn + edmnAdd) * multiplier,
        max: (edmx + edmxAdd) * multiplier,
    };
};
