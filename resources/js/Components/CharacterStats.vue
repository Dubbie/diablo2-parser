<script setup>
import { computed, provide } from "vue";
import ResistanceStats from "./StatGroups/ResistanceStats.vue";
import DefenseStats from "./StatGroups/DefenseStats.vue";

// Props for items
const props = defineProps({
    items: Array,
});

// Define stat-to-modifiers mappings
const statModifiers = {
    fireResist: ["fireresist", "all_resist"],
    coldResist: ["coldresist", "all_resist"],
    lightResist: ["lightresist", "all_resist"],
    poisonResist: ["poisonresist", "all_resist"],
    armorclass: ["armorclass"],
};

// Generic function to calculate stats
function calculateStat(statName) {
    let total = 0;
    const modifiers = statModifiers[statName]; // Get modifiers for the stat

    props.items.forEach((item) => {
        item.modifiers.forEach((modifier) => {
            if (modifiers.includes(modifier.name)) {
                total += modifier.values[0]; // Add the first value of the modifier
            }
        });
    });

    return total;
}

// Computed properties for each stat
const fireResist = computed(() => calculateStat("fireResist"));
const coldResist = computed(() => calculateStat("coldResist"));
const lightResist = computed(() => calculateStat("lightResist"));
const poisonResist = computed(() => calculateStat("poisonResist"));
const armorClass = computed(() => calculateStat("armorclass"));

// Stats object
const stats = {
    resistances: {
        fireResist: fireResist,
        coldResist: coldResist,
        lightResist: lightResist,
        poisonResist: poisonResist,
    },
    defenses: {
        armorClass: armorClass,
    },
};

// Classes
const rowClasses = "flex justify-between space-x-4";
const labelClasses = "text-zinc-300";
const valueClasses = "font-semibold";

provide("stats", stats);
provide("rowClasses", rowClasses);
provide("labelClasses", labelClasses);
provide("valueClasses", valueClasses);
</script>

<template>
    <div class="text-xs min-w-[160px] space-y-3">
        <ResistanceStats />
        <DefenseStats />
    </div>
</template>
