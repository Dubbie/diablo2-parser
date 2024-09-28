<script setup>
import { computed } from "vue";

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    stat: Object,
});

const displayValue = computed(() => {
    // Check if the stat is a damage object
    console.log(props.stat);

    if (props.stat.value && props.stat.value.min !== undefined) {
        return `${props.stat.value.min} to ${props.stat.value.max}`;
    }
    return props.stat.value;
});
</script>

<template>
    <p v-if="stat && stat.value" class="inline-flex space-x-1">
        <span>{{ label }}:</span>
        <span :class="{ 'text-blue-400': stat.modified }">{{
            displayValue
        }}</span>
    </p>
</template>
