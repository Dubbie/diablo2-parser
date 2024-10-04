import { useSkillStore } from "@/Stores/SkillStore";

export function useSkillCalculations() {
    const DEBUG = false;

    const tryCalculate = (skill, calcString, level, passives = {}) => {
        if (!calcString) return null;

        const masteries = getMasteriesBySkill(skill);
        const elementalDamage = getElementalDamage(skill, level);

        let context = {
            blvl: level,
            lvl: level, // Should be overall level, with soft points
            par1: parseInt(skill.param_1),
            par2: parseInt(skill.param_2),
            par3: parseInt(skill.param_3),
            par4: parseInt(skill.param_4),
            par5: parseInt(skill.param_5),
            par6: parseInt(skill.param_6),
            par7: parseInt(skill.param_7),
            par8: parseInt(skill.param_8),
            madm: masteries?.madm ? passives[masteries.madm] : 0,
            math: masteries?.math ? passives[masteries.math] : 0,
            macr: masteries?.macr ? passives[masteries.macr] : 0,
            usmc: calculateManaCost(skill, level - 1, true),
            ...elementalDamage,
        };

        const toHit = getToHit(skill, level, context);
        context.toht = toHit;

        const calculations = {
            clc1: skill.calc_1,
            clc2: skill.calc_2,
            clc3: skill.calc_3,
            clc4: skill.calc_4,
        };

        const calculated = evaluateCalculation(
            calcString,
            context,
            calculations
        );

        return typeof calculated === "number"
            ? Math.floor(calculated)
            : calculated;
    };

    const getElementalDamage = (skill, blvl) => {
        let edmn = skill.e_min;
        let edmx = skill.e_max;
        let edln = skill.e_len;
        let edmnAdd = 0;
        let edmxAdd = 0;
        let edlnAdd = 0;
        const breakpoints = [2, 9, 17, 23, 28];
        let currentBreakpoint = 0;

        // loop until we hit blvl, and add to the appropriate breakpoints
        for (let i = 1; i <= blvl; i++) {
            if (i >= breakpoints[currentBreakpoint]) {
                currentBreakpoint++;
            }

            if (currentBreakpoint > 0) {
                edmxAdd += skill[`e_max_level_${currentBreakpoint}`];
                edmnAdd += skill[`e_min_level_${currentBreakpoint}`];
                edlnAdd +=
                    skill[`e_len_level_${Math.min(currentBreakpoint, 3)}`];
            }
        }

        return {
            edln: parseInt(edln + edlnAdd),
            edmn: parseInt(edmn + edmnAdd),
            edmx: parseInt(edmx + edmxAdd),
        };
    };

    const getToHit = (skill, level, context) => {
        if (skill.to_hit_calc) {
            return evaluateCalculation(
                skill.to_hit_calc,
                { ...context, blvl: level },
                {}
            );
        }

        // Default
        return skill.to_hit + skill.to_hit_per_level * (level - 1);
    };

    const evaluateCalculation = (calcString, context, calculations) => {
        if (DEBUG) console.log("Original Calculation String: ", calcString);
        let safeCalcString = calcString;
        safeCalcString = replaceCalcVariables(calcString, calculations);
        if (DEBUG)
            console.log("Calc Variable Calculation String: ", safeCalcString);
        safeCalcString = replaceSkillReferences(safeCalcString);
        if (DEBUG)
            console.log("Skill Reference Calculation String: ", safeCalcString);
        safeCalcString = replaceDerivedVariables(safeCalcString, context);
        if (DEBUG) console.log("Derived Calculation String: ", safeCalcString);
        safeCalcString = replaceContextVariables(safeCalcString, context);
        if (DEBUG) console.log("Context Calculation String: ", safeCalcString);
        safeCalcString = replaceMathFunctions(safeCalcString);
        if (DEBUG)
            console.log("Math Function Calculation String: ", safeCalcString);

        return evaluateExpression(safeCalcString, calcString, DEBUG);
    };

    const replaceCalcVariables = (calcString, calculations) => {
        return Object.keys(calculations).reduce((acc, key) => {
            return acc.replace(
                new RegExp(`\\b${key}\\b`, "g"),
                calculations[key]
            );
        }, calcString);
    };

    const replaceDerivedVariables = (calcString, context) => {
        // General function to create derived calculations
        const createDerivedCalculations = (type, pairs) => {
            return pairs.reduce((acc, [key, params]) => {
                acc[key] = () =>
                    type === "linear"
                        ? linearFunction(...params, context.blvl)
                        : diminishingFunction(...params, context.blvl);
                return acc;
            }, {});
        };

        // Define linear and diminishing variable pairs
        const linearPairs = [
            ["ln12", [context.par1, context.par2]],
            ["ln34", [context.par3, context.par4]],
            ["ln56", [context.par5, context.par6]],
            ["ln78", [context.par7, context.par8]],
        ];

        const diminishingPairs = [
            ["dm12", [context.par1, context.par2]],
            ["dm34", [context.par3, context.par4]],
            ["dm56", [context.par5, context.par6]],
            ["dm78", [context.par7, context.par8]],
        ];

        // Create derived calculations for linear and diminishing
        const derivedCalculations = {
            ...createDerivedCalculations("linear", linearPairs),
            ...createDerivedCalculations("diminishing", diminishingPairs),
        };

        return Object.keys(derivedCalculations).reduce((acc, key) => {
            return acc.includes(key)
                ? acc.replace(
                      new RegExp(`\\b${key}\\b`, "g"),
                      derivedCalculations[key]()
                  )
                : acc;
        }, calcString);
    };

    const linearFunction = (a, b, level) => {
        // Only add the increment if the level is greater than 1
        return a + (level > 1 ? (level - 1) * b : 0);
    };

    const diminishingFunction = (a, b, level) => {
        // Ensure the level does not go below 1 for diminishing returns
        return (110 * level * (b - a)) / (100 * (level + 6)) + a;
    };

    const replaceSkillReferences = (calcString) => {
        return calcString.replace(
            /skill\('([^']+)'\.blvl\)/g,
            (match, skillName) => {
                const skill = skillLookup(skillName);
                if (!skill) throw new Error(`Skill not found: ${skillName}`);
                return skill.level || "0";
            }
        );
    };

    const replaceContextVariables = (calcString, context) => {
        return Object.keys(context).reduce((acc, key) => {
            const regex = new RegExp(`\\b${key}\\b`, "g");
            return acc.replace(regex, context[key]);
        }, calcString);
    };

    const replaceMathFunctions = (calcString) => {
        // Replace rand, min, and max functions with dynamic number of arguments
        return (
            calcString
                // Replace rand(min, max)
                .replace(/rand\(([^)]+)\)/g, (_, range) => {
                    const [min, max] = range
                        .split(",")
                        .map((expr) => eval(expr.trim())); // Evaluate expressions for min and max
                    return Math.floor(Math.random() * (max - min + 1) + min);
                })
                // Replace min(...) with dynamic number of arguments
                .replace(/min\(([^)]+)\)/g, (_, values) => {
                    const args = values
                        .split(",")
                        .map((expr) => eval(expr.trim())); // Evaluate each argument expression
                    return Math.min(...args); // Apply Math.min to the array of evaluated arguments
                })
                // Replace max(...) with dynamic number of arguments
                .replace(/max\(([^)]+)\)/g, (_, values) => {
                    const args = values
                        .split(",")
                        .map((expr) => eval(expr.trim())); // Evaluate each argument expression
                    return Math.max(...args); // Apply Math.max to the array of evaluated arguments
                })
        );
    };

    const evaluateExpression = (calcString, originalCalcString, debug) => {
        if (debug)
            console.log(
                "Final Calculation String Before Evaluation:",
                calcString
            );
        try {
            return Function(`'use strict'; return (${calcString})`)();
        } catch (error) {
            console.error("Error evaluating calculation:", error);
            return originalCalcString; // Return original string in case of an error
        }
    };

    const getMasteriesBySkill = (skill) => {
        // Go through the 5 passive stats
        let passives = [];
        let masteries = {};

        // Keywords to identify the correct mapping
        const keywords = {
            madm: "dmg",
            math: "th",
            macr: "crit",
        };

        for (let i = 1; i <= 5; i++) {
            const statKey = `passive_stat_${i}`;
            const stat = skill[statKey];

            if (stat) {
                passives.push(stat);
            }
        }

        // we have the passives, now map these to variables
        passives.forEach((passive) => {
            for (const [key, keyword] of Object.entries(keywords)) {
                const split = passive.split("_");

                if (split.includes(keyword)) {
                    masteries[key] = passive;
                }
            }
        });

        return masteries;
    };

    const skillLookup = (skillName) => {
        // Find the skill inside the skill store
        const skillStore = useSkillStore();
        return skillStore.skillLookup[skillName] || null;
    };

    return {
        tryCalculate,
    };
}

