// skills/attack.js
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import {
    calculateWeaponDamage,
    getAnimData,
    d,
    convertEIAStoVariable,
} from "@/utils/skillUtils";

const ANIMATION_MODE = ["A1", "A2"];

const transformBreakpoints = (breakpoints) => {
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

export function useAttack() {
    const calculate = (skill, attributes, character) => {
        const { equippedItems } = character;
        let mhWeapon = equippedItems?.larm;
        let ohWeapon = equippedItems?.rarm;

        if (mhWeapon && !isItemUsable(mhWeapon)) {
            mhWeapon = null;
        }
        if (ohWeapon && !isItemUsable(ohWeapon)) {
            ohWeapon = null;
        }

        const mainHand = calculateWeaponDamage(
            attributes,
            mhWeapon,
            equippedItems
        );
        const offHand = ohWeapon
            ? calculateWeaponDamage(attributes, ohWeapon, equippedItems)
            : null;

        const result = {
            attackDamage: {
                mainHand,
                offHand:
                    offHand && isItemUsable(ohWeapon) ? offHand : undefined,
            },
        };

        // Get Main Hand Animation Data
        const mhAnimData = getAnimData(
            character.classData.name,
            mhWeapon,
            ANIMATION_MODE
        );

        const mhBreakpoints = d(mhWeapon, ohWeapon, mhAnimData, true)[0];
        const transformedMHBPs = transformBreakpoints(mhBreakpoints);

        // Handle dual wielding for Barbarian class
        let transformedOHBPs = null;
        if (character.classData.name === "Barbarian" && ohWeapon) {
            const ohAnimData = getAnimData(
                character.classData.name,
                ohWeapon,
                "S3"
            );

            const ohBreakpoints = d(ohWeapon, mhWeapon, ohAnimData, true)[0];
            transformedOHBPs = transformBreakpoints(ohBreakpoints);
        }

        // Calculate DPS!!!!!!!!! BAM
        const mhAvg = (mainHand.min + mainHand.max) / 2;
        const ohAvg =
            offHand && isItemUsable(ohWeapon)
                ? (offHand.min + offHand.max) / 2
                : 0;
        const avgDivisor = ohAvg > 0 ? 2 : 1;
        const FPA1 = transformedMHBPs[0][1];
        const FPA2 = transformedOHBPs ? transformedOHBPs[0][1] : null;
        const FPA = FPA2 ? (FPA1 + FPA2) / 2 : FPA1;
        const attacksPerSecond = 25 / FPA;
        const DPS = ((mhAvg + ohAvg) / avgDivisor) * attacksPerSecond;

        result.attackDamage.aps = attacksPerSecond;
        result.attackDamage.fpa = FPA;
        result.attackDamage.dps = DPS;

        return result;
    };

    return { calculate };
}
