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

const emit = defineEmits(["update:tab"]);
</script>

<template>
    <div
        @click="$emit('update:tab', props.tab)"
        class="text-sm font-bold py-1 px-2 cursor-pointer text-center rounded-lg"
        :class="{
            'text-white bg-white/5': active,
            'text-zinc-500 hover:text-white': !active,
        }"
    >
        <p>{{ props.name }}</p>
    </div>
</template>
