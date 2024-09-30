<script setup>
import CharacterInventory from "@/Components/Planner/CharacterInventory.vue";
import CharacterStats from "@/Components/Planner/CharacterStats.vue";
import ItemEditor from "@/Components/Planner/ItemEditor.vue";
import ItemFinder from "@/Components/ItemFinder.vue";
import SelectInputComplex from "@/Components/SelectInputComplex.vue";
import TextInput from "@/Components/TextInput.vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import { IconSearch } from "@tabler/icons-vue";
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
import CharacterAttributes from "@/Components/Planner/CharacterAttributes.vue";
import AppTab from "@/Components/AppTab.vue";
import { useItemCalculator } from "@/Composables/itemCalculator";
import TabContainer from "@/Components/TabContainer.vue";

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
const characters = ref([]);
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

const characterClassOptions = computed(() => {
    return characters.value.map((char) => {
        return {
            label: char.name,
            value: char,
        };
    });
});

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

// Method to handle item selection
const handleItemSelected = (item) => {
    emitter.emit("item-selected", item);
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

const loadCharacters = async () => {
    try {
        const response = await axios.get(route("api.characters.fetch"));
        characters.value = response.data;

        // Set default class
        plannerState.characterClass = characters.value[0];
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
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

const setUpEventListeners = () => {
    emitter.on("item-added", handleItemAdded);
    emitter.on("item-changed", calculateStats);
};

const tearDownEventListeners = () => {
    emitter.off("item-added");
    emitter.off("item-changed");
};

onMounted(() => {
    loadCharacters();
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
            <p>Loading...</p>
        </div>

        <div v-else class="flex space-x-6">
            <div class="shrink-0">
                <div class="flex space-x-1 mb-1">
                    <SelectInputComplex
                        class="flex-1"
                        v-model="plannerState.characterClass"
                        :options="characterClassOptions"
                    />

                    <TextInput
                        v-model="plannerState.level"
                        :min="1"
                        :max="99"
                        type="number"
                        class="text-sm w-16"
                    />
                </div>

                <div class="mb-1">
                    <TabContainer
                        :tabs="sideTabs"
                        :active-tab="plannerState.showingTab"
                        @update:active-tab="plannerState.showingTab = $event"
                    />
                </div>

                <div class="w-[320px]">
                    <CharacterInventory
                        v-show="plannerState.showingTab === 'inventory'"
                        :filter="plannerState.filter"
                        :slots="plannerState.pdollSlots"
                        @unequip-item="handleUneqip"
                        @set-filter="handleSetFilter"
                        @reset-items="handleResetItems"
                    />

                    <CharacterAttributes
                        v-show="plannerState.showingTab === 'attributes'"
                    />
                </div>
            </div>

            <div class="flex-1">
                <ItemFinder
                    v-if="plannerState.showItemFinder"
                    :filter="plannerState.filter"
                    @item-selected="handleItemSelected"
                />

                <div v-else>
                    <div class="flex space-x-3 items-start">
                        <div
                            class="p-2 ring-1 ring-white/10 flex justify-center items-center rounded-lg"
                        >
                            <IconSearch
                                class="text-zinc-400 size-5"
                                stroke-width="2"
                            />
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold">
                                Choose an equippable slot to search for items.
                            </p>
                            <p class="text-zinc-500 text-sm">
                                You can choose slots on the paperdoll.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <CharacterStats
                    :items="allItems"
                    @item-created="handleItemCreated"
                />
            </div>
        </div>

        <ItemEditor />
    </AppLayout>
</template>
