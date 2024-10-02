<script setup>
import { computed, ref } from "vue";
import { Link } from "@inertiajs/vue3";
import ItemTooltip from "./ItemTooltip.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    attachLink: {
        type: Boolean,
        default: false,
    },
    background: {
        type: Boolean,
        default: true,
    },
    padded: {
        type: Boolean,
        default: true,
    },
    tooltipPosition: {
        type: String,
        default: "right",
    },
});

const showingTooltip = ref(false);
</script>

<template>
    <component
        :is="attachLink ? Link : 'div'"
        :href="attachLink ? route('items.show', item.id) : ''"
        class="relative flex items-center justify-center h-full w-full"
    >
        <div
            class="max-w-full max-h-full h-full w-full flex justify-center items-center"
            :class="{
                'bg-black/40': background,
            }"
            @mouseenter="showingTooltip = true"
            @mouseleave="showingTooltip = false"
        >
            <img
                :src="`/img/${item.image}.png`"
                class="block max-w-full max-h-full"
                :alt="item.full_name"
            />
        </div>
        <transition
            enter-active-class="transition transform ease-out duration-200"
            enter-from-class="-translate-x-3 opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition transform ease-in duration-100"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="-translate-x-3 opacity-0"
        >
            <ItemTooltip
                :item="item"
                v-show="showingTooltip"
                :position="tooltipPosition"
            />
        </transition>
    </component>
</template>
