<script setup>
import ItemDisplay from "@/Components/ItemDisplay.vue";
import TextInput from "@/Components/TextInput.vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import { useForm } from "@inertiajs/vue3";
import { IconSearch } from "@tabler/icons-vue";
import { onMounted, ref, watch } from "vue";

let timer = null;
let abortController = null;
const loading = ref(true);
const delay = 300;
const items = ref([]);
const form = useForm({
    q: "",
});

const fetchItems = async () => {
    // Cancel previous request if there's one ongoing
    if (abortController) {
        abortController.abort();
    }

    // Create a new abort controller for the current request
    abortController = new AbortController();

    loading.value = true;

    try {
        const response = await axios.get(route("api.items.fetch"), {
            params: form.data(),
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

const handleUpdate = () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        fetchItems();
    }, delay);
};

onMounted(() => {
    fetchItems();
});

watch(
    () => form.q,
    () => {
        handleUpdate();
    }
);
</script>

<template>
    <AppLayout>
        <h1 class="text-3xl font-bold mb-3">Items</h1>

        <div>
            <TextInput
                v-model="form.q"
                placeholder="Search..."
                class="text-sm w-full"
            />
        </div>

        <transition
            enter-active-class="transition transform ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition transform ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
        >
            <div v-if="!loading">
                <div class="grid grid-cols-6 gap-6 mt-12 items-center">
                    <ItemDisplay
                        v-for="item in items"
                        :key="item.id"
                        :item="item"
                        :attach-link="true"
                    />
                </div>
            </div>
            <div v-else>
                <div class="flex space-x-2 items-center mt-12">
                    <div>
                        <IconSearch class="text-zinc-400 mt-1 size-5" />
                    </div>

                    <p class="text-zinc-300">Loading...</p>
                </div>
            </div>
        </transition>
    </AppLayout>
</template>
