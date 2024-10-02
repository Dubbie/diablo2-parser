<script setup>
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { computed } from "vue";

import StatDisplay from "./StatDisplay.vue";
import DamageStatDisplay from "./DamageStatDisplay.vue";

const statCalculationStore = useStatCalculationStore();
const characterStore = useCharacterStore();
const calculatedStats = computed(() => statCalculationStore);

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

const resistances = [
    { label: "Fire", key: "fire", class: "text-red-300" },
    { label: "Cold", key: "cold", class: "text-blue-300" },
    { label: "Lightning", key: "lightning", class: "text-yellow-300" },
    { label: "Poison", key: "poison", class: "text-green-300" },
    { label: "Curse", key: "curse", class: "text-purple-300" },
];

const weaponElementalDamage = [
    { label: "Fire", key: "fire", class: "text-red-300" },
    { label: "Cold", key: "cold", class: "text-blue-300" },
    { label: "Lightning", key: "lightning", class: "text-yellow-300" },
    { label: "Poison", key: "poison", class: "text-green-300" },
    { label: "Magic", key: "magic", class: "text-blue-400" },
];
</script>

<template>
    <p class="font-bold mb-1">Attributes</p>
    <StatDisplay
        label="Strength"
        :value="calculatedStats.attributes.strength"
        :valueClass="{ 'text-red-500': strengthBelowRequired }"
    />
    <StatDisplay
        label="Dexterity"
        :value="calculatedStats.attributes.dexterity"
        :valueClass="{ 'text-red-500': dexterityBelowRequired }"
    />
    <StatDisplay
        label="Vitality"
        :value="calculatedStats.attributes.vitality"
    />
    <StatDisplay label="Energy" :value="calculatedStats.attributes.energy" />

    <p class="font-bold mt-3 mb-1">Resistances</p>
    <StatDisplay
        v-for="resistance in resistances"
        :key="resistance.key"
        :label="resistance.label"
        :labelClass="resistance.class"
        :value="calculatedStats.cappedResistances[resistance.key] + '%'"
        :valueClass="{
            'text-red-400':
                calculatedStats.cappedResistances[resistance.key] < 0,
        }"
    />

    <p class="font-bold mt-3 mb-1">Defense</p>
    <StatDisplay label="Defense" :value="calculatedStats.defense" />

    <p class="font-bold mt-3 mb-1">Weapon</p>
    <StatDisplay
        label="Attack Damage"
        :value="
            calculatedStats.totalMinDamage +
            ' - ' +
            calculatedStats.totalMaxDamage
        "
    />
    <StatDisplay
        label="Attack Rating"
        :value="calculatedStats.weapon.attackRating"
    />

    <DamageStatDisplay
        v-for="damage in weaponElementalDamage"
        :key="damage.key"
        :label="damage.label"
        :min="calculatedStats.weapon.attackDamage.elemental[damage.key].min"
        :max="calculatedStats.weapon.attackDamage.elemental[damage.key].max"
        :labelClass="damage.class"
    />
</template>
