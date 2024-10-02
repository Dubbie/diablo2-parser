import { defineStore } from "pinia";
import { calculateFinalAttributes } from "@/Stores/StatCalculation/Attributes";
import { calculateFinalResistances } from "@/Stores/StatCalculation/Resistances";
import { calculateFinalDefense } from "@/Stores/StatCalculation/Defense";
import { calculateFinalWeapon } from "@/Stores/StatCalculation/Weapon";

const BASE_RES_MAX = 75;

export const useStatCalculationStore = defineStore("statCalculation", {
    state: () => ({
        weapon: {
            range: 0,
            attackRating: 0,
            attackDamage: {
                physical: { min: 1, max: 2 },
                elemental: {
                    fire: { min: 0, max: 0 },
                    lightning: { min: 0, max: 0 },
                    cold: { min: 0, max: 0 },
                    poison: { min: 0, max: 0 },
                    magic: { min: 0, max: 0 },
                },
            },
            attackSpeed: 0,
        },
        attributes: {
            strength: 0,
            dexterity: 0,
            vitality: 0,
            energy: 0,
        },
        resistances: {
            fire: {
                total: 0,
                max: BASE_RES_MAX,
            },
            cold: {
                total: 0,
                max: BASE_RES_MAX,
            },
            lightning: {
                total: 0,
                max: BASE_RES_MAX,
            },
            poison: {
                total: 0,
                max: BASE_RES_MAX,
            },
            curse: {
                total: 0,
                max: BASE_RES_MAX,
            },
        },
        defense: 0,
    }),

    getters: {
        // Getter for capped resistances
        fireResistance(state) {
            return Math.min(
                state.resistances.fire.total,
                state.resistances.fire.max
            );
        },
        coldResistance(state) {
            return Math.min(
                state.resistances.cold.total,
                state.resistances.cold.max
            );
        },
        lightningResistance(state) {
            return Math.min(
                state.resistances.lightning.total,
                state.resistances.lightning.max
            );
        },
        poisonResistance(state) {
            return Math.min(
                state.resistances.poison.total,
                state.resistances.poison.max
            );
        },
        cappedResistances(state) {
            return {
                fire: this.fireResistance,
                cold: this.coldResistance,
                lightning: this.lightningResistance,
                poison: this.poisonResistance,
                curse: state.resistances.curse.total,
            };
        },
        totalMinDamage(state) {
            // Add up the physical.min with the elementals mins
            return (
                state.weapon.attackDamage.physical.min +
                state.weapon.attackDamage.elemental.fire.min +
                state.weapon.attackDamage.elemental.lightning.min +
                state.weapon.attackDamage.elemental.cold.min +
                state.weapon.attackDamage.elemental.poison.min +
                state.weapon.attackDamage.elemental.magic.min
            );
        },
        totalMaxDamage(state) {
            // Add up the physical.max with the elementals maxes
            return (
                state.weapon.attackDamage.physical.max +
                state.weapon.attackDamage.elemental.fire.max +
                state.weapon.attackDamage.elemental.lightning.max +
                state.weapon.attackDamage.elemental.cold.max +
                state.weapon.attackDamage.elemental.poison.max +
                state.weapon.attackDamage.elemental.magic.max
            );
        },
    },

    actions: {
        calculateStats() {
            // Call calculation functions from the respective modules
            calculateFinalAttributes();
            calculateFinalResistances();
            calculateFinalDefense();
            calculateFinalWeapon();
        },
    },
});
