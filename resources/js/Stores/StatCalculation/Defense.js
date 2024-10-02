import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { applyModifiers } from "@/Stores/StatCalculation/Utils";

export const calculateFinalDefense = () => {
    const statStore = useStatCalculationStore(); // Access stat calculation store
    const characterStore = useCharacterStore(); // Access character store

    // Reset defense to zero before calculating
    statStore.defense = 0;
    statStore.block = characterStore.character.classData.base_block ?? 0;

    // Apply defense from dexterity
    statStore.defense += Math.floor(statStore.attributes.dexterity / 4);

    // Apply defense modifiers from equipped items
    applyModifiers(
        characterStore.character.equippedItems,
        null,
        updateDefense,
        statStore // Pass the stat calculation store context
    );

    // Apply block modifiers from equipped items
    applyModifiers(
        characterStore.character.equippedItems,
        null,
        updateBlock,
        statStore // Pass the stat calculation store context
    );
};

export const updateDefense = function (item) {
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
};

export const updateBlock = function (item) {
    const flatBlockAdd = item.calculated_stats?.block?.value || 0;
    if (flatBlockAdd) {
        this.block += flatBlockAdd;
        return;
    }

    // No block on item, add based on modifiers instead
    item.modifiers.forEach(({ name, values }) => {
        if (name === "toblock") {
            this.block += parseInt(values.value);
        }
    });
};
