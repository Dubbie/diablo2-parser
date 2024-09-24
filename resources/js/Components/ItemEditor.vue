<script setup>
import AppSpinner from "@/Components/AppSpinner.vue";
import { computed, ref } from "vue";
import ModifierInput from "@/Components/ModifierInput.vue";
import AppButton from "@/Components/AppButton.vue";
import InputError from "@/Components/InputError.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const loading = ref(true);
const loadingCreateOrUpdate = ref(false);
const item = ref(null);
const showingTooltip = ref(false);
const errors = ref({});
const highlighted = ref(null);
const buttonLabel = computed(() => {
    if (loading.value) {
        return "Processing...";
    }

    return item.value.is_template ? "Add to build" : "Update Item";
});

const nameColor = computed(() => {
    switch (item.value.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const sortedModifiers = computed(() => {
    if (!item.value) {
        return [];
    }

    return [...item.value.modifiers].sort((a, b) => a.priority < b.priority);
});

const modifiers = ref(sortedModifiers.value);

const getModifierLabel = (modifier) => {
    if (modifier.values.length === 1) {
        return modifier.template.replace("[range]", modifier.values[0]);
    }

    return modifier.label;
};

const createItem = () => {
    console.log("Creating item...");
    console.log(item.value.id);
    console.log(modifiers.value);

    postCreateItem(item.value.id, modifiers.value);
};

const postCreateItem = async (id, modifiers) => {
    loadingCreateOrUpdate.value = true;

    emit("item-created", item.value);

    // try {
    //     const itemHandlerRoute = item.value.is_template
    //         ? "api.items.create"
    //         : "api.items.update";
    //     const response = await axios.post(route(itemHandlerRoute), {
    //         item_id: id,
    //         modifiers: modifiers,
    //     });

    //     // Success
    //     item.value = response.data.item;

    //     emit("item-created", item.value);
    // } catch (error) {
    //     if (error.response && error.response.status === 422) {
    //         // Validation error
    //         const responseErrors = error.response.data.errors;

    //         Object.keys(responseErrors).forEach((key) => {
    //             // Set error based on key. E.g. modifiers.2
    //             const index = key.split(".").pop();
    //             if (!errors.value["modifiers"]) {
    //                 errors.value["modifiers"] = {};
    //             }

    //             errors.value["modifiers"][index] = responseErrors[key][0];
    //         });

    //         console.log(errors.value);
    //     } else {
    //         console.error(error);
    //     }
    // } finally {
    //     loadingCreateOrUpdate.value = false;
    // }
};

const fullName = computed(() => {
    if (item.value.skip_base_name) {
        return item.value.name;
    } else {
        let name = item.value.base_name;

        if (item.value.name) {
            name = name + " " + item.value.name;
        }
    }
});

const clearError = (index) => {
    // Clear the error
    if (errors.value["modifiers"]) {
        delete errors.value["modifiers"][index];
    }

    if (
        errors.value.modifiers &&
        Object.keys(errors.value.modifiers).length === 0
    ) {
        errors.value = {};
    }
};

const handleModifierChange = (data) => {
    modifiers.value[data.index]["values"] = [parseInt(data.value)];

    // Clear the error
    clearError(data.index);
};

const getDetails = async () => {
    if (props.item.modifiers) {
        modifiers.value = props.item.modifiers;
        item.value = props.item;
        loading.value = false;
        return;
    }

    try {
        const response = await axios.get(
            route("api.items.details", props.item.id)
        );

        item.value = response.data;
        modifiers.value = sortedModifiers.value;

        console.log(item.value);
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    // TODO: Do this
    emit("cancel");
};

const emit = defineEmits(["cancel", "item-created", "item-updated"]);

getDetails();
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
            <div class="flex space-x-6 items-start" v-else>
                <div class="flex flex-col items-center">
                    <div class="relative">
                        <img
                            :src="`/img/${item.image}.png`"
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
                            <div
                                class="absolute ml-3 left-full top-1/2 -translate-y-1/2 text-sm text-center p-4 bg-black text-blue-400 whitespace-nowrap z-10"
                                v-show="showingTooltip"
                            >
                                <p
                                    v-for="(modifier, index) in modifiers"
                                    :key="modifier"
                                    class="flex space-x-2 justify-center"
                                    :class="{
                                        'bg-yellow-600/20':
                                            highlighted === index,
                                    }"
                                >
                                    <span>{{
                                        getModifierLabel(modifier)
                                    }}</span>
                                    <template v-if="modifier.range">
                                        <span
                                            v-show="modifier.values.length > 0"
                                            class="text-green-600"
                                            >{{
                                                `[${modifier.range.min} - ${modifier.range.max}]`
                                            }}</span
                                        >
                                    </template>
                                </p>
                            </div>
                        </transition>
                    </div>
                    <div
                        class="text-center font-bold text-sm mt-2"
                        :style="{ color: nameColor }"
                    >
                        <p v-if="item.name">{{ item.name }}</p>
                        <p v-if="!item.skip_base_name">
                            {{ item.base_name }}
                        </p>
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
                                v-for="(modifier, index) in sortedModifiers"
                                :key="modifier"
                            >
                                <ModifierInput
                                    :modifier="modifier"
                                    :index="index"
                                    trigger-on-mount
                                    @update:modifier="handleModifierChange"
                                    @highlight="
                                        (index) => (highlighted = index)
                                    "
                                    @unhighlight="highlighted = null"
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
                                @click="createItem"
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
