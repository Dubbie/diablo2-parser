<script setup>
import AppHeader from "@/Components/AppHeader.vue";
import { Head } from "@inertiajs/vue3";

const props = defineProps({
    title: String,
});
</script>

<template>
    <Head :title="title" />
    <div class="bg-zinc-900 text-white min-h-screen py-10">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <AppHeader class="mb-6" />
            <slot />
        </div>
    </div>
</template>
