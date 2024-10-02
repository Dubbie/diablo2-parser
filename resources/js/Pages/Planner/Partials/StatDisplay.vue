<script setup>
const props = defineProps({
    label: String,
    value: [Number, String],
    labelClass: [String, Object],
    valueClass: [String, Object],
});
</script>

<template>
    <p class="flex justify-between text-xs">
        <span :class="labelClass">{{ label }}</span>
        <span :class="valueClass">{{ value }}</span>
    </p>
</template>
