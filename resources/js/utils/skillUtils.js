// utils/skillUtils.js
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import { CHAR_MAP, ANIM_DATA, DEBUG, OTHER } from "@/constants";

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

export function calculateWeaponDamage(
    attributes,
    selectedWeapon,
    equippedItems,
    useSecondary = false
) {
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

    // Return the calculated stuff
    return {
        min: totalMin,
        max: totalMax,
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

export const convertEIAStoVariable = (neededEIAS, EIASvalues) => {
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

export const log = (...msg) => {
    if (DEBUG) {
        let message = "" + msg[0];
        for (let i = 1; i < msg.length; i++) {
            message = message.replace("%s", msg[i]);
        }
        console.log(message);
    }
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
