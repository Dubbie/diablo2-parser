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

        if (isPreview) {
            ctx.resetPreview();
        }

        return evaluateExpression(transformedCalcString, calcString);
    };

    // Function to evaluate the calculation string for a specific skill
    const replaceSkillReferences = (calculation) => {
        // Replace skill calls with their evaluated values
        const skillPattern = /skill\('([^']+)'\.(\w+)\)/g;
        // const statPattern = /stat\('([^']+)'\.(\w+)/g;

        // Replace skill calls with their evaluated values
        const replacedCalcString = calculation.replace(
            skillPattern,
            (match, refSkillName, key) => {
                // Get the context of the referenced skill
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

                // If the key refers to a function, call it with the context
                if (typeof refContext[key] === "function") {
                    return refContext[key]();
                }

                // Return the value directly if it's a property
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

    const evaluateExpression = (calcString, originalCalcString) => {
        if (DEBUG)
            console.log(
                "- Final Calculation String Before Evaluation:",
                calcString
            );

        try {
            return Function(`'use strict'; return (${calcString})`)();
        } catch (error) {
            console.error("Error evaluating calculation:", error);
            return originalCalcString; // Return original string in case of an error
        }
    };

    return {
        tryCalculate,
    };
}
