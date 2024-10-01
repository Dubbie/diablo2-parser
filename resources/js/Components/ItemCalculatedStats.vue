<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import StatDisplay from "@/Components/StatDisplay.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const characterStore = useCharacterStore();
const statCalculationStore = useStatCalculationStore();

const level = computed(() => characterStore.character.level);
const attributes = computed(() => statCalculationStore.attributes);

// Create a computed property for calculated stats
const calculatedStats = computed(() => props.item.calculated_stats || {});

// Helper function to safely access stats
const getStat = (key) => calculatedStats.value[key];
</script>

<template>
    <div>
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
                label="Throwing Damage"
                :stat="getStat('damage')?.missile"
            />
            <StatDisplay
                label="Required Dexterity"
                :stat="getStat('required_dex')"
                :compare="attributes.strength"
            />
            <StatDisplay
                label="Required Strength"
                :stat="getStat('required_str')"
                :compare="attributes.strength"
            />
            <StatDisplay
                label="Required Level"
                :stat="getStat('required_level')"
                :compare="level"
            />
        </div>
    </div>
</template>
