<script setup>
import { computed, inject } from "vue";
import ItemCalculatedStats from "@/Components/ItemCalculatedStats.vue";

// Get the data from the character
const character = inject("character", null);

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    position: {
        type: String,
        default: "right",
    },
});

const positionClasses = computed(() => {
    return {
        left: "left-0",
        right: "left-full top-1/2 -translate-y-1/2 ml-4",
        "top-right": "top-0 left-full ml-4",
    }[props.position];
});

const getModifierLabel = (modifier) => {
    let template = modifier.template;

    if (character && character.level && isPerLevelModifier(modifier)) {
        const perLevel = modifier.values.perLevel; // Get the per level value
        const newValue = Math.floor(perLevel * character.level);

        // Replace the values inside brackets
        template = modifier.template.replace(/\[\d+-\d+\]/, `${newValue}`);
    }

    if (modifier.range.value) {
        template = template.replace("[value]", modifier.values.value);
    }

    if (modifier.range.minValue) {
        template = template.replace("[minValue]", modifier.values.minValue);
    }

    if (modifier.range.maxValue) {
        template = template.replace("[maxValue]", modifier.values.maxValue);
    }

    return template === modifier.template ? modifier.label : template;
};

const isPerLevelModifier = (modifier) => {
    const perLevelDescFuncs = [6, 7, 8];

    return perLevelDescFuncs.includes(modifier.desc_func);
};
</script>

<template>
    <div
        class="absolute bg-black/90 text-sm text-center px-2 py-1 whitespace-nowrap z-10 pointer-events-none"
        :class="positionClasses"
    >
        <div :style="{ color: item.name_color }" class="font-semibold">
            <p v-if="item.name">{{ item.name }}</p>
            <p v-if="!item.skip_base_name">{{ item.base_name }}</p>
        </div>

        <!-- Base stats -->
        <ItemCalculatedStats :item="item" />

        <!-- Modifiers -->
        <div class="mt-1 text-blue-400">
            <p v-for="modifier in props.item.modifiers" :key="modifier">
                {{ getModifierLabel(modifier) }}
            </p>
        </div>
    </div>
</template>
