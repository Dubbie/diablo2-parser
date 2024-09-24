<script setup>
import AppHeader from "@/Components/AppHeader.vue";
import { Head } from "@inertiajs/vue3";

const props = defineProps({
    title: String,
    wide: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <Head :title="title" />
    <div class="bg-zinc-900 text-white min-h-screen py-10">
        <div
            class="mx-auto sm:px-6 lg:px-8"
            :class="{
                'max-w-4xl': !wide,
                'max-w-7xl': wide,
            }"
        >
            <AppHeader class="mb-6" />
            <slot />
        </div>
    </div>
</template>
