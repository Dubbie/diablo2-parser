<script setup>
import { ref } from "vue";
import ItemTooltip from "@/Components/ItemTooltip.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    tooltipPosition: {
        type: String,
        default: "right",
    },
});

const showingTooltip = ref(false);
</script>

<template>
    <div class="flex justify-start">
        <div class="relative">
            <p
                class="text-sm font-semibold cursor-pointer py-0.5 px-1 hover:bg-white/5"
                :style="{ color: item.name_color }"
                @mouseenter="showingTooltip = true"
                @mouseleave="showingTooltip = false"
            >
                {{ item.name ?? item.base_name }}
            </p>

            <ItemTooltip
                :item="item"
                v-show="showingTooltip"
                :position="tooltipPosition"
            />
        </div>
    </div>
</template>
