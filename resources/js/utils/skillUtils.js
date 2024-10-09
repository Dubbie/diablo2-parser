// utils/skillUtils.js
import { calculateDamage } from "@/Composables/useSkillCalculations";
import { useSkillStore } from "@/Stores/SkillStore";
import {
    isItemUsable,
    parseModifierValue,
    ELEMENTAL_TYPES,
} from "@/Stores/StatCalculation/Utils";
import { CHAR_MAP, ANIM_DATA, DEBUG, OTHER } from "@/constants";

const ELEMENTAL_MODIFIERS = {
    fire: ["firemindam", "firemaxdam", "dmg_fire"],
    lightning: ["lightmindam", "lightmaxdam", "dmg_lightning"],
    cold: ["coldmindam", "coldmaxdam", "dmg_cold"],
    poison: ["poismindam", "poismaxdam", "dmg_poison"],
    magic: ["magicmindam", "magicmaxdam", "dmg_magic"],
};

class BreakpointTable {
    constructor(EIASvalues) {
        this.EIASvalues = EIASvalues;
        this.table = [];
    }

    addBreakpoint(EIAS, frameLength) {
        this.table.push([EIAS, frameLength]);
    }
}

export function calculateBaseDamage(characterStats, clc1) {
    return characterStats.baseDamage * (clc1 / 100);
}

export function calculateElementalDamage(baseDamage, clc2, elementMultiplier) {
    return baseDamage * (clc2 / 100) * elementMultiplier;
}

export function applyHitFlags(hitFlags) {
    // Apply hit flags, return the effects of the hit
    return hitFlags ? "Effect applied" : "No effect";
}

export function calculateToHit(characterStats, tohitcalc) {
    return characterStats.dexterity * tohitcalc;
}

/**
 * Calculates the weapon damage based on the attributes, selected weapon, and optional off-weapon modifiers.
 *
 * @param {Object} attributes - The character's attributes.
 * @param {Object} attributes.strength - The character's strength value.
 * @param {Object} attributes.dexterity - The character's dexterity value.
 * @param {Object} selectedWeapon - The weapon currently selected by the character.
 * @param {boolean} [useSecondary=false] - Indicates whether to use secondary weapon stats (if applicable).
 * @param {number} [offWeaponPercentage=0] - The percentage of off-weapon damage increase to apply.
 * @param {number} [offWeaponFlatDamage=0] - The flat damage increase to apply from off-weapon sources.
 *
 * @returns {Object} The calculated weapon damage.
 * @returns {number} return.min - The minimum calculated weapon damage.
 * @returns {number} return.max - The maximum calculated weapon damage.
 *
 * @example
 * const damage = calculateWeaponDamage(
 *     { strength: 100, dexterity: 75 },
 *     selectedWeapon,
 *     equippedItems,
 *     false,
 *     50, // 50% off-weapon increase
 *     1   // 1 flat damage increase
 * );
 */
