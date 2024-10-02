import { defineStore } from "pinia";
import { useCharacterStore } from "@/Stores/CharacterStore";

const ATTRIBUTE_MODIFIERS = {
    strength: ["strength", "item_strength_perlevel"],
    dexterity: ["dexterity", "item_dexterity_perlevel"],
    vitality: ["vitality", "item_vitality_perlevel"],
    energy: ["energy", "item_energy_perlevel"],
};

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

export const useStatCalculationStore = defineStore("statCalculation", {
    state: () => ({
        attributes: {
            strength: 0,
            dexterity: 0,
            vitality: 0,
            energy: 0,
        },
        resistances: {
            fire: {
                total: 0,
                max: BASE_RES_MAX,
            },
            cold: {
                total: 0,
                max: BASE_RES_MAX,
            },
            lightning: {
                total: 0,
                max: BASE_RES_MAX,
            },
            poison: {
                total: 0,
                max: BASE_RES_MAX,
            },
            curse: {
                total: 0,
                max: BASE_RES_MAX,
            },
        },
        defense: 0,
    }),

    getters: {
        // Getter for capped fire resistance
        fireResistance(state) {
            return Math.min(
                state.resistances.fire.total,
                state.resistances.fire.max
            );
        },

        // Getter for capped cold resistance
        coldResistance(state) {
            return Math.min(
                state.resistances.cold.total,
                state.resistances.cold.max
            );
        },

        // Getter for capped lightning resistance
        lightningResistance(state) {
            return Math.min(
                state.resistances.lightning.total,
                state.resistances.lightning.max
            );
        },

        // Getter for capped poison resistance
        poisonResistance(state) {
            return Math.min(
                state.resistances.poison.total,
                state.resistances.poison.max
            );
        },

        // Getter for all resistances (for easier access)
        cappedResistances(state) {
            return {
                fire: Math.min(
                    state.resistances.fire.total,
                    state.resistances.fire.max
                ),
                cold: Math.min(
                    state.resistances.cold.total,
                    state.resistances.cold.max
                ),
                lightning: Math.min(
                    state.resistances.lightning.total,
                    state.resistances.lightning.max
                ),
                poison: Math.min(
                    state.resistances.poison.total,
                    state.resistances.poison.max
                ),
                curse: state.resistances.curse.total, // Curse has no max resistance modifier
            };
        },
    },

    actions: {
        calculateStats() {
            this.calculateFinalAttributes();
            this.calculateFinalResistances();
            this.calculateFinalDefense();
        },

        calculateFinalAttributes() {
            const { character } = useCharacterStore();
            const { str, dex, vit, int: energy } = character.attributes;
            const { modified_attributes } = character;

            // Reset the final attributes to base + modified values
            this.attributes.strength = str + modified_attributes.str;
            this.attributes.dexterity = dex + modified_attributes.dex;
            this.attributes.vitality = vit + modified_attributes.vit;
            this.attributes.energy = energy + modified_attributes.int;

            // Apply attribute modifiers
            this.applyModifiers(
                character.equippedItems,
                ATTRIBUTE_MODIFIERS,
                this.updateAttributes
            );
        },

        calculateFinalResistances() {
            const { character } = useCharacterStore();

            // Initialize resistances and max resistances
            Object.keys(this.resistances).forEach((resistance) => {
                this.resistances[resistance].total =
                    resistance === "curse" ? 0 : BASE_RES;
                this.resistances[resistance].max = BASE_RES_MAX;
            });

            // Apply total resistance modifiers
            this.applyModifiers(
                character.equippedItems,
                RESISTANCE_MODIFIERS,
                this.updateResistances
            );

            // Apply max resistance modifiers
            this.applyModifiers(
                character.equippedItems,
                MAX_RESISTANCE_MODIFIERS,
                this.updateMaxResistances
            );

            // Cap max resistances at 95
            Object.keys(this.resistances).forEach((resistance) => {
                if (this.resistances[resistance].max > 95) {
                    this.resistances[resistance].max = 95;
                }
            });
        },

        calculateFinalDefense() {
            const { character } = useCharacterStore();

            this.defense = 0;
            // Apply defense modifiers
            this.applyModifiers(
                character.equippedItems,
                null,
                this.updateDefense
            );
        },

        applyModifiers(equippedItems, modifierMappings, updateFunction) {
            Object.values(equippedItems).forEach((item) => {
                if (!item || !this.isItemUsable(item)) return;

                if (updateFunction === this.updateDefense) {
                    // Directly pass the item for defense calculation
                    updateFunction.call(this, item);
                } else {
                    // Apply only relevant modifiers based on mapping
                    item.modifiers.forEach((modifier) => {
                        const { name } = modifier;
                        if (
                            !modifierMappings ||
                            Object.values(modifierMappings).some((modifiers) =>
                                modifiers.includes(name)
                            )
                        ) {
                            updateFunction.call(this, modifier);
                        }
                    });
                }
            });
        },

        updateAttributes(modifier) {
            const { name, values } = modifier;
            const { level } = useCharacterStore().character;

            Object.entries(ATTRIBUTE_MODIFIERS).forEach(
                ([attr, attrModifiers]) => {
                    if (attrModifiers.includes(name)) {
                        if (name.includes("perlevel")) {
                            // calculate the per level value
                            this.attributes[attr] +=
                                parseInt(values.perLevel) * level;
                        } else {
                            this.attributes[attr] += parseInt(values.value);
                        }
                    }
                }
            );
        },

        updateResistances(modifier) {
            const { name, values } = modifier;

            Object.entries(RESISTANCE_MODIFIERS).forEach(
                ([resistance, resModifiers]) => {
                    if (resModifiers.includes(name)) {
                        this.resistances[resistance].total += parseInt(
                            values.value
                        );
                    }
                }
            );
        },

        updateMaxResistances(modifier) {
            const { name, values } = modifier;

            Object.entries(MAX_RESISTANCE_MODIFIERS).forEach(
                ([resistance, maxResModifiers]) => {
                    if (maxResModifiers.includes(name)) {
                        console.log("Resistance:");
                        console.log(resistance);
                        console.log("ResistanceData:");
                        console.log(this.resistances[resistance]);

                        this.resistances[resistance].max += parseInt(
                            values.value
                        );
                    }
                }
            );
        },

        updateDefense(item) {
            const defenseValue = item.calculated_stats?.defense?.value || 0;

            if (defenseValue) {
                this.defense += defenseValue;
                return;
            }

            // No defense on item, add based on modifiers instead
            item.modifiers.forEach(({ name, values }) => {
                if (name === "armorclass") {
                    this.defense += parseInt(values.value);
                }
            });
        },

        isItemUsable(item) {
            const { level } = useCharacterStore().character;

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
