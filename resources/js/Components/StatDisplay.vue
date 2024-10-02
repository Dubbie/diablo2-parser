<script setup>
import { computed } from "vue";

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    stat: Object,
    percent: {
        type: Boolean,
        default: false,
    },
    compare: Number,
});

const displayValue = computed(() => {
    // Check if the stat is a damage object
    if (props.stat.value && props.stat.value.min !== undefined) {
        return `${props.stat.value.min} to ${props.stat.value.max}`;
    }

    if (props.percent) {
        return `${props.stat.value}%`;
    }

    return props.stat.value;
});

const comparedTextClass = computed(() => {
    if (!props.compare) {
        return "";
    }

    if (props.stat.value > props.compare) {
        return "text-red-500";
    }
});
</script>

<template>
    <p
        v-if="stat && stat.value"
        class="inline-flex space-x-1"
        :class="comparedTextClass"
    >
        <span>{{ label }}:</span>
        <span
            :class="{
                'text-blue-400': stat.modified && comparedTextClass === '',
            }"
            >{{ displayValue }}</span
        >
    </p>
</template>