export function calculateWeaponDamage(
    attributes,
    selectedWeapon,
    equippedItems,
    srcDam = 128,
    useSecondary = false,
    offWeaponPercentage = 0,
    offWeaponFlatDamage = 0
) {
    console.log("offWeaponPercentage:", offWeaponPercentage);
    console.log("offWeaponFlatDamage:", offWeaponFlatDamage);

    // Default values for physical damage
    let basePhysicalMin = 1;
    let basePhysicalMax = 2;
    let strBonus = selectedWeapon?.str_bonus || 0; // Default to 0 if not present
    let dexBonus = selectedWeapon?.dex_bonus || 0; // Default to 0 if not present
    const { strength, dexterity } = attributes;

    if (selectedWeapon && isItemUsable(selectedWeapon)) {
        const { two_handed, calculated_stats } = selectedWeapon;
        let damageStats =
            calculated_stats?.damage?.[two_handed ? "two_handed" : "one_handed"]
                ?.value || {};
        if (useSecondary) {
            damageStats = calculated_stats?.damage?.missile?.value;
        }

        basePhysicalMin = damageStats?.min || 0; // Fallback to default if not available
        basePhysicalMax = damageStats?.max || 0; // Fallback to default if not available
    }

    // Base damage calculation
    let totalMin = basePhysicalMin * (srcDam / 128);
    let totalMax = basePhysicalMax * (srcDam / 128);

    // Calculate the effective bonuses based on strength and dexterity
    const strengthMultiplier = strBonus / 100; // Convert strength bonus to multiplier
    const dexterityMultiplier = dexBonus / 100; // Convert dexterity bonus to multiplier

    // Calculate off-weapon bonuses
    const strengthBonusMultiplier = (strengthMultiplier * strength) / 100; // Total bonus from strength
    const dexterityBonusMultiplier = (dexterityMultiplier * dexterity) / 100; // Total bonus from dexterity
    const offWeaponMultiplier = offWeaponPercentage / 100;

    console.log("Base Min: ", basePhysicalMin);
    console.log("Base Max: ", basePhysicalMax);
    console.log("Str Bonus Multiplier: ", strengthBonusMultiplier);
    console.log("Dex Bonus Multiplier: ", dexterityBonusMultiplier);
    console.log("Off Weapon Multiplier: ", offWeaponMultiplier);

    // Sum up all multipliers
    const totalDamageMultiplier =
        strengthBonusMultiplier +
        dexterityBonusMultiplier +
        offWeaponMultiplier;
    console.log("Total Multiplier: ", totalDamageMultiplier);

    // Apply increases
    totalMin = Math.floor(totalMin * (1 + totalDamageMultiplier));
    totalMax = Math.floor(totalMax * (1 + totalDamageMultiplier));

    // Add flats if present
    totalMin += offWeaponFlatDamage;
    totalMax += offWeaponFlatDamage;

    // Add elemental flat damage.
    const elementalDamage = getFlatElementalDamage(equippedItems);
    for (const [type, damage] of Object.entries(elementalDamage)) {
        if (damage.min > 0 && damage.max > 0) {
            totalMin += damage.min * (srcDam / 128);
            totalMax += damage.max * (srcDam / 128);
        }
    }

    // Add passive elemental flat damage
    const passiveElementalDamage = getPassiveElementalDamage();
    for (const [type, damage] of Object.entries(passiveElementalDamage)) {
        if (damage.min > 0 && damage.max > 0) {
            totalMin += damage.min * (srcDam / 128);
            totalMax += damage.max * (srcDam / 128);
        }
    }

    // Return the calculated stuff
    return {
        min: Math.floor(totalMin),
        max: Math.floor(totalMax),
    };
}

export function calculateSkillDamage(skill, attributes, character, clc1, clc2) {
    const { equippedItems } = character;

    // Extract the weapon and source damage
    const weapon = equippedItems?.larm;
    const srcDam = skill.src_dmg;

    // Calculate weapon damage
    const { min, max } = calculateWeaponDamage(
        attributes,
        weapon,
        equippedItems,
        srcDam,
        false,
        clc1,
        clc2 // Optional flat damage
    );

    // Add the damage from the skill itself
    const skillDmg = calculateDamage(skill);

    return {
        min: min + skillDmg.min,
        max: max + skillDmg.max,
    };
}

export const getAnimData = (characterClass, weapon, animationMode) => {
    let token = CHAR_MAP[characterClass];
    let weaponClass = weapon?.base_stats?.weapon_class.toUpperCase() || "HTH";
    let mode = "A1";

    mode = animationMode;
    if (Array.isArray(animationMode)) {
        mode = animationMode[0];
    }

    if (mode === "S3") {
        // Swap weapon class for side swinging
        weaponClass = "1ST";
    }

    log("Getting anim data:");
    log(" - Token: ", token);
    log(" - Mode: ", mode);
    log(" - Weapon Class: ", weaponClass);

    return ANIM_DATA[token + mode + weaponClass];
};

export const generateNormalBreakpoints = (
    fpd,
    actionFrame,
    startingFrame,
    animationSpeed,
    isSequence,
    isWhirlwind,
    speedReduction
) => {
    let comparisonStrategy = isWhirlwind
        ? (left, right) => left <= right
        : (left, right) => left < right;
    let incrementStrategy =
        speedReduction < 1
            ? (eias) =>
                  truncate(
                      (animationSpeed +
                          truncate((animationSpeed * eias) / 100)) *
                          speedReduction
                  )
            : (eias) => truncate((animationSpeed * (100 + eias)) / 100);

    let table = [];

    for (let eias = -85; eias <= 75; eias++) {
        let increment = incrementStrategy(eias);
        let ticks = isSequence;
        let actionTicks = [];

        for (
            let counter = startingFrame * 256 + increment;
            comparisonStrategy(counter, fpd * 256);
            counter += increment
        ) {
            ticks++;

            let frame = truncate(counter / 256);

            if (
                !isWhirlwind &&
                actionTicks.length < actionFrame.length &&
                frame >= actionFrame[actionTicks.length]
            ) {
                actionTicks.push(ticks);
            }
        }

        if (
            table.length == 0 ||
            ticks != table[table.length - 1][1] ||
            (!isWhirlwind &&
                checkArrayNotEqual(actionTicks, table[table.length - 1][2]))
        ) {
            table.push([eias, ticks, actionTicks]);
        }
    }

    table = table.reverse();
    return table;
};

