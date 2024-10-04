export function useSkillCalculations() {
    const DEBUG = false;

    const tryCalculate = (skill, calcString, level, passives = {}) => {
        if (!calcString) return null;

        const masteries = getMasteriesBySkill(skill);

        const elementalDamage = getElementalDamage(skill, level);

        const context = {
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
            ...elementalDamage,
        };

        const calculations = {
            clc1: skill.calc_1,
        };

        const calculated = evaluateCalculation(
            calcString,
            context,
            calculations
        );

        return Math.floor(calculated);
    };

    const getElementalDamage = (skill, blvl) => {
        let edmn = skill.e_min;
        let edmx = skill.e_max;
        let edln = skill.e_len;

        // Adjust elemental damage and length based on breakpoints
        let edmnAdd = 0;
        let edmxAdd = 0;
        let edlnAdd = 0;

        const breakpoints = [2, 9, 17, 23, 28];

        // loop until we hit blvl, and add to the appropriate breakpoints
        let currentBreakpoint = 0;
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

    const evaluateCalculation = (calcString, context, calculations) => {
        if (DEBUG) console.log("Original Calculation String: ", calcString);
        let safeCalcString = calcString;
        safeCalcString = replaceDerivedVariables(calcString, context);
        if (DEBUG) console.log("Derived Calculation String: ", safeCalcString);
        safeCalcString = replaceContextVariables(safeCalcString, context);
        if (DEBUG) console.log("Context Calculation String: ", safeCalcString);

        return evaluateExpression(safeCalcString, calcString, DEBUG);
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

    const replaceContextVariables = (calcString, context) => {
        return Object.keys(context).reduce((acc, key) => {
            const regex = new RegExp(`\\b${key}\\b`, "g");
            return acc.replace(regex, context[key]);
        }, calcString);
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

    return {
        tryCalculate,
    };
}
