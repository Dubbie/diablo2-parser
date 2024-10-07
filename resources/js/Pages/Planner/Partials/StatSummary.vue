<script setup>
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { computed } from "vue";

import StatDisplay from "./StatDisplay.vue";
import DamageStatDisplay from "./DamageStatDisplay.vue";
import { useSkillStore } from "@/Stores/SkillStore";

const statCalculationStore = useStatCalculationStore();
const characterStore = useCharacterStore();
const skillStore = useSkillStore();
const calculatedStats = computed(() => statCalculationStore);
const selectedSkillDetails = computed(() => skillStore.selectedSkillDetails);

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
    { label: "Fire Resistance", key: "fire", class: "text-red-400" },
    { label: "Cold Resistance", key: "cold", class: "text-blue-400" },
    { label: "Lightning Resistance", key: "lightning", class: "text-yellow-400" },
    { label: "Poison Resistance", key: "poison", class: "text-green-400" },
    { label: "Curse Resistance", key: "curse", class: "text-purple-400" },
];

const weaponElementalDamage = [
    { label: "Fire", key: "fire", class: "text-red-300" },
    { label: "Cold", key: "cold", class: "text-blue-300" },
    { label: "Lightning", key: "lightning", class: "text-yellow-300" },
    { label: "Poison", key: "poison", class: "text-green-300" },
    { label: "Magic", key: "magic", class: "text-blue-400" },
];

const statGroupTitleClass = "font-semibold text-zinc-500 mb-1";
</script>

<template>
    <div class="space-y-4">
        <div>
            <code><pre>{{ selectedSkillDetails }}</pre></code>
        </div>

        <div>
            <!-- <p :class="statGroupTitleClass">Attributes</p> -->
            <StatDisplay
                label="Strength"
                :value="calculatedStats.attributes.strength"
                :value-class="{ 'text-red-500': strengthBelowRequired }"
            />
            <StatDisplay
                label="Dexterity"
                :value="calculatedStats.attributes.dexterity"
                :value-class="{ 'text-red-500': dexterityBelowRequired }"
            />
            <StatDisplay
                label="Vitality"
                :value="calculatedStats.attributes.vitality"
            />
            <StatDisplay
                label="Energy"
                :value="calculatedStats.attributes.energy"
            />
        </div>

        <div>
            <!-- <p :class="statGroupTitleClass">Defense</p> -->
            <StatDisplay label="Defense" :value="calculatedStats.defense" />
            <StatDisplay
                label="Block Chance"
                :value="calculatedStats.block + '%'"
            />
        </div>

        <div>
            <!-- <p :class="statGroupTitleClass">Resistances</p> -->
            <StatDisplay
                v-for="resistance in resistances"
                :key="resistance.key"
                :label="resistance.label"
                :label-class="resistance.class"
                :value="calculatedStats.cappedResistances[resistance.key] + '%'"
                :value-class="{
                    'text-red-400':
                        calculatedStats.cappedResistances[resistance.key] < 0,
                }"
            />
        </div>

        <div>
            <!-- <p :class="statGroupTitleClass">Weapon</p> -->
            <StatDisplay
                label="Attack Damage"
                :value="
                    calculatedStats.totalMinDamage +
                    ' - ' +
                    calculatedStats.totalMaxDamage
                "
            />

            <hr class="my-2 border-white/10"></hr>

            <DamageStatDisplay
                label="Physical"
                :min="calculatedStats.weapon.attackDamage.physical.min"
                :max="calculatedStats.weapon.attackDamage.physical.max"
                label-class="text-zinc-300"
            />
            <DamageStatDisplay
                v-for="damage in weaponElementalDamage"
                :key="damage.key"
                :label="damage.label"
                :min="
                    calculatedStats.weapon.attackDamage.elemental[damage.key]
                        .min
                "
                :max="
                    calculatedStats.weapon.attackDamage.elemental[damage.key]
                        .max
                "
                :label-class="damage.class"
            />
            <hr class="my-2 border-white/10"></hr>

            <StatDisplay
                label="Attack Rating"
                :value="calculatedStats.weapon.attackRating"
            />
        </div>
    </div>
</template>
