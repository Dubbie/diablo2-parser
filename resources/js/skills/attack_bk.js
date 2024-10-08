// skills/attack.js
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import { calculateWeaponDamage } from "@/utils/skillUtils";
import { ATTACK_FRAMES } from "@/constants";

const ANIM_SPEED = 256;

const getAttackFrameData = (weapon, characterClass) => {
    const weaponType = weapon?.type || "Unarmed";
    if (weaponType === "Unarmed" || !isItemUsable(weapon)) {
        return ATTACK_FRAMES.unarmed[characterClass];
    }

    if (weapon?.two_handed) {
        console.warn(
            "Two handed weapons not supported yet. Defaulting to 18 frames."
        );
        return 18;
    }

    console.log("BASE ATTACK FRAME: ", ATTACK_FRAMES.onehanded[characterClass]);

    return ATTACK_FRAMES.onehanded[characterClass] || 18;
};

const getWeaponSpeed = (weapon) =>
    weapon && isItemUsable(weapon) ? weapon.base_stats?.speed || 0 : 0;

const calculateWSM = (mhSpeed, ohSpeed) =>
    ohSpeed > 0 ? (mhSpeed + ohSpeed) / 2 : mhSpeed;

const calculateVInc = (mod, speed, SIAS = 0, EIAS = 0) =>
    Math.max(15, Math.min(175, mod + SIAS + EIAS - speed));

const calculateFPAValue = (baseFrame, vInc) =>
    Math.ceil(
        (ANIM_SPEED * baseFrame) / Math.floor((ANIM_SPEED * vInc) / 100)
    ) - 1;

const calculateFPA = (characterClass, mhWeapon, ohWeapon) => {
    const MH_SPEED = getWeaponSpeed(mhWeapon);
    const OH_SPEED = getWeaponSpeed(ohWeapon);

    const SIAS = 0; // Update with actual logic if needed
    const EIAS = 0; // Update with actual logic if needed

    const MH_WSM = calculateWSM(MH_SPEED, OH_SPEED);
    const OH_WSM = (MH_SPEED + OH_SPEED) / 2 - MH_SPEED + OH_SPEED;

    const V_INC_1 = calculateVInc(100, MH_WSM, SIAS, EIAS);
    const V_INC_2 = calculateVInc(140, OH_WSM, SIAS, EIAS);

    const BASE_FRAME_MH = getAttackFrameData(mhWeapon, characterClass);
    const BASE_FRAME_OH = getAttackFrameData(ohWeapon, characterClass);

    const FPA_1 = calculateFPAValue(BASE_FRAME_MH, V_INC_1);

    if (!mhWeapon || !isItemUsable(mhWeapon)) {
        return FPA_1; // Unarmed attack
    }

    const FPA_2 =
        ohWeapon && isItemUsable(ohWeapon)
            ? calculateFPAValue(BASE_FRAME_OH, V_INC_2)
            : null;
    const FPA_AVG = FPA_2 ? (FPA_1 + FPA_2) / 2 : FPA_1;

    return FPA_AVG;
};

export function useAttackBackup() {
    const calculate = (skill, attributes, character) => {
        const { equippedItems } = character;
        const mhWeapon = equippedItems?.larm;
        const ohWeapon = equippedItems?.rarm;

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

        const FPA = calculateFPA(character.classData.name, mhWeapon, ohWeapon);
        const mhAvg = (mainHand.min + mainHand.max) / 2;
        const ohAvg =
            offHand && isItemUsable(ohWeapon)
                ? (offHand.min + offHand.max) / 2
                : 0;
        const avgDivisor = ohAvg > 0 ? 2 : 1;

        result.attackDamage.fpa = FPA;
        result.attackDamage.attackSpeed = 25 / FPA;
        result.attackDamage.dps =
            ((mhAvg + ohAvg) / avgDivisor) * result.attackDamage.attackSpeed;

        return result;
    };

    return { calculate };
}
