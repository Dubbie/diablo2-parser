<script setup>
import { computed } from "vue";

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
    }[props.position];
});

const nameColor = computed(() => {
    switch (props.item.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const getModifierLabel = (modifier) => {
    if (modifier.values.length === 1) {
        return modifier.template.replace("[range]", modifier.values[0]);
    }

    return modifier.label;
};
</script>

<template>
    <div
        class="absolute bg-black/90 text-sm text-center px-2 py-1 whitespace-nowrap z-10"
        :class="positionClasses"
    >
        <div :style="{ color: nameColor }" class="font-semibold">
            <p v-if="item.name">{{ item.name }}</p>
            <p v-if="!item.skip_base_name">{{ item.base_name }}</p>
        </div>

        <div class="mt-1">
            <p v-for="modifier in props.item.modifiers" :key="modifier">
                {{ getModifierLabel(modifier) }}
            </p>
        </div>
    </div>
</template>
