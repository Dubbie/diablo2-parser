<script setup>
import { computed, inject, provide } from "vue";
import ResistanceStats from "@/Components/Planner/StatGroups/ResistanceStats.vue";
import DefenseStats from "@/Components/Planner/StatGroups/DefenseStats.vue";
import AttributeStats from "./StatGroups/AttributeStats.vue";

// Props for items
const props = defineProps({
    items: Array,
});

const character = inject("character");

// Define stat-to-modifiers mappings
const statModifiers = {
    fireResist: ["fireresist", "all_resist"],
    coldResist: ["coldresist", "all_resist"],
    lightResist: ["lightresist", "all_resist"],
    poisonResist: ["poisonresist", "all_resist"],
    curseResist: ["curse_effectiveness"],
    armorclass: ["armorclass"],
    str: ["strength"],
    dex: ["dexterity"],
    vit: ["vitality"],
    int: ["energy"],
};

// Generic function to calculate stats
function calculateStat(statName) {
    let total = 0;
    let required = 0;
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

    if (isAttributeStat(statName)) {
        const value = character.characterClass.modified_attributes[statName];

        // Make total the modified attr base
        total = value;

        // Save stat to history
        history.push({
            source: "Character",
            value: value,
        });
    }

    // Add defense from items
    props.items.forEach((item) => {
        // Check requirement
        const requiredStat = getRequirementByStat(statName, item);
        if (requiredStat) {
            if (requiredStat > required) {
                required = requiredStat;
            }
        }

        // Check if character can use item
        if (!isItemUsable(item)) return;

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

    return { total, required, history };
}

const isItemUsable = (item) => {
    // Check requirements
    if (!item.calculated_stats) return false;

    if (
        item.calculated_stats?.required_level.value > parseInt(character.level)
    ) {
        return false;
    }

    if (
        item.calculated_stats?.required_dex?.value &&
        item.calculated_stats.required_dex.value >
            character.characterClass.modified_attributes.dex
    ) {
        return false;
    }

    if (
        item.calculated_stats?.required_str?.value &&
        item.calculated_stats.required_str.value >
            character.characterClass.modified_attributes.str
    ) {
        return false;
    }

    return true;
};

const isResistStat = (stat) => {
    return ["fireResist", "coldResist", "lightResist", "poisonResist"].includes(
        stat
    );
};

const isAttributeStat = (stat) => {
    return ["str", "dex", "vit", "int"].includes(stat);
};

const getRequirementByStat = (stat, item) => {
    if (isAttributeStat(stat)) {
        return item.calculated_stats["required_" + stat]?.value ?? null;
    }

    return null;
};

// Computed properties for each stat
const fireResist = computed(() => calculateStat("fireResist"));
const coldResist = computed(() => calculateStat("coldResist"));
const lightResist = computed(() => calculateStat("lightResist"));
const poisonResist = computed(() => calculateStat("poisonResist"));
const curseResist = computed(() => calculateStat("curseResist"));
const armorClass = computed(() => calculateStat("armorclass"));
const str = computed(() => calculateStat("str"));
const dex = computed(() => calculateStat("dex"));
const vit = computed(() => calculateStat("vit"));
const int = computed(() => calculateStat("int"));

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
    attributes: {
        str,
        dex,
        vit,
        int,
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
        <AttributeStats />
        <ResistanceStats />
        <DefenseStats />
    </div>
</template>
