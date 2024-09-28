<script setup>
import AppSpinner from "@/Components/AppSpinner.vue";
import { computed, ref, watch } from "vue";
import AppButton from "@/Components/AppButton.vue";
import InputError from "@/Components/InputError.vue";
import InputPlaceholder from "./InputPlaceholder.vue";
import ItemTooltip from "./ItemTooltip.vue";
import ItemDefenseEditor from "./ItemDefenseEditor.vue";

const emit = defineEmits(["cancel", "item-created", "item-updated"]);

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const loading = ref(true);
const reactiveItem = ref(null);
const showingTooltip = ref(false);
const errors = ref({});
const buttonLabel = computed(() => {
    return !reactiveItem.value.added ? "Add to build" : "Update Item";
});

const nameColor = computed(() => {
    switch (reactiveItem.value.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const modifiers = ref(props.item.modifiers);

const fullName = computed(() => {
    if (reactiveItem.value.skip_base_name) {
        return reactiveItem.value.name;
    } else {
        let name = reactiveItem.value.base_name;

        if (reactiveItem.value.name) {
            name = name + " " + reactiveItem.value.name;
        }
    }
});

const addOrUpdateItem = () => {
    // Update item
    reactiveItem.value.modifiers = modifiers.value;
    emit("item-created", reactiveItem.value);
};

const handleModifierChange = (data) => {
    const index = data.index;
    modifiers.value[index].values = data.values;
};

const getDetails = async () => {
    if (props.item.modifiers) {
        modifiers.value = props.item.modifiers;
        reactiveItem.value = props.item;
        loading.value = false;
        return;
    }

    try {
        const response = await axios.get(
            route("api.items.details", props.item.id)
        );

        reactiveItem.value = response.data;
        modifiers.value = reactiveItem.value.modifiers;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
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

const handleCancel = () => {
    emit("cancel");
};

watch(
    () => props.item,
    () => {
        getDetails();
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div>
        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            mode="out-in"
        >
            <div v-if="loading" class="flex flex-col items-center">
                <AppSpinner
                    stroke-width="2"
                    size="size-6"
                    color="text-blue-500"
                />
                <p class="font-bold mt-3">Loading...</p>
                <p class="text-zinc-500 text-sm">
                    Fetching details for {{ props.item.name }}
                </p>
            </div>
            <div class="flex flex-col space-y-3 items-start" v-else>
                <div class="flex space-x-3">
                    <div class="flex flex-col items-center">
                        <div class="relative">
                            <img
                                :src="`/img/${reactiveItem.image}.png`"
                                :alt="fullName"
                                class="p-4 bg-black/30"
                                @mouseenter="showingTooltip = true"
                                @mouseleave="showingTooltip = false"
                            />

                            <transition
                                enter-active-class="transition transform ease-out duration-200"
                                enter-from-class="-translate-x-3 opacity-0"
                                enter-to-class="translate-x-0 opacity-100"
                                leave-active-class="transition transform ease-in duration-200"
                                leave-from-class="translate-x-0 opacity-100"
                                leave-to-class="-translate-x-3 opacity-0"
                            >
                                <ItemTooltip
                                    :item="reactiveItem"
                                    v-show="showingTooltip"
                                />
                            </transition>
                        </div>
                        <div
                            class="text-center font-bold text-sm mt-2"
                            :style="{ color: nameColor }"
                        >
                            <p v-if="reactiveItem.name">
                                {{ reactiveItem.name }}
                            </p>
                            <p v-if="!reactiveItem.skip_base_name">
                                {{ reactiveItem.base_name }}
                            </p>
                        </div>
                    </div>

                    <div>
                        <ItemDefenseEditor
                            v-if="hasVariableDefense"
                            :item="item"
                            @update:defense="handleNewDefense"
                        />
                    </div>
                </div>
                <div class="flex-1">
                    <div>
                        <h2 class="font-bold text-xl">Item Editor</h2>
                        <p class="text-sm text-zinc-500 mb-3">
                            Edit the modifiers of the item.
                        </p>

                        <div class="space-y-0.5">
                            <div
                                v-for="(modifier, index) in modifiers"
                                :key="modifier"
                            >
                                <InputPlaceholder
                                    :entry="modifier"
                                    :index="index"
                                    @update:entry="handleModifierChange"
                                />
                                <InputError
                                    class="ml-3"
                                    v-if="errors.modifiers"
                                    :message="errors.modifiers[index] || ''"
                                />
                            </div>
                        </div>

                        <div class="mt-6 flex space-x-1">
                            <AppButton
                                @click="addOrUpdateItem"
                                :disabled="loading"
                                >{{ buttonLabel }}</AppButton
                            >
                            <AppButton plain @click="handleCancel"
                                >Choose another item</AppButton
                            >
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
