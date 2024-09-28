<script setup>
import AppSpinner from "@/Components/AppSpinner.vue";
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import AppButton from "@/Components/AppButton.vue";
import Modal from "@/Components/Modal.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";
import InputPlaceholder from "@/Components/InputPlaceholder.vue";
import { useItemCalculator } from "@/Composables/itemCalculator";
import ItemCalculatedStats from "@/Components/Planner/ItemCalculatedStats.vue";
import ItemDefenseEditor from "../ItemDefenseEditor.vue";

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

const hasVariableDefense = computed(() => {
    // Check if %armor mod is on the item
    const hasArmorPercentMod = reactiveItem.value.modifiers.some((modifier) => {
        if (modifier.name === "item_armor_percent") {
            return true;
        }
    });

    const hasBaseArmorClass = reactiveItem.value.base_stats.min_ac > 0;

    return !hasArmorPercentMod && hasBaseArmorClass;
});

const handleNewDefense = (defense) => {
    // Check if set_stats exists
    if (!reactiveItem.value.set_stats) {
        reactiveItem.value.set_stats = {};
    }

    reactiveItem.value.set_stats.defense = defense;
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
    () => [reactiveItem.value?.modifiers, reactiveItem.value?.set_stats],
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
                    <ItemDisplay
                        :item="reactiveItem"
                        tooltip-position="top-right"
                    />
                </div>
                <div class="text-sm">
                    <ItemDefenseEditor
                        v-if="hasVariableDefense"
                        :item="reactiveItem"
                        @update:defense="handleNewDefense"
                    />
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
            <div>
                <p class="font-bold my-3 border-b border-white/10">
                    Calculated stats
                </p>
                <ItemCalculatedStats :item="reactiveItem" />
            </div>

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
