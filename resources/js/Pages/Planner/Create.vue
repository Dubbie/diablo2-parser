<script setup>
import CharacterInventory from "@/Components/Planner/CharacterInventory.vue";
import CharacterStats from "@/Components/Planner/CharacterStats.vue";
import ItemEditor from "@/Components/Planner/ItemEditor.vue";
import ItemFinder from "@/Components/ItemFinder.vue";
import SelectInput from "@/Components/SelectInput.vue";
import TextInput from "@/Components/TextInput.vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import { useForm } from "@inertiajs/vue3";
import { IconSearch } from "@tabler/icons-vue";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";

const showItemFinder = ref(false);
const selectedItem = ref(null);
const emitter = inject("emitter");

const pdollSlots = ref({
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
});

const form = useForm({
    characterClass: "ama",
    level: "99",
});

const filter = ref({
    slot: null,
    templates: true,
});

const characterClassOptions = [
    {
        label: "Amazon",
        value: "ama",
    },
    {
        label: "Sorceress",
        value: "sor",
    },
    {
        label: "Barbarian",
        value: "bar",
    },
    {
        label: "Necromancer",
        value: "nec",
    },
    {
        label: "Paladin",
        value: "pal",
    },
    {
        label: "Druid",
        value: "dru",
    },
    {
        label: "Assassin",
        value: "ass",
    },
];

const allItems = computed(() => {
    return Object.values(pdollSlots.value).filter((item) => !!item);
});

// Method to handle filter update from ItemFinder
const updateFilter = (newSearch) => {
    filter.value = { ...filter.value, search: newSearch };
};

// Method to handle filter update from CharacterInventory
const handleSetFilter = (slotName) => {
    filter.value = { ...filter.value, slot: slotName };

    if (!showItemFinder.value) {
        showItemFinder.value = true;
    }

    // Check if that slot has an item
    if (pdollSlots.value[slotName]) {
        emitter.emit("item-selected", pdollSlots.value[slotName]);
    }
};

// Method to handle item selection
const handleItemSelected = (item) => {
    emitter.emit("item-selected", item);
};

// Method to handle item creation
const handleItemCreated = (item) => {
    item.added = true;
    pdollSlots.value[filter.value.slot] = item;
};

// Method to handle reset items
const handleResetItems = () => {
    pdollSlots.value = {
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

    filter.value.slot = null;
};

onMounted(() => {
    emitter.on("item-added", (item) => {
        item.added = true;
        pdollSlots.value[filter.value.slot] = item;
        filter.value.slot = null;
        showItemFinder.value = false;
    });
});

onUnmounted(() => {
    emitter.off("item-added");
});
</script>

<template>
    <AppLayout title="Planner" wide>
        <h1 class="font-bold text-3xl">Planner</h1>
        <p class="text-zinc-400 text-sm mb-6">
            Play around with the planner to find the best items for your.
        </p>

        <div class="flex space-x-6">
            <div class="shrink-0">
                <div class="flex space-x-1 mb-1">
                    <SelectInput
                        class="flex-1"
                        v-model="form.characterClass"
                        :options="characterClassOptions"
                    />

                    <TextInput
                        v-model="form.level"
                        min="1"
                        max="99"
                        class="text-sm w-16"
                    />
                </div>

                <div class="w-[320px]">
                    <CharacterInventory
                        :filter="filter"
                        :larm="pdollSlots.larm"
                        :rarm="pdollSlots.rarm"
                        :head="pdollSlots.head"
                        :boot="pdollSlots.boot"
                        :tors="pdollSlots.tors"
                        :belt="pdollSlots.belt"
                        :glov="pdollSlots.glov"
                        :neck="pdollSlots.neck"
                        :lrin="pdollSlots.lrin"
                        :rrin="pdollSlots.rrin"
                        @unequip-item="pdollSlots[filter.slot] = null"
                        @set-filter="handleSetFilter"
                        @reset-items="handleResetItems"
                    />
                </div>
            </div>

            <div class="flex-1">
                <ItemFinder
                    v-if="showItemFinder"
                    :filter="filter"
                    @update-filter="updateFilter"
                    @item-selected="handleItemSelected"
                />

                <div v-else>
                    <div class="flex space-x-2 items-start">
                        <div class="flex-1">
                            <p class="font-semibold">
                                Choose an equippable slot to search for items.
                            </p>
                            <p class="text-zinc-500 text-sm">
                                You can choose slots on the paperdoll.
                            </p>
                        </div>
                        <IconSearch
                            class="text-zinc-400 mt-1 size-5"
                            stroke-width="3"
                        />
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
