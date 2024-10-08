// skills/throw.js
import {
    calculateWeaponDamage,
    getAnimData,
    d,
    transformBreakpoints,
    handleWeaponUsage,
    calculateDPS,
} from "@/utils/skillUtils";

const ANIMATION_MODE = "TH";

export function useThrow() {
    const calculate = (skill, attributes, character) => {
        const { equippedItems } = character;
        const { mhWeapon } = handleWeaponUsage(equippedItems);

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

        // Calculate DPS
        const mhAvg = (mainHand.min + mainHand.max) / 2;
        const { aps, fpa, dps } = calculateDPS(mhAvg, 0, transformedMHBPs);

        result.throwingDamage.aps = aps;
        result.throwingDamage.fpa = fpa;
        result.throwingDamage.dps = dps;

        return result;
    };

    return { calculate };
}
