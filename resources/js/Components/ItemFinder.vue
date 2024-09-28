<script setup>
import ItemDisplay from "./ItemDisplay.vue";
import TextInput from "./TextInput.vue";
import { computed, ref, watch } from "vue";

const props = defineProps({
    filter: Object,
});

let timer = null;
let abortController = null;
const limit = 15;
const delay = 300;
const searched = ref(false);
const loading = ref(false);
const items = ref([]);
const searchText = ref("");

// Fetch items based on filter when the component mounts or when filter changes
const fetchItems = async () => {
    // Cancel previous request if there's one ongoing
    if (abortController) {
        abortController.abort();
    }

    // Create a new abort controller for the current request
    abortController = new AbortController();

    searched.value = true;
    loading.value = true;
    try {
        const response = await axios.get(route("api.items.fetch"), {
            params: {
                slot: props.filter.slot,
                templates: props.filter.templates,
                q: searchText.value,
            },
            signal: abortController.signal, // Attach the signal to the request
        });
        items.value = response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled", error.message);
        } else {
            console.error("Request error", error);
        }
    }

    loading.value = false;
};

// Handle item selection
const selectItem = (item) => {
    emit("item-selected", item);
};

const resetToDefault = (resetSearchInput = false) => {
    // Cancel previous request if there's one ongoing
    if (abortController) {
        abortController.abort();
    }

    searched.value = false;
    items.value = [];

    if (resetSearchInput) {
        searchText.value = "";
    }
};

const handleInput = () => {
    clearTimeout(timer);

    if (!searchText.value || searchText.value.length < 3) {
        resetToDefault();
        return;
    }

    timer = setTimeout(() => {
        fetchItems();
    }, delay);
};

const emit = defineEmits(["update-filter", "item-selected"]);

const limitedItems = computed(() => {
    return items.value.slice(0, limit);
});

// Watch for changes in filter and search text
watch(
    () => [props.filter],
    () => {
        resetToDefault(true);
    }
);
</script>

<template>
    <div>
        <div>
            <TextInput
                id="search"
                type="text"
                class="w-full text-sm"
                placeholder="Search items..."
                v-model="searchText"
                autofocus
                @input="handleInput"
            />
            <p
                class="text-zinc-400 text-sm mt-2"
                v-show="searchText.length < 3"
            >
                Start typing to search for items fitting in the selected slot.
            </p>
        </div>

        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
        >
            <template v-if="!loading">
                <div v-if="limitedItems.length" class="mt-6">
                    <div class="grid grid-cols-5 gap-6">
                        <ItemDisplay
                            v-for="item in limitedItems"
                            :key="item.id"
                            :item="item"
                            @click="selectItem(item)"
                        />
                    </div>
                    <p
                        v-if="limitedItems.length < items.length"
                        class="mt-6 text-center text-zinc-500 text-sm font-semibold"
                    >
                        {{ items.length - limitedItems.length }} items hidden
                    </p>
                </div>
                <template v-else>
                    <template v-if="searched">
                        <p class="text-center text-zinc-400 mt-6 font-semibold">
                            No items found.
                        </p>
                    </template>
                </template>
            </template>

            <template v-else>
                <p class="text-center text-zinc-400 mt-6 font-semibold">
                    Loading...
                </p>
            </template>
        </transition>
    </div>
</template>
