<script setup>
import { computed, inject, watch } from "vue";
import TextInput from "@/Components/TextInput.vue";

const character = inject("character");

const labelMap = {
    str: "Strength",
    dex: "Dexterity",
    vit: "Vitality",
    int: "Energy",
};

// Initialize modified attributes if not already set
if (!character.characterClass.modified_attributes) {
    character.characterClass.modified_attributes = {
        str: character.characterClass.base_attributes.str,
        dex: character.characterClass.base_attributes.dex,
        vit: character.characterClass.base_attributes.vit,
        int: character.characterClass.base_attributes.int,
    };
}

// Maximum points based on level and points per level
const maxPoints = computed(() => {
    const level = character.level;
    const perLevel = character.characterClass.stat_per_level;
    const fromQuests = 15;

    return (level - 1) * perLevel + fromQuests;
});

// Calculate unallocated points
const unallocatedPoints = computed(() => {
    return (
        maxPoints.value -
        Object.values(character.characterClass.modified_attributes).reduce(
            (a, b) => a + b,
            0
        )
    );
});
</script>

<template>
    <div>
        <p class="font-bold mb-3">Attributes</p>

        <div
            v-for="(attribute, key) in character.characterClass
                .modified_attributes"
            :key="key"
            class="flex justify-between"
        >
            <p>{{ labelMap[key] }}</p>
            <TextInput
                v-model="character.characterClass.modified_attributes[key]"
                type="number"
                class="text-sm w-16"
                :min="character.characterClass.base_attributes[key]"
                :max="
                    character.characterClass.modified_attributes[key] +
                    unallocatedPoints
                "
            />
        </div>

        <div class="text-sm font-semibold mt-3 text-right">
            <p class="text-zinc-400">Unassigned points</p>
            <p class="font-bold">{{ unallocatedPoints }} / {{ maxPoints }}</p>
        </div>
    </div>
</template>
