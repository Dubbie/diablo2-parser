<script setup>
import AppSpinner from "@/Components/AppSpinner.vue";
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import AppButton from "@/Components/AppButton.vue";
import Modal from "@/Components/Modal.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";
import InputPlaceholder from "@/Components/InputPlaceholder.vue";
import { useItemCalculator } from "@/Composables/itemCalculator";
import ItemCalculatedStats from "@/Components/Planner/ItemCalculatedStats.vue";

const emitter = inject("emitter");
const loading = ref(true);
const reactiveItem = ref(null);
const showing = ref(false);

const buttonLabel = computed(() => {
    return !reactiveItem.value.added ? "Add to build" : "Update Item";
});

const itemNameColor = computed(() => {
    if (!reactiveItem.value) {
        return "rgb(255, 255, 255)";
    }

    switch (reactiveItem.value.unique) {
        case 1:
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const { calculateStats } = useItemCalculator(reactiveItem);

const getDetails = async (item) => {
    loading.value = true;

    // Check if this item already has the good stuff
    if (item.modifiers) {
        reactiveItem.value = item;
        loading.value = false;
        return;
    }

    try {
        const response = await axios.get(route("api.items.details", item.id));

        reactiveItem.value = response.data;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const handleModifierChange = (data) => {
    const index = data.index;
    const newValues = JSON.parse(JSON.stringify(data.values));
    reactiveItem.value.modifiers[index].values = newValues;
};

const handleAddOrUpdateItem = () => {
    console.log(reactiveItem.value);
    // emitting to the planner that the item should be added or updated...
    emitter.emit("item-added", reactiveItem.value);

    handleCancel();
};

const handleCancel = () => {
    showing.value = false;
    reactiveItem.value = null;
};

watch(
    () => reactiveItem.value?.modifiers,
    () => {
        if (!reactiveItem.value) {
            return;
        }

        reactiveItem.value.calculated_stats = calculateStats();
    },
    {
        deep: true,
    }
);

onMounted(() => {
    emitter.on("item-selected", (item) => {
        showing.value = true;

        getDetails(item);
    });
});

onUnmounted(() => {
    emitter.off("item-selected");
});
</script>

<template>
    <Modal :show="showing" @close="handleCancel">
        <div v-if="loading" class="flex justify-center">
            <AppSpinner />
            <p>Loading...</p>
        </div>

        <div v-else class="p-10">
            <div class="flex space-x-6 justify-start">
                <div>
                    <ItemDisplay :item="reactiveItem" />
                </div>
                <div class="text-zinc-400 text-sm">
                    <p>Item details go here...</p>
                    <p>Specifing Defense</p>
                    <p>Ethereal</p>
                    <p>ilvl if needed</p>
                </div>
            </div>

            <!-- Modifiers -->
            <p
                class="my-3 border-b border-white/10 font-bold"
                :style="{ color: itemNameColor }"
            >
                {{ reactiveItem.unique ? "Unique" : "Normal" }}
            </p>
            <div class="space-y-0.5">
                <div
                    v-for="(modifier, index) in reactiveItem.modifiers"
                    :key="index"
                >
                    <InputPlaceholder
                        :entry="modifier"
                        :index="index"
                        @update:entry="handleModifierChange"
                    />
                </div>
            </div>

            <!-- Calculated stats -->
            <ItemCalculatedStats :item="reactiveItem" />

            <div class="mt-6 flex space-x-1">
                <AppButton @click="handleAddOrUpdateItem">{{
                    buttonLabel
                }}</AppButton>
                <AppButton plain @click="handleCancel"
                    >Choose another item</AppButton
                >
            </div>
        </div>
    </Modal>
</template>
