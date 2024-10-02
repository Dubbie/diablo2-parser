import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { applyModifiers, isItemUsable } from "@/Stores/StatCalculation/Utils";

export const calculateFinalWeapon = () => {
    const statStore = useStatCalculationStore(); // Access stat calculation store
    const characterStore = useCharacterStore(); // Access character store

    // Reset weapon to zero before calculating
    statStore.weapon = {
        range: 0,
        attackRating: 0,
        attackDamage: {
            min: 0,
            max: 0,
        },
        attackSpeed: 0,
    };

    updateWeapon(characterStore, statStore);
};

export const updateWeapon = function (characterStore, statStore) {
    let baseMin = 1;
    let baseMax = 2;
    let multiplier = 1;

    if (statStore.attributes.strength > 0) {
        const strMulti = statStore.attributes.strength / 100;
        multiplier += strMulti;
    }

    // Start calculating!
    const mainHandWeapon = characterStore.character.equippedItems.larm;

    if (mainHandWeapon && isItemUsable(mainHandWeapon)) {
        if (mainHandWeapon.two_handed) {
            baseMin =
                mainHandWeapon.calculated_stats?.damage?.two_handed?.value
                    ?.min || 0;
            baseMax =
                mainHandWeapon.calculated_stats?.damage?.two_handed?.value
                    ?.max || 0;
        } else {
            baseMin =
                mainHandWeapon.calculated_stats?.damage?.one_handed?.value
                    ?.min || 0;
            baseMax =
                mainHandWeapon.calculated_stats?.damage?.one_handed?.value
                    ?.max || 0;
        }
    }

    statStore.weapon.attackDamage.min = Math.floor(baseMin * multiplier);
    statStore.weapon.attackDamage.max = Math.floor(baseMax * multiplier);
};
