<script setup>
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { computed } from "vue";

const statCalculationStore = useStatCalculationStore();
const characterStore = useCharacterStore();
const calculatedStats = computed(() => statCalculationStore);

// Compute whether the character meets the strength and dexterity requirements
const strengthBelowRequired = computed(() => {
    return Object.values(characterStore.character.equippedItems).some(
        (item) =>
            item?.calculated_stats?.required_str?.value >
            statCalculationStore.attributes.strength
    );
});

const dexterityBelowRequired = computed(() => {
    return Object.values(characterStore.character.equippedItems).some(
        (item) =>
            item?.calculated_stats?.required_dex?.value >
            statCalculationStore.attributes.dexterity
    );
});
</script>

<template>
    <p class="font-bold mb-1">Attributes</p>
    <p class="flex justify-between">
        <span>Strength</span>
        <span :class="{ 'text-red-500': strengthBelowRequired }">{{
            calculatedStats.attributes.strength
        }}</span>
    </p>
    <p class="flex justify-between">
        <span>Dexterity</span>
        <span :class="{ 'text-red-500': dexterityBelowRequired }">{{
            calculatedStats.attributes.dexterity
        }}</span>
    </p>
    <p class="flex justify-between">
        <span>Vitality</span>
        <span>{{ calculatedStats.attributes.vitality }}</span>
    </p>
    <p class="flex justify-between">
        <span>Energy</span>
        <span>{{ calculatedStats.attributes.energy }}</span>
    </p>

    <p class="font-bold mt-3 mb-1">Resistances</p>
    <p class="flex justify-between">
        <span class="text-red-300">Fire</span>
        <span
            :class="{
                'text-red-400': calculatedStats.cappedResistances.fire < 0,
            }"
            >{{ calculatedStats.cappedResistances.fire }}%</span
        >
    </p>
    <p class="flex justify-between">
        <span class="text-blue-300">Cold</span>
        <span
            :class="{
                'text-red-400': calculatedStats.cappedResistances.cold < 0,
            }"
            >{{ calculatedStats.cappedResistances.cold }}%</span
        >
    </p>
    <p class="flex justify-between">
        <span class="text-yellow-300">Lightning</span>
        <span
            :class="{
                'text-red-400': calculatedStats.cappedResistances.lightning < 0,
            }"
            >{{ calculatedStats.cappedResistances.lightning }}%</span
        >
    </p>
    <p class="flex justify-between">
        <span class="text-green-300">Poison</span>
        <span
            :class="{
                'text-red-400': calculatedStats.cappedResistances.poison < 0,
            }"
            >{{ calculatedStats.cappedResistances.poison }}%</span
        >
    </p>
    <p class="flex justify-between">
        <span class="text-purple-300">Curse</span>
        <span
            :class="{
                'text-red-400': calculatedStats.cappedResistances.curse < 0,
            }"
            >{{ calculatedStats.cappedResistances.curse }}%</span
        >
    </p>

    <p class="font-bold mt-3 mb-1">Defense</p>
    <p class="flex justify-between">
        <span>Defense</span>
        <span>{{ calculatedStats.defense }}</span>
    </p>

    <p class="font-bold mt-3 mb-1">Weapon</p>
    <p class="flex justify-between">
        <span>Attack Damage</span>
        <p>
            <span>{{ calculatedStats.weapon.attackDamage.min }}</span>
            <span>-</span>
            <span>{{ calculatedStats.weapon.attackDamage.max }}</span>
        </p>
    </p>
</template>
