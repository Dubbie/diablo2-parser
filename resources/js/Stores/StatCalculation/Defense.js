import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { applyModifiers } from "@/Stores/StatCalculation/Utils";

export const calculateFinalDefense = () => {
    const statStore = useStatCalculationStore(); // Access stat calculation store
    const characterStore = useCharacterStore(); // Access character store

    // Reset defense to zero before calculating
    statStore.defense = 0;

    // Apply defense modifiers from equipped items
    applyModifiers(
        characterStore.character.equippedItems,
        null,
        updateDefense,
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
