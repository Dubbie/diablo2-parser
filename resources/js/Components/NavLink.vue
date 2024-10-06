<script setup>
import { computed } from "vue";
import { Link } from "@inertiajs/vue3";

const props = defineProps({
    href: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
    },
});
</script>

<template>
    <Link
        :href="href"
        class="inline-flex font-medium text-sm/6 px-2 py-1"
        :class="{
            'text-zinc-400 hover:text-white': !active,
            'text-white': active,
        }"
    >
        <slot />
    </Link>
</template>
