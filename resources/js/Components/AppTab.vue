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
        class="text-sm font-bold py-1 px-2 cursor-pointer select-none text-center rounded-lg"
        :class="{
            'text-white': active,
            'text-zinc-500 hover:text-white': !active,
        }"
    >
        <p>{{ props.name }}</p>
    </div>
</template>
