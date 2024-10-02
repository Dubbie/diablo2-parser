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
            physical: { min: 1, max: 2 }, // Initialize separate physical damage
            elemental: {
                fire: { min: 0, max: 0 },
                lightning: { min: 0, max: 0 },
                cold: { min: 0, max: 0 },
                poison: { min: 0, max: 0 },
                magic: { min: 0, max: 0 },
            },
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
    let physicalDamageMultiplier = 1 + (strength > 0 ? strength / 100 : 0);
    let physicalMinAdd = 0;
    let physicalMaxAdd = 0;
    let elementalDamage = {
        fire: { min: 0, max: 0 },
        lightning: { min: 0, max: 0 },
        cold: { min: 0, max: 0 },
        poison: { min: 0, max: 0 },
        magic: { min: 0, max: 0 },
    };
    let attackRatingFromModifiers = 0;
    let attackRatingMultiplier = 1; // Initialize attack rating multiplier

    // Iterate through equipped items to check for modifiers
    const equippedItems = characterStore.character.equippedItems;

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
                physicalDamageMultiplier += value; // Only affect physical damage
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

            // Check for elemental damage modifiers
            // - Lightning
            if (modifier.name === "dmg_lightning") {
                elementalDamage.lightning.min +=
                    parseInt(modifier?.values?.minValue) || 0;
                elementalDamage.lightning.max +=
                    parseInt(modifier?.values?.maxValue) || 0;
            }

            if (modifier.name === "lightmindam") {
                elementalDamage.lightning.min +=
                    parseInt(modifier?.values?.value) || 0;
            }

            if (modifier.name === "lightmaxdam") {
                elementalDamage.lightning.max +=
                    parseInt(modifier?.values?.value) || 0;
            }

            // - Fire
            if (modifier.name === "dmg_fire") {
                elementalDamage.fire.min +=
                    parseInt(modifier?.values?.minValue) || 0;
                elementalDamage.fire.max +=
                    parseInt(modifier?.values?.maxValue) || 0;
            }

            if (modifier.name === "firemindam") {
                elementalDamage.fire.min +=
                    parseInt(modifier?.values?.value) || 0;
            }

            if (modifier.name === "firemaxdam") {
                elementalDamage.fire.max +=
                    parseInt(modifier?.values?.value) || 0;
            }

            // - Cold
            if (modifier.name === "dmg_cold") {
                elementalDamage.cold.min +=
                    parseInt(modifier?.values?.minValue) || 0;
                elementalDamage.cold.max +=
                    parseInt(modifier?.values?.maxValue) || 0;
            }

            if (modifier.name === "coldmindam") {
                elementalDamage.cold.min +=
                    parseInt(modifier?.values?.value) || 0;
            }

            if (modifier.name === "coldmaxdam") {
                elementalDamage.cold.max +=
                    parseInt(modifier?.values?.value) || 0;
            }

            // - Poison
            if (modifier.name === "dmg_poison") {
                elementalDamage.poison.min +=
                    parseInt(modifier?.values?.minValue) || 0;
                elementalDamage.poison.max +=
                    parseInt(modifier?.values?.maxValue) || 0;
            }

            if (modifier.name === "poisonmindam") {
                elementalDamage.poison.min +=
                    parseInt(modifier?.values?.value) || 0;
            }

            if (modifier.name === "poisonmaxdam") {
                elementalDamage.poison.max +=
                    parseInt(modifier?.values?.value) || 0;
            }

            // - Magic
            if (modifier.name === "dmg_magic") {
                elementalDamage.magic.min +=
                    parseInt(modifier?.values?.minValue) || 0;
                elementalDamage.magic.max +=
                    parseInt(modifier?.values?.maxValue) || 0;
            }

            if (modifier.name === "magicmindam") {
                elementalDamage.magic.min +=
                    parseInt(modifier?.values?.value) || 0;
            }

            if (modifier.name === "magicmaxdam") {
                elementalDamage.magic.max +=
                    parseInt(modifier?.values?.value) || 0;
            }

            // Physical damage additions when item is not in weapon slot
            if (modifier.name === "mindamage" && !WEAPON_SLOTS.includes(slot)) {
                physicalMinAdd +=
                    parseInt(modifier?.values?.value) / 256.0 || 0;
            }

            if (modifier.name === "maxdamage" && !WEAPON_SLOTS.includes(slot)) {
                physicalMaxAdd +=
                    parseInt(modifier?.values?.value) / 256.0 || 0;
            }
        });
    }

    // Update physical and elemental damage separately
    updateWeaponDamage(
        mainHandWeapon,
        statStore,
        physicalDamageMultiplier,
        physicalMinAdd,
        physicalMaxAdd,
        elementalDamage
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
 * @param {number} multiplier - The physical damage multiplier.
 * @param {number} physicalMinAdd - Added physical minimum damage.
 * @param {number} physicalMaxAdd - Added physical maximum damage.
 * @param {Object} elementalDamage - Elemental damage additions (fire and lightning).
 */
const updateWeaponDamage = (
    weapon,
    statStore,
    physicalMultiplier,
    physicalMinAdd,
    physicalMaxAdd,
    elementalDamage
) => {
    let basePhysicalMin = 1;
    let basePhysicalMax = 2;

    if (weapon && isItemUsable(weapon)) {
        const { two_handed, calculated_stats } = weapon;
        const damageStats =
            calculated_stats?.damage?.[two_handed ? "two_handed" : "one_handed"]
                ?.value || {};

        basePhysicalMin = damageStats.min;
        basePhysicalMax = damageStats.max || 2;
    }

    // Calculate final physical damage
    const finalPhysicalMin = Math.floor(
        basePhysicalMin * physicalMultiplier + physicalMinAdd
    );
    const finalPhysicalMax = Math.floor(
        basePhysicalMax * physicalMultiplier + physicalMaxAdd
    );

    // Set physical damage
    statStore.weapon.attackDamage.physical.min = finalPhysicalMin;
    statStore.weapon.attackDamage.physical.max = finalPhysicalMax;

    // Set elemental damage (additive)
    statStore.weapon.attackDamage.elemental.fire = elementalDamage.fire;
    statStore.weapon.attackDamage.elemental.lightning =
        elementalDamage.lightning;
    statStore.weapon.attackDamage.elemental.cold = elementalDamage.cold;
    statStore.weapon.attackDamage.elemental.poison = elementalDamage.poison;
    statStore.weapon.attackDamage.elemental.magic = elementalDamage.magic;
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
