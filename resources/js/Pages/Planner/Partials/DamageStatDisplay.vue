<script setup>
const props = defineProps({
    label: String,
    min: Number,
    max: Number,
    labelClass: [String, Object],
});
</script>

<template>
    <p class="flex justify-between" v-if="min || max">
        <span :class="labelClass">{{ label }}</span>
        <p v-if="min !== max">
            <span>{{ min }}</span> - <span>{{ max }}</span>
        </p>
        <p v-else>+{{ min }}</p>
    </p>
</template>
