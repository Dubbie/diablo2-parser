<script setup>
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { computed } from "vue";

const statCalculationStore = useStatCalculationStore();
const calculatedStats = computed(() => statCalculationStore);
</script>

<template>
    <p class="font-bold mb-1">Attributes</p>
    <p class="flex justify-between">
        <span>Strength</span>
        <span>{{ calculatedStats.attributes.strength }}</span>
    </p>
    <p class="flex justify-between">
        <span>Dexterity</span>
        <span>{{ calculatedStats.attributes.dexterity }}</span>
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
        <span>Fire</span>
        <span>{{ calculatedStats.cappedResistances.fire }}%</span>
    </p>
    <p class="flex justify-between">
        <span>Cold</span>
        <span>{{ calculatedStats.cappedResistances.cold }}%</span>
    </p>
    <p class="flex justify-between">
        <span>Lightning</span>
        <span>{{ calculatedStats.cappedResistances.lightning }}%</span>
    </p>
    <p class="flex justify-between">
        <span>Poison</span>
        <span>{{ calculatedStats.cappedResistances.poison }}%</span>
    </p>
    <p class="flex justify-between">
        <span>Curse</span>
        <span>{{ calculatedStats.cappedResistances.curse }}%</span>
    </p>

    <p class="font-bold mt-3 mb-1">Defense</p>
    <p class="flex justify-between">
        <span>Defense</span>
        <span>{{ calculatedStats.defense }}</span>
    </p>
</template>
