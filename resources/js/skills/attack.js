// skills/attack.js
import {
    calculateWeaponDamage,
    getAnimData,
    d,
    transformBreakpoints,
    handleWeaponUsage,
    calculateDPS,
} from "@/utils/skillUtils";

const ANIMATION_MODE = ["A1", "A2"];

export function useAttack() {
    const calculate = (skill, attributes, character) => {
        const { equippedItems } = character;
        const { mhWeapon, ohWeapon } = handleWeaponUsage(equippedItems);

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
                offHand,
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

        // Calculate DPS
        const mhAvg = (mainHand.min + mainHand.max) / 2;
        const ohAvg = offHand ? (offHand.min + offHand.max) / 2 : 0;
        const { aps, fpa, dps } = calculateDPS(
            mhAvg,
            ohAvg,
            transformedMHBPs,
            transformedOHBPs
        );

        result.attackDamage.aps = aps;
        result.attackDamage.fpa = fpa;
        result.attackDamage.dps = dps;

        return result;
    };

    return { calculate };
}
