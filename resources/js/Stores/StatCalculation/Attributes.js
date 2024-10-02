import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { applyModifiers } from "@/Stores/StatCalculation/Utils";

const ATTRIBUTE_MODIFIERS = {
    strength: ["strength", "item_strength_perlevel"],
    dexterity: ["dexterity", "item_dexterity_perlevel"],
    vitality: ["vitality", "item_vitality_perlevel"],
    energy: ["energy", "item_energy_perlevel"],
};

export const calculateFinalAttributes = () => {
    const statStore = useStatCalculationStore(); // Access stat calculation store
    const characterStore = useCharacterStore(); // Access character store
    const { character } = characterStore;
    const { str, dex, vit, int: energy } = character.attributes;
    const { modified_attributes } = character;

    // Reset the final attributes to base + modified values
    statStore.attributes.strength = str + modified_attributes.str;
    statStore.attributes.dexterity = dex + modified_attributes.dex;
    statStore.attributes.vitality = vit + modified_attributes.vit;
    statStore.attributes.energy = energy + modified_attributes.int;

    // Apply attribute modifiers from equipped items
    applyModifiers(
        character.equippedItems,
        ATTRIBUTE_MODIFIERS,
        updateAttributes,
        statStore // Pass the stat calculation store context
    );
};

const updateAttributes = function (modifier) {
    const { name, values } = modifier;
    const { level } = useCharacterStore().character; // Access character level

    Object.entries(ATTRIBUTE_MODIFIERS).forEach(([attr, attrModifiers]) => {
        if (attrModifiers.includes(name)) {
            if (name.includes("perlevel")) {
                // Calculate the per-level value
                this.attributes[attr] += parseInt(values.perLevel) * level;
            } else {
                this.attributes[attr] += parseInt(values.value);
            }
        }
    });
};

export default {
    calculateFinalAttributes,
};
