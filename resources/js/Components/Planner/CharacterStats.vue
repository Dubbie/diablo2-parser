<script setup>
import { computed, provide } from "vue";
import ResistanceStats from "@/Components/Planner/StatGroups/ResistanceStats.vue";
import DefenseStats from "@/Components/Planner/StatGroups/DefenseStats.vue";

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
    curseResist: ["curse_effectiveness"],
    armorclass: ["armorclass"],
};

// Generic function to calculate stats
function calculateStat(statName) {
    let total = 0;
    let history = []; // Track history of modifiers

    const modifiers = statModifiers[statName]; // Get modifiers for the stat

    // Add custom history
    if (isResistStat(statName)) {
        history.push({
            source: "Quests",
            value: 30,
        });
        history.push({
            source: "Difficulty",
            value: -100,
        });

        total = 30 - 100;
    }

    // Add defense from items
    props.items.forEach((item) => {
        console.log(item.modifiers);

        if (item.calculated_stats.defense && statName === "armorclass") {
            const value = item.calculated_stats.defense.value;
            total += value;

            // Save item to history
            history.push({
                source: item.name ?? item.base_name,
                value,
            });
        } else {
            item.modifiers.forEach((modifier) => {
                if (modifiers.includes(modifier.name)) {
                    const value = parseInt(modifier.values.value); // Get the value of the modifier
                    total += value;

                    // Save item to history
                    history.push({
                        source: item.name ?? item.base_name,
                        value: value,
                    });
                }
            });
        }
    });

    return { total, history };
}

const isResistStat = (stat) => {
    return ["fireResist", "coldResist", "lightResist", "poisonResist"].includes(
        stat
    );
};

// Computed properties for each stat
const fireResist = computed(() => calculateStat("fireResist"));
const coldResist = computed(() => calculateStat("coldResist"));
const lightResist = computed(() => calculateStat("lightResist"));
const poisonResist = computed(() => calculateStat("poisonResist"));
const curseResist = computed(() => calculateStat("curseResist"));
const armorClass = computed(() => calculateStat("armorclass"));

// Stats object
const stats = {
    resistances: {
        fireResist,
        coldResist,
        lightResist,
        poisonResist,
        curseResist,
    },
    defenses: {
        armorClass,
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
    <div class="text-sm min-w-[160px] space-y-3">
        <ResistanceStats />
        <DefenseStats />
    </div>
</template>
