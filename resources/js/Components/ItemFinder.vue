<script setup>
import { useItemStore } from "@/Stores/ItemStore";
import TextInput from "./TextInput.vue";
import { computed, ref, watch } from "vue";
import ItemLineDisplay from "./ItemLineDisplay.vue";
import ItemEditorModal from "@/Pages/Planner/Partials/ItemEditorModal.vue";

const itemStore = useItemStore();

const searchInput = ref(null);
const loading = computed(() => itemStore.loading);
const items = computed(() => itemStore.items);
const slot = computed(() => itemStore.slot);

// Input event handler
const handleNewInput = (value) => {
    itemStore.setQuery(value); // Set the query and automatically fetch items
};

watch(
    () => slot.value,
    () => {
        if (slot.value && searchInput.value) {
            searchInput.value.focus();
        }
    }
);
</script>

<template>
    <div>
        <div v-if="slot">
            <div>
                <TextInput
                    :model-value="itemStore.q"
                    class="text-sm w-full"
                    placeholder="Search..."
                    ref="searchInput"
                    autofocus
                    @input="handleNewInput($event.target.value)"
                />
            </div>

            <div v-if="loading">
                <p>Loading items...</p>
            </div>
            <div v-else class="mt-4">
                <ItemLineDisplay
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    @click="itemStore.selectItem(item)"
                />
            </div>

            <ItemEditorModal />
        </div>

        <div v-else>
            <p class="font-semibold text-xl">Choose a slot to search</p>
            <p class="text-zinc-400 text-sm">
                You can choose the slots by clicking in the paperdoll.
            </p>
        </div>
    </div>
</template>