export function d(mhWeapon, ohWeapon, animData, isPrimary) {
    let framesPerDirectionHuman = animData[0];
    let framesPerDirection1 = animData[0];
    let framesPerDirection2 = animData[0];
    let framesPerDirection3 = -1;
    let actionFrame = animData[1];
    let startingFrame = animData[2];
    let animationSpeed = animData[3];
    let EIASvalues = calculateEIAS(mhWeapon, ohWeapon);
    let EIAS = EIASvalues[0];
    let nonIASEIAS = EIASvalues[1] - EIASvalues[2];
    let offset = 1;
    let speedReduction = framesPerDirection3 / framesPerDirectionHuman;
    let startingAcceleration = 0;
    let trueMaxAccelerationIncrease = OTHER.MAX_IAS_ACCELERATION_CHARACTER;

    log("framesPerDirectionHuman=%s", framesPerDirectionHuman);
    log("framesPerDirection1=%s", framesPerDirection1);
    log("framesPerDirection2=%s", framesPerDirection2);
    log("framesPerDirection3=%s", framesPerDirection3);
    log("animationSpeed=%s", animationSpeed);
    log("startingFrame=%s", startingFrame);
    log("EIASvalues=%s", EIASvalues);
    log("EIAS=%s", EIAS);
    //log("totalIAS=%s", totalIAS);
    log("nonIASEIAS=%s", nonIASEIAS);
    log("speedReduction=%s", speedReduction);
    log("offset=%s", offset);
    log("startingAcceleration=%s", startingAcceleration);
    log("trueMaxAccelerationIncrease=%s", trueMaxAccelerationIncrease);

    let accelerationTables = [new BreakpointTable(EIASvalues)];
    let previousFrameLengths = [0];

    for (
        let acceleration = startingAcceleration;
        acceleration <= trueMaxAccelerationIncrease;
        acceleration++
    ) {
        let accelerationModified = acceleration;
        let speedIncrease = truncate(
            (animationSpeed * (100 + limitEIAS(EIAS + accelerationModified))) /
                100
        );

        let firstHitLength =
            (256 * (framesPerDirection1 - startingFrame)) / speedIncrease;
        firstHitLength = Math.ceil(firstHitLength) - offset;

        if (frameLengthsNotEqual(previousFrameLengths[0], firstHitLength)) {
            previousFrameLengths[0] = [firstHitLength];
            accelerationTables[0].addBreakpoint(
                acceleration + EIAS,
                firstHitLength
            );
            log(
                "acceleration=%s,firstHitLength=%s",
                acceleration + EIAS,
                firstHitLength
            );
        }
    }

    return accelerationTables;
}

export const log = (...msg) => {
    if (DEBUG) {
        let message = "" + msg[0];
        for (let i = 1; i < msg.length; i++) {
            message = message.replace("%s", msg[i]);
        }
        console.log(message);
    }
};

export const transformBreakpoints = (breakpoints) => {
    let transformedBreakpoints = [];
    let isFirstBp = true;

    for (const bp of breakpoints.table) {
        let v = convertEIAStoVariable(bp[0], breakpoints.EIASvalues);
        if (isFirstBp && v < 0) v = 0;

        transformedBreakpoints.push([v, bp[1]]);
        isFirstBp = false;
    }

    return transformedBreakpoints;
};

export const handleWeaponUsage = (equippedItems) => {
    let mhWeapon = equippedItems?.larm;
    let ohWeapon = equippedItems?.rarm;

    if (mhWeapon && !isItemUsable(mhWeapon)) {
        mhWeapon = null;
    }
    if (ohWeapon && !isItemUsable(ohWeapon)) {
        ohWeapon = null;
    }

    return { mhWeapon, ohWeapon };
};

export const calculateDPS = (
    mainHandAvg,
    offHandAvg,
    transformedMHBPs,
    transformedOHBPs = null
) => {
    const avgDivisor = offHandAvg > 0 ? 2 : 1;
    const FPA1 = transformedMHBPs[0][1];
    const FPA2 = transformedOHBPs ? transformedOHBPs[0][1] : null;
    const FPA = FPA2 ? (FPA1 + FPA2) / 2 : FPA1;
    const attacksPerSecond = 25 / FPA;
    const DPS = ((mainHandAvg + offHandAvg) / avgDivisor) * attacksPerSecond;

    return { aps: attacksPerSecond, fpa: FPA, dps: DPS };
};