export const calculateManaCost = (skill, level = null, usmc = false) => {
    const sLvl = level ?? skill.level;
    let manaCost =
        ((skill.mana + skill.mana_per_level * sLvl) *
            Math.pow(2, skill.mana_shift)) /
        (usmc ? 1 : 256);

    return Math.max(
        skill.min_mana,
        Number.isInteger(manaCost) ? manaCost : Math.floor(manaCost * 10) / 10
    );
};

export const calculateDmgBonus = (skill, level = null) => {
    const sLvl = level ?? skill.level;

    const minDam = skill.min_dam;
    const maxDam = skill.max_dam;

    let minAdd = 0;
    let maxAdd = 0;
    const breakpoints = [2, 9, 17, 23, 28];
    let currentBreakpoint = 0;

    // Loop until we hit the skill's level
    for (let i = 1; i <= sLvl; i++) {
        if (i >= breakpoints[currentBreakpoint]) {
            currentBreakpoint++;
        }

        if (currentBreakpoint > 0) {
            maxAdd += skill[`max_dam_level_${currentBreakpoint}`];
            minAdd += skill[`min_dam_level_${currentBreakpoint}`];
        }
    }

    return {
        min: minDam + minAdd,
        max: maxDam + maxAdd,
    };
};

export const calculateArBonus = (skill, level = null) => {
    const sLvl = level ?? skill.level;

    if (skill.to_hit_calc) {
        console.error("to_hit_calc is not supported for out of context yet.");
    }

    // Default
    return skill.to_hit + skill.to_hit_per_level * (level - 1);
};
