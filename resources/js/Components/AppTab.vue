<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    tab: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="text-sm font-medium py-1 px-2 cursor-pointer select-none text-center rounded-lg transition text-white"
        :class="{
            'hover:bg-black/20': !active,
        }"
    >
        <p>{{ props.name }}</p>
    </div>
</template>