const getFlatElementalDamage = (equippedItems) => {
    console.log("Calculating elemental damage!");

    let elementalDamage = Object.fromEntries(
        ELEMENTAL_TYPES.map((type) => [type, { min: 0, max: 0 }])
    );

    Object.keys(equippedItems).forEach((slot) => {
        const item = equippedItems[slot];
        if (!item || !isItemUsable(item)) return;

        item.modifiers.forEach((modifier) => {
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
                        const minValue = parseModifierValue(
                            modifier,
                            "minValue"
                        );
                        const maxValue = parseModifierValue(
                            modifier,
                            "maxValue"
                        );
                        addElementalDamage(
                            type,
                            minValue,
                            maxValue,
                            elementalDamage
                        );
                    }

                    return;
                }
            });
        });
    });

    return elementalDamage;
};

const getPassiveElementalDamage = () => {
    const { passives } = useSkillStore();

    // Calculating passive elemental damage
    let elementalDamage = Object.fromEntries(
        ELEMENTAL_TYPES.map((type) => [type, { min: 0, max: 0 }])
    );

    for (const [statName, value] of Object.entries(passives)) {
        console.log("Passive: ", statName, value);

        Object.entries(ELEMENTAL_MODIFIERS).forEach(([type, modifiers]) => {
            if (modifiers.includes(statName)) {
                if (statName.includes("mindam")) {
                    addElementalDamage(type, value, 0, elementalDamage);
                } else if (statName.includes("maxdam")) {
                    addElementalDamage(type, 0, value, elementalDamage);
                }

                return;
            }
        });
    }

    console.log("------ ELEMENTAL DAMAGE FROM PASSIVES ------");
    console.log(elementalDamage);
    console.log("-------------------------------------------");

    return elementalDamage;
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

const convertEIAStoVariable = (neededEIAS, EIASvalues) => {
    log("neededEIAS=%s", neededEIAS);
    let remainingEIAS = neededEIAS - EIASvalues[1] + EIASvalues[2];

    return Math.max(
        0,
        convertEIAStoIAS(remainingEIAS) - EIASvalues[5] - EIASvalues[6]
    );
};

const frameLengthsNotEqual = (previousFrameLength, nextFrameLength) => {
    if (
        typeof previousFrameLength == "object" &&
        typeof nextFrameLength == "object"
    ) {
        for (let i = 0; i < previousFrameLength.length; i++) {
            if (previousFrameLength[i] != nextFrameLength[i]) return true;
        }
        return false;
    }
    if (previousFrameLength == nextFrameLength) return false;
    return true;
};

const limitEIAS = (EIAS) => {
    return Math.max(OTHER.MIN_EIAS, Math.min(OTHER.MAX_EIAS, EIAS));
};

const calculateEIAS = (mhWeapon, ohWeapon) => {
    const isDualWielding = mhWeapon && ohWeapon;
    let SIAS = 0;
    let GIAS = 0;

    if (isDualWielding) {
        const WSM1 = getWSM(mhWeapon);
        log("WSM1=%s", WSM1);
        const WSM2 = getWSM(ohWeapon);
        log("WSM2=%s", WSM2);
        let WSM = (WSM1 + WSM2) / 2;
        let IEIAS = 0;
        let IAS1 = 0;
        let IAS2 = 0;
        let EIAS = truncate(SIAS - WSM + IEIAS);

        return [EIAS, SIAS, WSM1, WSM2, IEIAS, GIAS, IAS1, IAS2];
    }

    let WSM = getWSM(mhWeapon);
    log("WSM=%s", WSM);
    let IAS = 0;
    let IEIAS = GIAS + IAS;
    let EIAS = SIAS - WSM + IEIAS;

    return [EIAS, SIAS, WSM, -1, IEIAS, GIAS, IAS, -1];
};

const getWSM = (weapon) => {
    return weapon?.base_stats?.speed || 0;
};

const truncate = (int) => {
    return int < 0 ? Math.ceil(int) : Math.floor(int);
};

const checkArrayNotEqual = (array1, array2) => {
    if (array1.length != array2.length) return true;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) return true;
    }
    return false;
};

const convertEIAStoIAS = (eias) => {
    return Math.ceil((120 * eias) / (120 - eias));
};
