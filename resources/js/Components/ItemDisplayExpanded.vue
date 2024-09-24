<script setup>
import { computed, ref } from "vue";
import { router } from "@inertiajs/vue3";
import InputPlaceholder from "@/Components/InputPlaceholder.vue";
import AppButton from "@/Components/AppButton.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const nameColor = computed(() => {
    switch (props.item.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const wikiSearch = computed(() => {
    return (
        "https://wiki.projectdiablo2.com/wiki/Special:Search?go=Go&search=" +
        props.item.name
    );
});

const sortedModifiers = computed(() => {
    return props.item.modifiers.sort((a, b) => {
        return a.priority + b.priority;
    });
});
</script>

<template>
    <div class="flex space-x-6 items-start">
        <div class="flex flex-col items-center">
            <img :src="`/img/${item.image}.png`" alt="" />
            <div
                class="text-center font-bold text-sm"
                :style="{ color: nameColor }"
            >
                <p v-if="item.name">{{ item.name }}</p>
                <p v-if="!item.skip_base_name">{{ item.base_name }}</p>
            </div>
            <div class="text-xs mt-3">
                <p class="font-semibold">Dev mode:</p>
                <a :href="wikiSearch" target="_blank">
                    <AppButton size="xs">Wiki lookup</AppButton>
                </a>
            </div>
        </div>
        <div class="flex-1">
            <div class="text-sm text-center bg-black text-blue-400">
                <p v-for="modifier in sortedModifiers" :key="modifier">
                    {{ modifier.label }}
                </p>
            </div>

            <p>Debug:</p>
            <div class="text-xs text-zinc-200">
                <code>
                    <pre>{{ item.modifiers }}</pre>
                </code>
            </div>
        </div>
    </div>
</template>
