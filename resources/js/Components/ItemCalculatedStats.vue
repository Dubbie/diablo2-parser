<script setup>
import { computed } from "vue";
import StatDisplay from "@/Components/StatDisplay.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

// Create a computed property for calculated stats
const calculatedStats = computed(() => props.item.calculated_stats || {});

console.log(calculatedStats.value);

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
                label="Missile Damage"
                :stat="getStat('damage')?.missile"
            />
            <StatDisplay
                label="Required Dexterity"
                :stat="getStat('required_dex')"
            />
            <StatDisplay
                label="Required Strength"
                :stat="getStat('required_str')"
            />
            <StatDisplay label="Required Level" :stat="getStat('level')" />
        </div>
    </div>
</template>
