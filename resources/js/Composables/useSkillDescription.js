import { useSkillStore } from "@/Stores/SkillStore";
import {
    useSkillCalculations,
    calculateManaCost,
    calculateDmgBonus,
} from "@/Composables/useSkillCalculations";

const HANDLED_SKILLS = [
    // Tested skills
    "General Mastery",
    "Natural Resistance",
    "Throwing Mastery",
    "Iron Skin",
    "Deep Wounds",
    "Polearm And Spear Mastery",
    "Increased Speed",
    "Combat Reflexes",
    "Bash",
    "Double Swing",
    "Stun",
    "Frenzy",
];
const MAX_PASSIVES = 5;
const DESC_TYPES = {
    DESC: 1,
    DSC2: 2,
    DSC3: 3,
};
const TEMPLATES = {
    2: "S1 +C1 S2",
    3: "S1 C1 S2",
    4: "S1+C1",
    5: "S1 C1",
    6: "+C1 S1",
    7: "+C1 S1",
    9: "S1 S2 Damage: +C2",
    12: "S1 C1 seconds",
    18: "S1",
    40: "(C1:Color)S2S1",
    51: "S1",
    52: "S1+C1-C2S2",
    63: "S1: +C1% S2",
    73: "C1/C2 S1",
};
const DEBUG = false;

export function useSkillDescription() {
    const { skills } = useSkillStore();
    const { tryCalculate } = useSkillCalculations();

    const generateDescriptions = () => {
        skills.forEach((skill) => {
            if (HANDLED_SKILLS.includes(skill.description.name)) {
                skill.descriptionLines = generateDescription(skill);
            }
        });
    };

    const generateDescription = (skill) => {
        const previewLevel = skill.level === 0 ? 1 : skill.level;
        const passivesCurrent = calculatePassivesForSkill(skill, previewLevel);

        let descriptions = {};

        // Add details
        descriptions.details = filterSkillDescriptionLines(
            skill,
            DESC_TYPES.DSC2,
            passivesCurrent,
            skill.level
        );

        // Add the current
        descriptions.current = filterSkillDescriptionLines(
            skill,
            DESC_TYPES.DESC,
            passivesCurrent,
            previewLevel
        );

        // Add the next
        if (skill.level > 0) {
            const passivesNext = calculatePassivesForSkill(
                skill,
                previewLevel + 1
            );
            descriptions.next = filterSkillDescriptionLines(
                skill,
                DESC_TYPES.DESC,
                passivesNext,
                previewLevel + 1
            );
        }

        // Add synergies
        descriptions.synergies = filterSkillDescriptionLines(
            skill,
            DESC_TYPES.DSC3,
            passivesCurrent,
            previewLevel
        );
        // Synergies are reversed
        descriptions.synergies.reverse();

        return descriptions;
    };

    const calculatePassivesForSkill = (skill, level) => {
        const values = {};

        for (let i = 1; i <= MAX_PASSIVES; i++) {
            const statKey = `passive_stat_${i}`;
            const calcKey = `passive_calc_${i}`;
            const stat = skill[statKey];
            const calcString = skill[calcKey];

            if (!stat || !calcString) continue; // Early return for empty passives

            values[stat] = values[stat] || 0; // Initialize stat if it doesn't exist

            // Apply calculations
            values[stat] += tryCalculate(skill, calcString, level);
        }

        return values;
    };

    const filterSkillDescriptionLines = (skill, type, passives, level) => {
        const currentLines = skill.description.lines.filter(
            (line) => line.type === type
        );

        let results = [];

        currentLines.forEach((line) => {
            if (DEBUG) {
                results.push(
                    formatDescriptionLine(skill, line, passives, level, true)
                );
            }

            results.push(formatDescriptionLine(skill, line, passives, level));
        });

        return results;
    };

    const formatDescriptionLine = (
        skill,
        line,
        passives,
        level = null,
        debug = false
    ) => {
        const func = line.function;
        const textA = formatText(line.text_a);
        const textB = formatText(line.text_b);
        let calcA = tryCalculate(skill, line.calc_a, level, passives);
        let calcB = tryCalculate(skill, line.calc_b, level, passives);

        let template =
            "<span class='text-zinc-400'>Unknown Function (fn: FN, text_a: S1, text_b: S2, calc_a: C1, calc_b: C2)</span>";

        if (debug) {
            return template
                .replace("FN", func)
                .replace("S1", textA)
                .replace("S2", textB)
                .replace("C1", calcA)
                .replace("C2", calcB);
        }

        // Update template
        template = TEMPLATES[func] || template;

        // Handle some exceptions
        switch (func) {
            case 1:
                const manaCost = calculateManaCost(skill, level - 1);

                return skill.description.mana + manaCost;
            case 9:
                return handleDmgBonus(skill, level);
            case 12:
                // Check for type2
                if (line.type === 2) {
                    calcA = Math.floor(calcA / 25);
                } else {
                    calcA = Math.round((calcA / 25) * 10) / 10;
                }
                break;
            case 51:
                template = textA.replace("%d", calcA);
                break;
            case 40:
                template = textA.replace("%s", textB);
                template = getColoredText(calcA, template);
                break;
            default:
                break;
        }

        // Avoid displaying both calculations if they are the same
        if (template.includes("C1-C2") && level === 1) {
            template = template.replace("C1-C2", "C1");
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
        return text ? text.split("\\n").reverse().join("<br />") : null;
    };

    const handleDmgBonus = (skill, level) => {
        const data = calculateDmgBonus(skill, level);
        return `Damage: ${data.min}-${data.max}`;
    };

    // Exported functions
    return {
        generateDescriptions,
    };
}
