// skills/attack.js
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import {
    calculateWeaponDamage,
    getAnimData,
    d,
    convertEIAStoVariable,
} from "@/utils/skillUtils";

const ANIMATION_MODE = "TH";

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

export function useThrow() {
    const calculate = (skill, attributes, character) => {
        const { equippedItems } = character;
        let mhWeapon = equippedItems?.larm;

        if (mhWeapon && !isItemUsable(mhWeapon)) {
            mhWeapon = null;
        }

        const mainHand = calculateWeaponDamage(
            attributes,
            mhWeapon,
            equippedItems,
            true
        );

        const result = {
            throwingDamage: {
                ...mainHand,
            },
        };

        // Get Main Hand Animation Data
        const mhAnimData = getAnimData(
            character.classData.name,
            mhWeapon,
            ANIMATION_MODE
        );

        // If no anim data, it's not usable
        if (typeof mhAnimData == "undefined") {
            result.throwingDamage = null;

            return result;
        }

        const mhBreakpoints = d(mhWeapon, null, mhAnimData, true)[0];
        const transformedMHBPs = transformBreakpoints(mhBreakpoints);

        // Calculate DPS!!!!!!!!! BAM
        const mhAvg = (mainHand.min + mainHand.max) / 2;
        const FPA1 = transformedMHBPs[0][1];
        const attacksPerSecond = 25 / FPA1;
        const DPS = mhAvg * attacksPerSecond;

        result.throwingDamage.aps = attacksPerSecond;
        result.throwingDamage.fpa = FPA1;
        result.throwingDamage.dps = DPS;

        return result;
    };

    return { calculate };
}
