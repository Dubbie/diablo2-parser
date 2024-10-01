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
    fireResist: ["fireresist", "all_resist", "maxfireresist"],
    coldResist: ["coldresist", "all_resist"],
    lightResist: ["lightresist", "all_resist"],
    poisonResist: ["poisonresist", "all_resist"],
    curseResist: ["curse_effectiveness"],
    armorclass: ["armorclass"],
    str: ["strength", "all_attributes", "item_strength_perlevel"],
    dex: ["dexterity", "all_attributes", "item_dexterity_perlevel"],
    vit: ["vitality", "all_attributes", "item_vitality_perlevel"],
    int: ["energy", "all_attributes", "item_energy_perlevel"],
};

// Define strategies for calculating stats
const statStrategies = {
    fireResist: calculateResistStat,
    coldResist: calculateResistStat,
    lightResist: calculateResistStat,
    poisonResist: calculateResistStat,
    curseResist: calculateResistStat,
    armorclass: calculateGenericStat,
    str: calculateAttributeStat,
    dex: calculateAttributeStat,
    vit: calculateAttributeStat,
    int: calculateAttributeStat,
    default: calculateGenericStat,
};

function calculateResistStat(statName) {
    const baseValue = 30 - 100; // Quests and Difficulty
    const baseHistory = [
        { source: "Quests", value: 30 },
        { source: "Difficulty", value: -100 },
    ];

    return calculateBaseStat(statName, baseValue, baseHistory);
}

function calculateAttributeStat(statName) {
    let total = character.characterClass.modified_attributes[statName]; // Base character attribute
    let required = 0;
    let history = [{ source: "Character", value: total }];

    // Apply item modifiers using the helper function
    const result = applyItemModifiers(statName, total, history);
    total = result.total;
    history = result.history;

    // Check for any required attributes from items
    props.items.forEach((item) => {
        if (!isItemUsable(item)) return;

        const requiredStat = getRequirementByStat(statName, item);
        if (requiredStat > required) {
            required = requiredStat;
        }
    });

    return { total, required, history };
}

function calculateGenericStat(statName) {
    return calculateBaseStat(statName);
}

function applyItemModifiers(statName, total, history, cap = 75) {
    props.items.forEach((item) => {
        if (!isItemUsable(item)) return;

        // Early return for armorclass (defense)
        if (statName === "armorclass" && item.calculated_stats.defense) {
            const value = item.calculated_stats.defense.value;
            total += value;
            history.push({
                source: item.name ?? item.base_name,
                value: value,
            });
            return;
        }

        // Apply other modifiers
        item.modifiers.forEach((modifier) => {
            if (statModifiers[statName]?.includes(modifier.name)) {
                let value = getModifierValue(modifier);

                if (
                    modifier.name.includes("max") &&
                    modifier.name.includes("resist")
                ) {
                    cap += value;
                    history.push({
                        source: (item.name ?? item.base_name) + " (max)",
                        value: value,
                    });
                } else {
                    total += value;
                    history.push({
                        source: item.name ?? item.base_name,
                        value: value,
                    });
                }
            }
        });
    });

    return { total, cap, history };
}

function calculateBaseStat(
    statName,
    baseValue = 0,
    baseHistory = [],
    defaultCap = 75
) {
    let total = baseValue;
    let cap = defaultCap;
    let required = 0;
    let history = [...baseHistory];

    // Apply modifiers from items
    const result = applyItemModifiers(statName, total, history, cap);
    total = result.total;
    cap = result.cap;
    history = result.history;

    return { total, required, history, cap };
}

function getModifierValue(modifier) {
    return modifier.values.value
        ? parseInt(modifier.values.value)
        : parseInt(modifier.values.perLevel * character.level);
}

function isItemUsable(item) {
    return (
        item.calculated_stats &&
        item.calculated_stats.required_level.value <= character.level &&
        (!item.calculated_stats.required_dex ||
            item.calculated_stats.required_dex.value <=
                character.characterClass.modified_attributes.dex) &&
        (!item.calculated_stats.required_str ||
            item.calculated_stats.required_str.value <=
                character.characterClass.modified_attributes.str)
    );
}

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
const fireResist = computed(() => statStrategies.fireResist("fireResist"));
const coldResist = computed(() => statStrategies.coldResist("coldResist"));
const lightResist = computed(() => statStrategies.lightResist("lightResist"));
const poisonResist = computed(() =>
    statStrategies.poisonResist("poisonResist")
);
const curseResist = computed(() => statStrategies.curseResist("curseResist"));
const armorClass = computed(() => statStrategies.armorclass("armorclass"));
const str = computed(() => statStrategies.str("str"));
const dex = computed(() => statStrategies.dex("dex"));
const vit = computed(() => statStrategies.vit("vit"));
const int = computed(() => statStrategies.int("int"));

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
