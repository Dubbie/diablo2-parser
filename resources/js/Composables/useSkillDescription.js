import { useSkillStore } from "@/Stores/SkillStore";
import {
    useSkillCalculations,
    calculatePoisonDamage,
    calculateDamage,
    calculateElementalDamage,
    calculateAvgFireDmgPerSec,
    calculateAvgElemDmgPerSec,
    calculateManaCost,
    calculateToHit,
} from "@/Composables/useSkillCalculations";

const HANDLED_SKILLS = [
    // Tested skills
    // "Werebear",
    // "Werewolf",
    // "Lycanthropy",
    // "Hunger",
    // "Maul",
    // "Feral Rage",
    // "Rabies",
    // "Shock Wave",
    // "Fire Claws",
    // "Fury",
    // "Raven",
    // "Poison Creeper",
    // "Carrion Vine",
    // "Summon Spirit Wolf",
    // "Heart of Wolverine",
    // "Spirit of Barbs",
    // "Summon Dire Wolf",
    // "Solar Creeper",
    // "Oak Sage",
    // "Summon Grizzly",
    // "Arctic Blast",
    // "Firestorm",
    // "Molten Boulder",
    // "Fire Claws",
    // "Fissure",
    // "Twister",

    // Barbarian
    "Bash",
    "Double Swing",
    "Stun",
    "Frenzy",
    "Leap",
    "Concentrate",
    "Double Throw",
    "Leap Attack",
    "Berserk",
    "Whirlwind",

    "General Mastery",
    "Throwing Mastery",
    "Natural Resistance",
    "Polearm And Spear Mastery",
    "Increased Speed",
    "Combat Reflexes",
    "Iron Skin",
    "Deep Wounds",
];
const MAX_PASSIVES = 5;
const DESC_TYPES = {
    DESC: 1,
    DSC2: 2,
    DSC3: 3,
};
const ELEM_TYPES = {
    cold: "Cold",
    fire: "Fire",
    ltng: "Lightning",
    pois: "Poison",
    mag: "Magic",
};
const TEMPLATES = {
    2: "S1 +C1 S2",
    3: "S1 C1 S2",
    4: "S1+C1",
    5: "S1 C1",
    6: "+C1 S1",
    7: "+C1 S1",
    8: "Attack Rating Hardcode",
    9: "S1 S2 Damage: +C2",
    10: "(Elem) Damage: X-Y",
    11: "^ S1 S2",
    12: "S1 C1 seconds",
    13: "Life: C1",
    14: "Poison Damage: X-Y Over Z Seconds",
    18: "S1",
    19: "S1 C1 Yards",
    22: "Average Fire Damage: X-Y Per Second",
    26: "Average (Elem) Damage: X-Y Per Second",
    27: "Average Fire Damage: X-Y Per Second",
    35: "S1: C1-C2",
    38: "S1C1-C2S2",
    40: "(C1:Color)S2S1",
    42: "S1: +C1.C2 S2",
    47: "S1C1-C2",
    51: "S1",
    52: "S1+C1-C2S2",
    63: "S1: +C1% S2",
    73: "C1/C2 S1",
};
const DEBUG = true;

