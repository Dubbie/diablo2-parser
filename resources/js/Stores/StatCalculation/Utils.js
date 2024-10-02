// utils.js

import { useStatCalculationStore } from "@/Stores/StatCalculationStore"; // Import the stat calculation store
import { useCharacterStore } from "@/Stores/CharacterStore"; // Import the character store
import { updateDefense, updateBlock } from "./Defense";

const WEAPON_SLOTS = ["larm", "rarm"]; // Define weapon slots to skip

export function applyModifiers(
    equippedItems,
    modifierMappings,
    updateFunction,
    context
) {
    Object.values(equippedItems).forEach((item) => {
        if (!item || !isItemUsable(item)) return; // Check if item is usable

        if (
            updateFunction === updateDefense ||
            updateFunction === updateBlock
        ) {
            updateFunction.call(context, item);
            return;
        }

        item.modifiers.forEach((modifier) => {
            const { name } = modifier;
            if (
                !modifierMappings ||
                Object.values(modifierMappings).some((modifiers) =>
                    modifiers.includes(name)
                )
            ) {
                updateFunction.call(context, modifier); // Ensure to call the function with the right context
            }
        });
    });
}

export function isItemUsable(item) {
    if (!item) {
        return true;
    }

    const statStore = useStatCalculationStore(); // Get the stat calculation store
    const characterStore = useCharacterStore(); // Get the character store

    const requiredStr = item.calculated_stats?.required_str?.value || 0;
    const requiredDex = item.calculated_stats?.required_dex?.value || 0;
    const requiredLevel = item.calculated_stats?.required_level?.value || 0;

    return (
        statStore.attributes.strength >= requiredStr &&
        statStore.attributes.dexterity >= requiredDex &&
        characterStore.character.level >= requiredLevel
    );
}

// Parse a value safely, falling back to a default if parsing fails
export const parseModifierValue = (modifier, key = "value", fallback = 0) =>
    parseInt(modifier?.values?.[key]) || fallback;

// Apply modifier if the slot is not a weapon
export const applyModifierIfNotWeapon = (slot, modifier, effectFn) => {
    if (!WEAPON_SLOTS.includes(slot)) {
        effectFn();
    }
};

// Constants for elemental types
export const ELEMENTAL_TYPES = ["fire", "lightning", "cold", "poison", "magic"];
