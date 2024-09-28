<script setup>
import { computed, inject } from "vue";
import StatDisplay from "@/Components/StatDisplay.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

// Get the data from the character
const character = inject("character", null);

// Create a computed property for calculated stats
const calculatedStats = computed(() => props.item.calculated_stats || {});

// Helper function to safely access stats
const getStat = (key) => calculatedStats.value[key];
</script>

<template>
    <div v-if="character">
        <div class="flex flex-col items-center">
            <StatDisplay label="Defense" :stat="getStat('defense')" />
            <StatDisplay
                label="One-Hand Damage"
                :stat="getStat('damage')?.one_handed"
            />
            <StatDisplay
                label="Two-Hand Damage"
                :stat="getStat('damage')?.two_handed"
            />
            <StatDisplay
                label="Missile Damage"
                :stat="getStat('damage')?.missile"
            />
            <StatDisplay
                label="Required Dexterity"
                :stat="getStat('required_dex')"
                :compare="
                    parseInt(character.characterClass.modified_attributes.dex)
                "
            />
            <StatDisplay
                label="Required Strength"
                :stat="getStat('required_str')"
                :compare="
                    parseInt(character.characterClass.modified_attributes.str)
                "
            />
            <StatDisplay
                label="Required Level"
                :stat="getStat('required_level')"
                :compare="parseInt(character.level)"
            />
        </div>
    </div>
</template>
