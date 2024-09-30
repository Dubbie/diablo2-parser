<script setup>
import { onMounted, ref, watch, nextTick, onUpdated, inject } from "vue";
import AppTab from "./AppTab.vue";

// Props and emits
const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    activeTab: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["update:activeTab"]);
const emitter = inject("emitter");

// Initialize the indicator styles
const indicatorStyle = ref({
    left: "0%",
    width: "0%",
});

// Initialize tabRefs as an empty array
const tabRefs = ref([]);

// Method to update the indicator's position and width
const updateIndicator = () => {
    nextTick(() => {
        const activeIndex = props.tabs.findIndex(
            (tab) => tab.name === props.activeTab
        );
        const activeTabEl = tabRefs.value[activeIndex];

        if (activeTabEl) {
            // Use getBoundingClientRect() to include padding, borders, etc.
            const { left, width } = activeTabEl.$el.getBoundingClientRect();

            const containerLeft =
                activeTabEl.$el.parentElement.getBoundingClientRect().left;

            // Calculate the correct position relative to the container
            indicatorStyle.value = {
                left: `${left - containerLeft - 8}px`,
                width: `${width + 8}px`,
            };
        }
    });
};

// Update the indicator on mounted and when activeTab changes
onMounted(() => {
    updateIndicator();
    emitter.on("loading-planner", () => {
        setTimeout(() => {
            updateIndicator();
        }, 300);
    });
});

watch(
    () => props.activeTab,
    () => {
        updateIndicator();
    }
);
</script>

<template>
    <div
        class="relative flex space-x-1 ring-1 ring-inset ring-white/10 p-1 rounded-xl"
    >
        <!-- Loop through tabs and bind ref for each one -->
        <AppTab
            v-for="(tab, index) in tabs"
            :key="tab.name"
            :name="tab.label"
            :tab="tab.name"
            :active="activeTab === tab.name"
            class="relative z-10"
            @click="emit('update:activeTab', tab.name)"
            ref="tabRefs"
        />

        <!-- Indicator background -->
        <div
            class="absolute top-0 left-0 h-full p-1 pointer-events-none transition-all duration-200 ease-in-out"
            :style="indicatorStyle"
        >
            <div class="bg-white/10 h-full w-full rounded-lg"></div>
        </div>
    </div>
</template>
