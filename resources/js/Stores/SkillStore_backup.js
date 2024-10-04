import { defineStore } from "pinia";
import { useCharacterStore } from "./CharacterStore";

const TEMPLATES = {
    1: "Manathing",
    2: "S1 +C1 S2",
    3: "S1 C1 S2",
    4: "S1+C1",
    5: "S1 C1",
    6: "+C1 S1",
    7: "C1 S1",
    8: "S1 S2",
    9: "S1 S2 Damage: +C2",
    10: "(Elem) Damage: X-Y",
    11: "^ S1 S2",
    12: "S1 C1 seconds",
    13: "Life: C1",
    14: "Poison Damage: X-Y Over Z Seconds",
    15: "S1:S2",
    16: "Duration: (C1/25)-(C2/25) Seconds",
    17: "S2S1C1-C2 per second",
    18: "S1",
    40: "S1",
    51: "S1",
    63: "S1: +C1% S2",
    73: "C1/C2 S1",
};

const DEBUG_SKILLS = ["General Mastery"];

export const useSkillStoreBackup = defineStore("skill-backup", {
    state: () => ({
        class: null,
        madm: 0,
        macr: 0,
        math: 0,
        skills: [],
        loading: false,
        skillLookup: {},
        error: null,
    }),

    actions: {
        async fetchSkills() {
            const characterStore = useCharacterStore();
            this.loading = true;

            try {
                const { data } = await axios.get(route("api.skills.fetch"), {
                    params: { class: characterStore.character.classData.name },
                });

                this.prepareSkillData(data);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
                this.error = "Failed to fetch skills. Please try again.";
            } finally {
                this.loading = false;
            }
        },

        prepareSkillData(data) {
            this.skills = data.map((skill) => ({
                ...skill,
                level: 0, // Initialize skill levels to 0
            }));

            // Create a map for quick access to skill levels by name
            this.skillLookup = this.skills.reduce((acc, skill) => {
                acc[skill.name] = skill; // Assuming each skill has a unique 'name' property
                return acc;
            }, {});

            // Calculate
            this.calculatePassives();

            this.skills.forEach((skill) => this.generateDescription(skill));
        },

        modifyLevel(skill, amount) {
            const newLevel = Math.max(
                0,
                Math.min(skill.level + amount, skill.max_level)
            );
            skill.level = newLevel;

            // Calculate.
            this.calculatePassives();

            // Regenerate description
            this.generateDescription(skill);
        },

        addLevel(skill, amount = 1) {
            if (this.isAllocatable(skill)) {
                this.modifyLevel(skill, amount);
            }
        },

        removeLevel(skill, amount = 1) {
            this.modifyLevel(skill, -amount);
        },

        isAllocatable(skill) {
            const characterStore = useCharacterStore();
            const { level } = characterStore.character;
            const meetsLevelRequirement = level >= skill.required_level;

            const prerequisitesFulfilled = skill.skill_prerequisites.every(
                (pSkill) =>
                    this.skills.find((s) => s.id === pSkill.prerequisite_id)
                        ?.level > 0
            );

            return meetsLevelRequirement && prerequisitesFulfilled;
        },

        isUsable(skill) {
            const characterStore = useCharacterStore();
            const { level } = characterStore.character;

            return level >= skill.required_level && skill.level > 0;
        },

        calculatePassives() {
            // Reset masteries
            let _passives = {};

            this.skills.forEach((skill) => {
                if (skill.level > 0 && skill.passive_state) {
                    // Loop through the 5 passivestats, apply calculations
                    for (let i = 1; i <= 5; i++) {
                        const statKey = `passive_stat_${i}`;
                        const calcKey = `passive_calc_${i}`;
                        const stat = skill[statKey];
                        const calcString = skill[calcKey];

                        if (!stat || !calcString) {
                            continue;
                        }

                        // Apply calculations
                        const result = this.tryCalculate(
                            skill,
                            calcString,
                            skill.level - 1,
                            true
                        );

                        // Set the stat
                        if (!_passives[stat]) {
                            _passives[stat] = 0;
                        }

                        _passives[stat] += result;
                    }
                }
            });

            for (const stat in _passives) {
                this[stat] = _passives[stat];
            }
        },

        generateDescription(skill) {
            const debug = DEBUG_SKILLS.includes(skill.name);
            if (debug) {
                console.log(skill);
            }

            // oh boy.
            skill.dsc2 = this.getDsc2(skill, debug);

            skill.desc = [];
            if (skill.level === 0) {
                // Only add batch of desc with level 1
                skill.desc.push(this.getDesc(skill, 0, debug));
            } else {
                // Add desc for current level, and next level
                skill.desc.push(this.getDesc(skill, skill.level - 1, debug));
                skill.desc.push(this.getDesc(skill, skill.level, debug));
            }

            skill.dsc3 = this.getDsc3(skill, debug);
        },

        getDsc2(skill, debug = false) {
            const defaults = skill.description.lines.filter((line) => {
                return line.type === 2;
            });

            return defaults.map((defaultLine) => {
                return this.getFormattedDescriptionLine(
                    skill,
                    defaultLine,
                    null,
                    debug
                );
            });
        },

        getDesc(skill, level, debug = false) {
            const defaults = skill.description.lines.filter((line) => {
                return line.type === 1;
            });

            return defaults.map((defaultLine) => {
                return this.getFormattedDescriptionLine(
                    skill,
                    defaultLine,
                    level,
                    debug
                );
            });
        },

        getDsc3(skill, debug = false) {
            const defaults = skill.description.lines
                .filter((line) => {
                    return line.type === 3;
                })
                .sort((a, b) => a.priority + b.priority);

            return defaults.map((defaultLine) => {
                return this.getFormattedDescriptionLine(
                    skill,
                    defaultLine,
                    null,
                    debug
                );
            });
        },

        getFormattedDescriptionLine(
            skill,
            line,
            blvlOverride = null,
            debug = false
        ) {
            const func = line.function;
            const textA = this.formatText(line.text_a);
            const textB = this.formatText(line.text_b);
            const calcA = this.tryCalculate(
                skill,
                line.calc_a,
                blvlOverride,
                debug
            );
            const calcB = this.tryCalculate(
                skill,
                line.calc_b,
                blvlOverride,
                debug
            );
            let template =
                "<span class='text-zinc-400'>Unknown Function (fn: FN, text_a: S1, text_b: S2, calc_a: C1, calc_b: C2)</span>";

            // Update template
            template = TEMPLATES[func] || template;

            if (func === 1) {
                return (
                    skill.description.mana +
                    this.calculateManaCost(skill, blvlOverride)
                );
            }

            if (func === 51) {
                template = textA;
                template = template.replace("%d", calcA);
                return template;
            }

            if (func === 40) {
                template = textA;
                template = template.replace("%s", textB);

                switch (calcA) {
                    case 2:
                        template =
                            "<span class='text-lime-400'>" +
                            template +
                            "</span>";
                    default:
                        break;
                }

                return template;
            }

            // Replace placeholders with actual values
            return template
                .replace("FN", func)
                .replace("S1", textA)
                .replace("S2", textB)
                .replace("C1", calcA)
                .replace("C2", calcB);
        },

        formatText(text) {
            return text ? text.split("\\n").reverse().join("<br />") : null;
        },

        tryCalculate(skill, field, blvlOverride = null, debug = false) {
            if (!field) {
                return null;
            }

            const blvl = blvlOverride !== null ? blvlOverride : skill.level;

            // madm, macr, math
            const macr = this.passive_mastery_melee_crit ?? 0;
            const madm = this.passive_mastery_melee_dmg ?? 0;
            const math = this.passive_mastery_melee_th ?? 0;

            // Attack rating
            const toht = skill.to_hit + skill.to_hit_per_level * blvl;

            // Calculate min max
            let edmn = skill.e_min; // Elemental damage min + mastery
            let edmx = skill.e_max; // Elemental damage max + mastery
            let edln = skill.e_len; // Elemental damage length
            if (blvl >= 28) {
                edmn = skill.e_min_level_5;
                edmx = skill.e_max_level_5;
                edln = skill.e_len_level_3;
            } else if (blvl >= 23) {
                edmn = skill.e_min_level_4;
                edmx = skill.e_max_level_4;
                edln = skill.e_len_level_3;
            } else if (blvl >= 17) {
                edmn = skill.e_min_level_3;
                edmx = skill.e_max_level_3;
                edln = skill.e_len_level_3;
            } else if (blvl >= 9) {
                edmn = skill.e_min_level_2;
                edmx = skill.e_max_level_2;
                edln = skill.e_len_level_2;
            } else if (blvl >= 2) {
                edmn = skill.e_min_level_1;
                edmx = skill.e_max_level_1;
                edln = skill.e_len_level_1;
            }

            const context = {
                par1: parseInt(skill.param_1) ?? 0,
                par2: parseInt(skill.param_2) ?? 0,
                par3: parseInt(skill.param_3) ?? 0,
                par4: parseInt(skill.param_4) ?? 0,
                par5: parseInt(skill.param_5) ?? 0,
                par6: parseInt(skill.param_6) ?? 0,
                par7: parseInt(skill.param_7) ?? 0,
                par8: parseInt(skill.param_8) ?? 0,
                lvl: skill.level,
                blvl,
                edln: parseInt(edln),
                edmn: parseInt(edmn),
                edmx: parseInt(edmx),
                toht: parseInt(toht),
                usmc: this.calculateManaCost(skill, blvlOverride, true),
                enma: edmn,
                exma: edmx,
                math: math,
                macr: macr,
                madm: madm,
            };

            const calculations = {
                clc1: skill.calc_1,
                clc2: skill.calc_2,
                clc3: skill.calc_3,
                clc4: skill.calc_4,
            };

            return Math.floor(
                this.evaluateCalculation(field, context, calculations, debug)
            );
        },

        evaluateCalculation(calcString, context, calculations, debug = false) {
            if (debug) {
                console.log("Original Calculation String:", calcString); // Log the original calculation string
            }

            let safeCalcString = calcString;

            // Check if its a calculation
            Object.keys(calculations).forEach((key) => {
                if (safeCalcString.includes(key)) {
                    const value = calculations[key];
                    safeCalcString = safeCalcString.replace(
                        new RegExp(`\\b${key}\\b`, "g"),
                        value
                    ); // Replace in the string
                }
            });

            if (debug) {
                console.log("After clc replacements:", safeCalcString); // Log after skill reference replacement
            }

            // Dynamic derived variable calculations
            const derivedCalculations = {
                // a*lvl*b
                ln12: () => context.par1 + context.blvl * context.par2,
                ln34: () => context.par3 + context.blvl * context.par4,
                ln56: () => context.par5 + context.blvl * context.par6,
                ln78: () => context.par7 + context.blvl * context.par8,
                // ((110*lvl) * (b-a))/(100 * (lvl+6)) + a
                dm12: () =>
                    (110 * context.blvl * (context.par2 - context.par1)) /
                        (100 * (context.blvl + 6)) +
                    context.par1,
                dm34: () =>
                    (110 * context.blvl * (context.par4 - context.par3)) /
                        (100 * (context.blvl + 6)) +
                    context.par3,
                dm56: () =>
                    (110 * (context.blvl + 1) * (context.par6 - context.par5)) /
                        (100 * (context.blvl + 1 + 6)) +
                    context.par5,
                dm78: () =>
                    (110 * context.blvl * (context.par8 - context.par7)) /
                        (100 * (context.blvl + 6)) +
                    context.par7,
            };

            // Replace derived variables in the modified string
            Object.keys(derivedCalculations).forEach((key) => {
                if (safeCalcString.includes(key)) {
                    const value = derivedCalculations[key](); // Evaluate the derived variable
                    safeCalcString = safeCalcString.replace(
                        new RegExp(`\\b${key}\\b`, "g"),
                        value
                    ); // Replace in the string
                }
            });

            if (debug) {
                console.log(
                    "After Derived Variables Replacement:",
                    safeCalcString
                ); // Log after skill reference replacement
            }

            // Replace skill references with their blvl values
            safeCalcString = safeCalcString.replace(
                /skill\('([^']+)'\.blvl\)/g,
                (match, skillName) => {
                    const skill = this.skillLookup[skillName]; // Lookup the skill by name

                    if (!skill) {
                        throw new Error(`Skill not found: ${skillName}`);
                    }

                    return skill ? skill.level : "0"; // Use 0 if the skill isn't found
                }
            );

            if (debug) {
                console.log("After Skill Replacement:", safeCalcString); // Log after skill reference replacement
            }

            // Replace variable names in the safe calculation string with their values
            Object.keys(context).forEach((key) => {
                const regex = new RegExp(`\\b${key}\\b`, "g");
                safeCalcString = safeCalcString.replace(regex, context[key]);
            });

            if (debug) {
                console.log(
                    "After First Variable Replacement:",
                    safeCalcString
                ); // Log after first round of variable replacements
            }

            // Replace min,max,rand
            safeCalcString = safeCalcString
                .replace(/rand\((\d+),(\d+)\)/g, (match, min, max) => {
                    return Math.floor(Math.random() * (max - min + 1) + min);
                })
                .replace(/min\((\d+),(\d+)\)/g, (match, min, max) => {
                    return Math.min(min, max);
                })
                .replace(/max\((\d+),(\d+)\)/g, (match, min, max) => {
                    return Math.max(min, max);
                });

            if (debug) {
                console.log("After math func Replacement:", safeCalcString); // Log after second round of variable replacements
            }

            if (debug) {
                console.log(
                    "Final Calculation String Before Evaluation:",
                    safeCalcString
                ); // Log the final string
            }

            // Evaluate the modified string as a mathematical expression
            try {
                return Function(`'use strict'; return (${safeCalcString})`)();
            } catch (error) {
                console.error("Error evaluating calculation:", error);
                return calcString; // or some default value
            }
        },

        calculateManaCost(skill, blvlOverride = null, usmc = false) {
            const sLvl = blvlOverride ?? skill.level;
            let manaCost =
                ((skill.mana + skill.mana_per_level * sLvl) *
                    Math.pow(2, skill.mana_shift)) /
                (usmc ? 1 : 256);
            return Math.max(
                skill.min_mana,
                Number.isInteger(manaCost)
                    ? manaCost
                    : Math.floor(manaCost * 10) / 10
            );
        },
    },
});
