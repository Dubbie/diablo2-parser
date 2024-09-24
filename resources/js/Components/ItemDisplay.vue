<script setup>
import { computed, ref } from "vue";
import { Link } from "@inertiajs/vue3";

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
});

const showingTooltip = ref(false);

const fullName = computed(() => {
    return props.item.name
        ? `${props.item.name} ${props.item.base_name}`
        : props.item.base_name;
});

const nameColor = computed(() => {
    switch (props.item.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const blockSize = 35;
</script>

<template>
    <div class="relative">
        <component
            :is="attachLink ? Link : 'div'"
            :href="attachLink ? route('items.show', item.id) : ''"
            @mouseenter="showingTooltip = true"
            @mouseleave="showingTooltip = false"
            class="flex flex-col h-full w-full justify-start items-center item-box"
            :class="{
                'px-2 py-4': padded,
            }"
        >
            <div
                class="flex justify-center items-center"
                :style="`height: ${blockSize * item.height}px; width: ${
                    blockSize * item.width
                }px;`"
                :class="{
                    'bg-black/40': background,
                }"
            >
                <img :src="`/img/${item.image}.png`" alt="" />
            </div>

            <div
                class="mt-3 text-sm font-bold text-center"
                :style="{ color: nameColor }"
            >
                <p v-if="item.name">{{ item.name }}</p>
                <p v-if="!item.skip_base_name">{{ item.base_name }}</p>
                <p v-if="!item.is_template" class="text-white font-semibold">
                    (Rolled)
                </p>
            </div>
        </component>
    </div>
</template>
