import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import {
    parseModifierValue,
    applyModifierIfNotWeapon,
    ELEMENTAL_TYPES,
} from "@/Stores/StatCalculation/Utils";

// Constants
const BASE_PENALTY = -35;
const DEX_TO_AR_FACTOR = 5; // Attack Rating from Dexterity
const ELEMENTAL_MODIFIERS = {
    fire: ["firemindam", "firemaxdam", "dmg_fire"],
    lightning: ["lightmindam", "lightmaxdam", "dmg_lightning"],
    cold: ["coldmindam", "coldmaxdam", "dmg_cold"],
    poison: ["poismindam", "poismaxdam", "dmg_poison"],
    magic: ["magicmindam", "magicmaxdam", "dmg_magic"],
};

export const calculateFinalWeapon = () => {
    const statStore = useStatCalculationStore();
    const characterStore = useCharacterStore();

    resetWeapon(characterStore, statStore);
    updateWeapon(characterStore, statStore);
};

/**
 * Resets the weapon stats to initial values.
 */
const resetWeapon = (characterStore, statStore) => {
    const toHitFactor = characterStore.character.classData.to_hit_factor ?? 0;
    const baseAr = BASE_PENALTY + toHitFactor;

    statStore.weapon = {
        range: 0,
        attackRating: baseAr,
        attackDamage: {
            physical: { min: 1, max: 2 },
            elemental: Object.fromEntries(
                ELEMENTAL_TYPES.map((type) => [type, { min: 0, max: 0 }])
            ),
        },
        attackSpeed: 0,
    };
};

/**
 * Updates the weapon stats based on equipped items and character attributes.
 */
export const updateWeapon = (characterStore, statStore) => {
    const mainHandWeapon = characterStore.character.equippedItems.larm;
    const { strength, dexterity } = statStore.attributes;

    let physicalDamageMultiplier = 1;
    let physicalMinAdd = 0;
    let physicalMaxAdd = 0;
    let elementalDamage = Object.fromEntries(
        ELEMENTAL_TYPES.map((type) => [type, { min: 0, max: 0 }])
    );
    let attackRatingFromModifiers = 0;
    let attackRatingMultiplier = 1;

    const equippedItems = characterStore.character.equippedItems;

    Object.keys(equippedItems).forEach((slot) => {
        const item = equippedItems[slot];
        if (!item || !isItemUsable(item)) return;

        updateModifiers(item, slot, {
            physicalDamageMultiplier,
            physicalMinAdd,
            physicalMaxAdd,
            elementalDamage,
            attackRatingFromModifiers,
            attackRatingMultiplier,
        });
    });

    updateWeaponDamage(
        mainHandWeapon,
        statStore,
        physicalDamageMultiplier,
        physicalMinAdd,
        physicalMaxAdd,
        elementalDamage
    );

    updateAttackRating(
        statStore,
        dexterity,
        attackRatingFromModifiers,
        attackRatingMultiplier
    );
};

/**
 * Updates modifiers for the equipped item.
 */
const updateModifiers = (item, slot, stats) => {
    Object.values(item.modifiers).forEach((modifier) => {
        const value = parseModifierValue(modifier);

        switch (modifier.name) {
            case "maxdamage_percent":
                applyModifierIfNotWeapon(slot, modifier, () => {
                    stats.physicalDamageMultiplier += value / 100;
                });
                break;
            case "tohit":
                stats.attackRatingFromModifiers += value;
                break;
            case "item_tohit_percent":
                stats.attackRatingMultiplier += value / 100;
                break;
            // Handle elemental damage modifiers
            default:
                updateElementalDamage(modifier, stats.elementalDamage);
        }
    });
};

/**
 * Updates elemental damage based on modifier type.
 */
const updateElementalDamage = (modifier, elementalDamage) => {
    const modifierName = modifier.name.toLowerCase(); // Normalize the name to avoid case sensitivity

    Object.entries(ELEMENTAL_MODIFIERS).forEach(([type, modifiers]) => {
        if (modifiers.includes(modifierName)) {
            if (modifierName.startsWith("min")) {
                const minValue = parseModifierValue(modifier, "value");
                addElementalDamage(type, minValue, 0, elementalDamage);
            } else if (modifierName.startsWith("max")) {
                const maxValue = parseModifierValue(modifier, "value");
                addElementalDamage(type, 0, maxValue, elementalDamage);
            } else if (modifierName.startsWith("dmg_")) {
                const minValue = parseModifierValue(modifier, "minValue");
                const maxValue = parseModifierValue(modifier, "maxValue");
                addElementalDamage(type, minValue, maxValue, elementalDamage);
            }

            return;
        }
    });
};

const addElementalDamage = (
    damageType,
    minValue,
    maxValue,
    elementalDamage
) => {
    elementalDamage[damageType].min += minValue;
    elementalDamage[damageType].max += maxValue;
};

/**
 * Updates weapon damage based on the equipped weapon's stats.
 */
const updateWeaponDamage = (
    weapon,
    statStore,
    physicalMultiplier = 1,
    physicalMinAdd = 0,
    physicalMaxAdd = 0,
    elementalDamage = 0
) => {
    // Default values for physical damage
    let basePhysicalMin = 1;
    let basePhysicalMax = 2;
    let strBonus = weapon?.str_bonus || 0; // Default to 0 if not present
    let dexBonus = weapon?.dex_bonus || 0; // Default to 0 if not present
    const { strength, dexterity } = statStore.attributes;

    if (weapon && isItemUsable(weapon)) {
        const { two_handed, calculated_stats } = weapon;
        const damageStats =
            calculated_stats?.damage?.[two_handed ? "two_handed" : "one_handed"]
                ?.value || {};

        basePhysicalMin = damageStats.min || basePhysicalMin; // Fallback to default if not available
        basePhysicalMax = damageStats.max || basePhysicalMax; // Fallback to default if not available
    }

    // Calculate the effective bonuses based on strength and dexterity
    const dexMod = (dexBonus / 100) * (dexterity / 100);
    const strMod = (strBonus / 100) * (strength / 100);

    // Calculate total minimum and maximum damage
    const totalMin = Math.floor(
        basePhysicalMin + basePhysicalMin * strMod + basePhysicalMin * dexMod
    );
    const totalMax = Math.floor(
        basePhysicalMax + basePhysicalMax * strMod + basePhysicalMax * dexMod
    );

    // Update the statStore with calculated damage
    statStore.weapon.attackDamage.physical.min = totalMin + physicalMinAdd; // Add any physicalMinAdd
    statStore.weapon.attackDamage.physical.max = totalMax + physicalMaxAdd; // Add any physicalMaxAdd
    statStore.weapon.attackDamage.elemental = elementalDamage;
};

/**
 * Updates the weapon's attack rating.
 */
const updateAttackRating = (
    statStore,
    dexterity,
    attackRatingFromModifiers,
    attackRatingMultiplier
) => {
    const arFromDex = dexterity * DEX_TO_AR_FACTOR;
    statStore.weapon.attackRating +=
        (arFromDex + attackRatingFromModifiers) * attackRatingMultiplier;
};
