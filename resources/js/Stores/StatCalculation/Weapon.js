import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { isItemUsable } from "@/Stores/StatCalculation/Utils";

// Constants
const BASE_PENALTY = -35;
const DEX_TO_AR_FACTOR = 5; // Attack Rating from Dexterity
const WEAPON_SLOTS = ["larm", "rarm"]; // Define weapon slots to skip

export const calculateFinalWeapon = () => {
    const statStore = useStatCalculationStore(); // Access stat calculation store
    const characterStore = useCharacterStore(); // Access character store

    resetWeapon(characterStore, statStore);
    updateWeapon(characterStore, statStore);
};

/**
 * Resets the weapon stats to initial values.
 * @param {Object} statStore - The stat calculation store.
 */
const resetWeapon = (characterStore, statStore) => {
    const toHitFactor = characterStore.character.classData.to_hit_factor ?? 0;
    const baseAr = BASE_PENALTY + toHitFactor;

    statStore.weapon = {
        range: 0,
        attackRating: baseAr,
        attackDamage: {
            min: 1,
            max: 2,
        },
        attackSpeed: 0,
    };
};

/**
 * Updates the weapon stats based on equipped items and character attributes.
 * @param {Object} characterStore - The character store.
 * @param {Object} statStore - The stat calculation store.
 */
export const updateWeapon = (characterStore, statStore) => {
    const mainHandWeapon = characterStore.character.equippedItems.larm;
    const { strength, dexterity } = statStore.attributes;

    // Initialize multiplier and attack rating
    let damageMultiplier = 1 + (strength > 0 ? strength / 100 : 0);
    let minAdd = 0;
    let maxAdd = 0;
    let attackRatingFromModifiers = 0;
    let attackRatingMultiplier = 1; // Initialize attack rating multiplier

    // Iterate through equipped items to check for modifiers
    const equippedItems = characterStore.character.equippedItems;

    // Iterate over equipped items to check for modifiers
    for (const slot in equippedItems) {
        const item = equippedItems[slot];

        if (!item || !isItemUsable(item)) continue;

        // Check for damage modifiers
        Object.values(item.modifiers).forEach((modifier) => {
            if (
                modifier.name === "maxdamage_percent" &&
                !WEAPON_SLOTS.includes(slot)
            ) {
                const value = parseInt(modifier?.values?.value) / 100 || 0;
                damageMultiplier += value;
            }

            // Check for attack rating modifiers
            if (modifier.name === "tohit") {
                attackRatingFromModifiers +=
                    parseInt(modifier?.values?.value) || 0;
            }

            // Check for attack rating multiplier modifiers
            if (modifier.name === "item_tohit_percent") {
                const value = parseInt(modifier?.values?.value) / 100 || 0;
                attackRatingMultiplier += value;
            }

            // Check for combined lightning damage
            if (modifier.name === "dmg_lightning") {
                minAdd += parseInt(modifier?.values?.minValue) || 0;
                maxAdd += parseInt(modifier?.values?.maxValue) || 0;
            }
        });
    }

    updateWeaponDamage(
        mainHandWeapon,
        statStore,
        damageMultiplier,
        minAdd,
        maxAdd
    );

    // Update attack rating from Dexterity and modifiers
    updateAttackRating(
        statStore,
        dexterity,
        attackRatingFromModifiers,
        attackRatingMultiplier
    );
};

/**
 * Updates weapon damage based on the equipped weapon's stats.
 * @param {Object} weapon - The equipped weapon.
 * @param {Object} statStore - The stat calculation store.
 * @param {number} multiplier - The damage multiplier.
 */
const updateWeaponDamage = (weapon, statStore, multiplier, minAdd, maxAdd) => {
    let baseMin = 1;
    let baseMax = 2;

    if (weapon && isItemUsable(weapon)) {
        const { two_handed, calculated_stats } = weapon;
        const damageStats =
            calculated_stats?.damage?.[two_handed ? "two_handed" : "one_handed"]
                ?.value || {};

        baseMin = damageStats.min;
        baseMax = damageStats.max || 2;
    }

    const finalMin = Math.floor(baseMin * multiplier + minAdd);
    const finalMax = Math.floor(baseMax * multiplier + maxAdd);

    statStore.weapon.attackDamage.min = finalMin;
    statStore.weapon.attackDamage.max = finalMax;
};

/**
 * Updates the weapon's attack rating based on Dexterity and item modifiers.
 * @param {Object} statStore - The stat calculation store.
 * @param {number} dexterity - The character's Dexterity.
 * @param {number} attackRatingFromModifiers - Total attack rating from item modifiers.
 * @param {number} attackRatingMultiplier - Total attack rating multiplier from item modifiers.
 */
const updateAttackRating = (
    statStore,
    dexterity,
    attackRatingFromModifiers,
    attackRatingMultiplier
) => {
    const arFromDex = dexterity * DEX_TO_AR_FACTOR;
    const totalAttackRating = arFromDex + attackRatingFromModifiers;

    // Apply the attack rating multiplier
    statStore.weapon.attackRating += totalAttackRating * attackRatingMultiplier;
};
