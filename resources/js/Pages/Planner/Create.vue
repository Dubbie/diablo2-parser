<script setup>
import CharacterStats from "@/Components/Planner/CharacterStats.vue";
import ItemEditor from "@/Components/Planner/ItemEditor.vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import {
    computed,
    inject,
    onMounted,
    onUnmounted,
    provide,
    reactive,
    ref,
    watch,
} from "vue";
import { useItemCalculator } from "@/Composables/itemCalculator";
import TabContainer from "@/Components/TabContainer.vue";
import CharacterSetup from "./Partials/CharacterSetup.vue";
import AppSpinner from "@/Components/AppSpinner.vue";
import TabSidebar from "./Partials/TabSidebar.vue";
import PlannerEquipment from "./Partials/PlannerEquipment.vue";

const props = defineProps({
    debug: {
        type: Boolean,
        default: false,
    },
});

const sideTabs = [
    {
        name: "inventory",
        label: "Inventory",
    },
    {
        name: "attributes",
        label: "Attributes",
    },
];

const emitter = inject("emitter");
const loading = ref(true);
const plannerState = reactive({
    filter: {
        slot: null,
        templates: true,
    },
    pdollSlots: {
        larm: null,
        rarm: null,
        tors: null,
        head: null,
        boot: null,
        belt: null,
        glov: null,
        lrin: null,
        rrin: null,
        neck: null,
    },
    showItemFinder: false,
    showingTab: "inventory",
    characterClass: null,
    level: 99,
});

provide("item_debug", props.debug);
provide("character", plannerState);

const allItems = computed(() => {
    return Object.values(plannerState.pdollSlots).filter((item) => !!item);
});

// Method to handle filter update from CharacterInventory
const handleSetFilter = (slotName) => {
    plannerState.filter = {
        ...plannerState.filter,
        slot: slotName,
    };

    if (!plannerState.showItemFinder) {
        plannerState.showItemFinder = true;
    }

    // Check if that slot has an item
    if (plannerState.pdollSlots[slotName]) {
        emitter.emit("item-selected", plannerState.pdollSlots[slotName]);
    }
};

// Method to handle item creation
const handleItemCreated = (item) => {
    item.added = true;
    plannerState.pdollSlots[filter.value.slot] = item;
};

// Method to handle reset items
const handleResetItems = () => {
    plannerState.filter.slot = null;
    plannerState.pdollSlots = {
        larm: null,
        rarm: null,
        tors: null,
        head: null,
        boot: null,
        belt: null,
        glov: null,
        lrin: null,
        rrin: null,
        neck: null,
    };
};

const handleUneqip = (slot) => {
    plannerState.pdollSlots[slot] = null;
};

const calculateStats = (item = null) => {
    if (!item) {
        // Calculate stats for all items
        Object.values(plannerState.pdollSlots).forEach((item) => {
            if (item) {
                const { calculateStats } = useItemCalculator(
                    item,
                    plannerState.level
                );
                item.calculated_stats = calculateStats();
            }
        });

        return;
    }

    // Calculate stats for single item
    const { calculateStats } = useItemCalculator(
        item.value,
        plannerState.level
    );
    item.value.calculated_stats = calculateStats();
};

watch(
    () => [plannerState.characterClass, plannerState.level],
    () => {
        calculateStats();
    }
);

const handleItemAdded = (item) => {
    item.added = true;
    plannerState.pdollSlots[plannerState.filter.slot] = item;
    plannerState.filter.slot = null;
    plannerState.showItemFinder = false;
};

const handleLoading = (value) => {
    loading.value = value;
};

const handleClassChanged = (classData) => {
    plannerState.characterClass = classData;
};

const setUpEventListeners = () => {
    emitter.on("item-added", handleItemAdded);
    emitter.on("item-changed", calculateStats);
    emitter.on("loading-planner", handleLoading);
    emitter.on("change-class", handleClassChanged);
    emitter.on("set-filter", handleSetFilter);
    emitter.on("unequip-item", handleUneqip);
    emitter.on("reset-items", handleResetItems);
};

const tearDownEventListeners = () => {
    emitter.off("item-added");
    emitter.off("item-changed");
    emitter.off("loading-planner");
    emitter.off("change-class");
    emitter.off("set-filter");
    emitter.off("unequip-item");
    emitter.off("reset-items");
};

onMounted(() => {
    setUpEventListeners();
});

onUnmounted(tearDownEventListeners);
</script>

<template>
    <AppLayout title="Planner" wide>
        <h1 class="font-bold text-3xl">Planner</h1>
        <p class="text-zinc-400 text-sm mb-6">
            Play around with the planner to find the best items for your.
        </p>

        <div v-if="loading">
            <div class="flex flex-col justify-center items-center">
                <AppSpinner color="text-blue-400" size="size-6" class="mb-1" />
                <p class="font-bold">Loading planner...</p>
            </div>
        </div>

        <transition
            enter-active-class="transition transform ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition transform ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
            <div class="flex space-x-6" v-show="!loading">
                <div class="shrink-0">
                    <CharacterSetup :planner-state="plannerState" />

                    <div class="mb-1">
                        <TabContainer
                            :tabs="sideTabs"
                            :active-tab="plannerState.showingTab"
                            @update:active-tab="
                                plannerState.showingTab = $event
                            "
                        />
                    </div>

                    <div class="w-[320px]" v-if="!loading">
                        <TabSidebar :planner-state="plannerState" />
                    </div>
                </div>

                <PlannerEquipment
                    :planner-state="plannerState"
                    class="flex-1"
                />

                <div v-if="!loading">
                    <CharacterStats
                        :items="allItems"
                        @item-created="handleItemCreated"
                    />
                </div>
            </div>
        </transition>

        <ItemEditor />
    </AppLayout>
</template>
