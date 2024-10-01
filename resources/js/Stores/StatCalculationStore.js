import { defineStore } from "pinia";
import { useCharacterStore } from "@/Stores/CharacterStore";

const ATTRIBUTE_MODIFIERS = {
    strength: "strength",
    dexterity: "dexterity",
    vitality: "vitality",
    energy: "energy",
};

const RESISTANCE_MODIFIERS = {
    fire: ["fireresist", "all_resist"],
    cold: ["coldresist", "all_resist"],
    lightning: ["lightresist", "all_resist"],
    poison: ["poisonresist", "all_resist"],
    curse: ["curse_effectiveness"],
};

export const useStatCalculationStore = defineStore("statCalculation", {
    state: () => ({
        attributes: {
            strength: 0,
            dexterity: 0,
            vitality: 0,
            energy: 0,
        },
        resistances: {
            fire: 0,
            cold: 0,
            lightning: 0,
            poison: 0,
            curse: 0,
        },
        defense: 0,
    }),

    actions: {
        calculateStats() {
            this.calculateFinalAttributes();
            this.calculateFinalResistances();
            this.calculateFinalDefense();
        },

        calculateFinalAttributes() {
            const characterStore = useCharacterStore();
            const character = characterStore.character;

            // Reset the final attributes to base + modified values
            this.attributes.strength =
                character.attributes.str + character.modified_attributes.str;
            this.attributes.dexterity =
                character.attributes.dex + character.modified_attributes.dex;
            this.attributes.vitality =
                character.attributes.vit + character.modified_attributes.vit;
            this.attributes.energy =
                character.attributes.int + character.modified_attributes.int;

            // Iterate over equipped items and apply modifiers
            this.applyModifiers(character.equippedItems, this.updateAttributes);
        },

        calculateFinalResistances() {
            const characterStore = useCharacterStore();

            const baseRes = -70; // Configurable based on quests, for now hardcoded

            // Initialize resistances
            this.resistances.fire = baseRes;
            this.resistances.cold = baseRes;
            this.resistances.lightning = baseRes;
            this.resistances.poison = baseRes;
            this.resistances.curse = 0;

            // Iterate over equipped items and apply resistance modifiers
            this.applyModifiers(
                characterStore.character.equippedItems,
                this.updateResistances
            );
        },

        calculateFinalDefense() {
            const characterStore = useCharacterStore();

            this.defense = 0;

            // Iterate over equipped items and apply defense modifiers
            this.applyModifiers(
                characterStore.character.equippedItems,
                this.updateDefense
            );
        },

        applyModifiers(equippedItems, updateFunction) {
            Object.keys(equippedItems).forEach((slot) => {
                const item = equippedItems[slot];
                if (!item || !this.isItemUsable(item)) return;

                if (updateFunction === this.updateDefense) {
                    updateFunction.call(this, item);
                } else {
                    item.modifiers.forEach((modifier) => {
                        updateFunction.call(this, modifier);
                    });
                }
            });
        },

        updateAttributes(modifier) {
            const { name, values } = modifier;

            if (name in ATTRIBUTE_MODIFIERS) {
                this.attributes[name] += parseInt(values.value);
            }
        },

        updateResistances(modifier) {
            const { name, values } = modifier;

            Object.keys(RESISTANCE_MODIFIERS).forEach((resistance) => {
                const resistanceModifiers = RESISTANCE_MODIFIERS[resistance];
                if (resistanceModifiers.includes(name)) {
                    this.resistances[resistance] += parseInt(values.value);
                }
            });
        },

        updateDefense(item) {
            const defenseValue = item.calculated_stats?.defense?.value || 0;

            if (defenseValue) {
                this.defense += defenseValue;
                return;
            }

            // No defense on item, add based on modifiers instead
            item.modifiers.forEach((modifier) => {
                const { name, values } = modifier;
                if (name === "armorclass") {
                    this.defense += parseInt(values.value);
                }
            });
        },

        isItemUsable(item) {
            const characterStore = useCharacterStore();
            const level = characterStore.character.level || 1;

            const requiredStr = item.calculated_stats?.required_str?.value || 0;
            const requiredDex = item.calculated_stats?.required_dex?.value || 0;
            const requiredLevel =
                item.calculated_stats?.required_level?.value || 0;

            return (
                this.attributes.strength >= requiredStr &&
                this.attributes.dexterity >= requiredDex &&
                level >= requiredLevel
            );
        },
    },
});