export function useSkillDescription() {
    const { skills } = useSkillStore();
    const { tryCalculate } = useSkillCalculations();

    const generateDescriptions = () => {
        skills.forEach((skill) => {
            if (HANDLED_SKILLS.includes(skill.description.name)) {
                skill.descriptionLines = generateDescription(skill);
            }
            // skill.descriptionLines = generateDescription(skill);
        });
    };

    const generateDescription = (skill) => {
        const preview = skill.context.blvl() === 0;
        const passivesCurrent = calculatePassivesForSkill(skill, preview);

        let descriptions = {};

        // Add details
        descriptions.details = filterSkillDescriptionLines(
            skill,
            DESC_TYPES.DSC2,
            passivesCurrent
        );

        // Add the current
        descriptions.current = filterSkillDescriptionLines(
            skill,
            DESC_TYPES.DESC,
            passivesCurrent,
            preview
        );

        // Add the next
        if (skill.context.lvl() > 0) {
            const passivesNext = calculatePassivesForSkill(skill, true);

            if (skill.context.lvl() < skill.max_level) {
                descriptions.next = filterSkillDescriptionLines(
                    skill,
                    DESC_TYPES.DESC,
                    passivesNext,
                    true
                );
            }
        }

        // Add synergies
        descriptions.synergies = filterSkillDescriptionLines(
            skill,
            DESC_TYPES.DSC3,
            passivesCurrent
        );
        // Synergies are reversed
        descriptions.synergies.reverse();

        return descriptions;
    };

    const calculatePassivesForSkill = (skill, isPreview) => {
        // const values = {};
        // for (let i = 1; i <= MAX_PASSIVES; i++) {
        //     const statKey = `passive_stat_${i}`;
        //     const calcKey = `passive_calc_${i}`;
        //     const stat = skill[statKey];
        //     const calcString = skill[calcKey];
        //     if (!stat || !calcString) continue; // Early return for empty passives
        //     values[stat] = values[stat] || 0; // Initialize stat if it doesn't exist
        //     // Apply calculations
        //     values[stat] += tryCalculate(skill, calcString);
        // }
        // console.log("Passives: ", values);
        // return values;
    };

    const filterSkillDescriptionLines = (skill, type, passives, isPreview) => {
        const currentLines = skill.description.lines.filter(
            (line) => line.type === type
        );

        let results = [];

        currentLines.forEach((line) => {
            if (DEBUG) {
                results.push(
                    formatDescriptionLine(
                        skill,
                        line,
                        passives,
                        isPreview,
                        true
                    )
                );
            }

            results.push(
                formatDescriptionLine(skill, line, passives, isPreview)
            );
        });

        // Filter out nulls
        results = results.filter((line) => {
            return line !== null;
        });

        return results;
    };

    const formatDescriptionLine = (
        skill,
        line,
        passives,
        isPreview,
        debug = false
    ) => {
        const func = line.function;
        const textA = formatText(line.text_a);
        const textB = formatText(line.text_b);
        let calcA = tryCalculate(skill, line.calc_a, passives, isPreview);
        let calcB = tryCalculate(skill, line.calc_b, passives, isPreview);

        let template =
            "<span class='text-zinc-400'>Unknown Function (fn: FN, text_a: S1, text_b: S2, calc_a: C1, calc_b: C2)</span>";

        if (debug) {
            const calcAWithOriginal = calcA + " (" + line.calc_a + ")";
            const calcBWithOriginal = calcB + " (" + line.calc_b + ")";
            template = template.replace("Unknown Function ", "");
            return template
                .replace("FN", func)
                .replace("S1", textA)
                .replace("S2", textB)
                .replace("C1", calcAWithOriginal)
                .replace("C2", calcBWithOriginal);
        }

        // Update template
        template = TEMPLATES[func] || template;

        // Handle some exceptions
        switch (func) {
            case 1:
                const manaCost = calculateManaCost(skill, isPreview);
                return skill.description.mana + manaCost;
            case 2:
                // Only display if value is higher than 0
                if (
                    calcA === 0 ||
                    calcA === "0" ||
                    calcB === 0 ||
                    calcB === "0"
                ) {
                    return null;
                }
                break;
            case 4:
            case 5:
                calcA = Math.floor(calcA);
                break;
            case 8:
                return handleAttackRating(skill, isPreview);
            case 9:
                const bonus = calcA;
                return handleDmgBonus(skill, isPreview, bonus);
            case 10:
                return handleElemBonus(skill, isPreview);
            case 11:
                return null;
            case 14:
                return handlePoison(skill, isPreview);
            case 12:
                // Floor frenzy, as it shows only integers
                if (skill.description.name === "Frenzy") {
                    calcA = Math.floor(calcA / 25);
                } else {
                    calcA = Math.floor((calcA / 25) * 10) / 10;
                }

                break;
            case 13:
                calcA = "Not implemented";
                break;
            case 19:
                calcA = Math.floor(((calcA * 2) / 3) * 10) / 10;
                break;
            case 22:
                return handleAvgFireDamage(skill, isPreview, 7, 3, true);
            case 26:
                return handleAvgElemDamage(skill, isPreview);
            case 27:
                return handleAvgFireDamage(skill, isPreview, 14, 3);
            case 51:
                template = textA.replace("%d", calcA);
                break;
            case 52:
                calcA = Math.floor(calcA);
                calcB = Math.floor(calcB);
                if (calcA === calcB) {
                    template = template.replace("+C1-C2", "C1");
                }
                break;
            case 40:
                template = textA.replace("%s", textB);
                template = getColoredText(calcA, template);
                break;
            default:
                break;
        }

        const result = template
            .replace("FN", func)
            .replace("S1", textA)
            .replace("S2", textB)
            .replace("C1", calcA)
            .replace("C2", calcB);

        return result;
    };

    const getColoredText = (color, text) => {
        let colorClass = null;

        switch (color) {
            case 2:
                colorClass = "text-lime-400";
                break;
            default:
                colorClass = "text-zinc-400";
                break;
        }

        return `<span class="${colorClass}">${text}</span>`;
    };

    const formatText = (text) => {
        return text ? text.split("\\n").reverse().join("<br />") : "";
    };

    const handlePoison = (skill, isPreview = false) => {
        const dmg = calculatePoisonDamage(skill, isPreview);
        return `Poison Damage: ${dmg.min}-${dmg.max}<br />Over ${dmg.len} Seconds`;
    };

    const handleDmgBonus = (skill, isPreview = false, bonus = 0) => {
        const dmg = calculateDamage(skill, isPreview, bonus);

        if (dmg.min > 0 && dmg.max > 0) {
            return `Damage: ${dmg.min}-${dmg.max}`;
        }

        return null;
    };

    const handleElemBonus = (skill, isPreview = false) => {
        const dmg = calculateElementalDamage(skill, isPreview);

        const elemType = ELEM_TYPES[skill.e_type] ?? skill.e_type;
        const template = `${elemType} Damage: [value]`;
        if (dmg.min === 0 && dmg.max === 0) {
            return null;
        }

        if (dmg.min === dmg.max) {
            return template.replace("[value]", dmg.min);
        }

        return template.replace("[value]", `${dmg.min}-${dmg.max}`);
    };

    const handleAvgFireDamage = (
        skill,
        isPreview = false,
        multiplier,
        divisor,
        missile = false
    ) => {
        const dmg = calculateAvgFireDmgPerSec(
            skill,
            isPreview,
            multiplier,
            divisor,
            missile
        );
        return `Average Fire Damage: ${dmg.min}-${dmg.max} Per Second`;
    };

    const handleAvgElemDamage = (skill, isPreview = false) => {
        const dmg = calculateAvgElemDmgPerSec(skill, isPreview);
        const elemType = ELEM_TYPES[skill.e_type] ?? skill.e_type;

        return `Average ${elemType} Damage: ${dmg.min}-${dmg.max} Per Second`;
    };

    const handleAttackRating = (skill, isPreview = false) => {
        const toHit = calculateToHit(skill, isPreview);
        return `Attack Rating: +${toHit} percent`;
    };

    // Exported functions
    return {
        generateDescriptions,
    };
}
