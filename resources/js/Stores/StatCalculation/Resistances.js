import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { applyModifiers } from "@/Stores/StatCalculation/Utils"; // Adjust the path as needed

const RESISTANCE_MODIFIERS = {
    fire: ["fireresist", "all_resist"],
    cold: ["coldresist", "all_resist"],
    lightning: ["lightresist", "all_resist"],
    poison: ["poisonresist", "all_resist"],
    curse: ["curse_effectiveness"],
};

const MAX_RESISTANCE_MODIFIERS = {
    fire: ["maxfireresist"],
    cold: ["maxcoldresist"],
    lightning: ["maxlightresist"],
    poison: ["maxpoisonresist"],
};

const BASE_RES = -70;
const BASE_RES_MAX = 75;

export const calculateFinalResistances = () => {
    const statStore = useStatCalculationStore(); // Access stat calculation store
    const characterStore = useCharacterStore(); // Access character store

    // Initialize resistances
    Object.keys(statStore.resistances).forEach((resistance) => {
        statStore.resistances[resistance].total =
            resistance === "curse" ? 0 : BASE_RES;
        statStore.resistances[resistance].max = BASE_RES_MAX;
    });

    // Apply total resistance modifiers from equipped items
    applyModifiers(
        characterStore.character.equippedItems,
        RESISTANCE_MODIFIERS,
        updateResistances,
        statStore // Pass the stat calculation store context
    );

    // Apply max resistance modifiers from equipped items
    applyModifiers(
        characterStore.character.equippedItems,
        MAX_RESISTANCE_MODIFIERS,
        updateMaxResistances,
        statStore // Pass the stat calculation store context
    );

    // Cap max resistances at 95
    Object.keys(statStore.resistances).forEach((resistance) => {
        if (statStore.resistances[resistance].max > 95) {
            statStore.resistances[resistance].max = 95;
        }
    });
};

const updateResistances = function (modifier) {
    const { name, values } = modifier;

    Object.entries(RESISTANCE_MODIFIERS).forEach(
        ([resistance, resModifiers]) => {
            if (resModifiers.includes(name)) {
                this.resistances[resistance].total += parseInt(values.value);
            }
        }
    );
};

const updateMaxResistances = function (modifier) {
    const { name, values } = modifier;

    Object.entries(MAX_RESISTANCE_MODIFIERS).forEach(
        ([resistance, maxResModifiers]) => {
            if (maxResModifiers.includes(name)) {
                this.resistances[resistance].max += parseInt(values.value);
            }
        }
    );
};

export default {
    calculateFinalResistances,
};
