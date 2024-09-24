<script setup>
import { computed, ref } from "vue";
import { router } from "@inertiajs/vue3";
import InputPlaceholder from "@/Components/InputPlaceholder.vue";
import ModifierInput from "@/Components/ModifierInput.vue";
import AppButton from "@/Components/AppButton.vue";
import InputError from "@/Components/InputError.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const loading = ref(false);
const item = ref(props.item);
const showingDebug = ref(false);
const showingTooltip = ref(false);
const errors = ref({});
const highlighted = ref(null);
const buttonLabel = computed(() => {
    if (loading.value) {
        return "Processing...";
    }

    return item.value.is_template ? "Create Item" : "Update Item";
});

const nameColor = computed(() => {
    switch (item.value.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const wikiSearch = computed(() => {
    return (
        "https://wiki.projectdiablo2.com/wiki/Special:Search?go=Go&search=" +
        item.value.name
    );
});

const sortedModifiers = computed(() => {
    return [...item.value.modifiers].sort((a, b) => a.priority < b.priority);
});

const compactModifiers = computed(() => {
    // Sort modifiers by priority
    const modifiers = [...item.value.modifiers].sort(
        (a, b) => a.priority < b.priority
    );

    return modifiers.map((modifier) => {
        let result = {
            label: modifier.label,
            name: modifier.name,
            priority: modifier.priority,
            values: modifier.values,
        };

        if (modifier.corrupted) {
            result["corrupted"] = modifier.corrupted;
        }

        if (modifier.min && modifier.max) {
            result["min"] = modifier.min;
            result["max"] = modifier.max;
        }

        return result;
    });
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
    loading.value = true;

    try {
        const itemHandlerRoute = item.value.is_template
            ? "api.items.create"
            : "api.items.update";
        const response = await axios.post(route(itemHandlerRoute), {
            item_id: id,
            modifiers: modifiers,
        });

        // Success
        item.value = response.data.item;
    } catch (error) {
        if (error.response && error.response.status === 422) {
            // Validation error
            const responseErrors = error.response.data.errors;

            Object.keys(responseErrors).forEach((key) => {
                // Set error based on key. E.g. modifiers.2
                const index = key.split(".").pop();
                if (!errors.value["modifiers"]) {
                    errors.value["modifiers"] = {};
                }

                errors.value["modifiers"][index] = responseErrors[key][0];
            });

            console.log(errors.value);
        } else {
            console.error(error);
        }
    }

    loading.value = false;
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
</script>

<template>
    <div class="flex space-x-6 items-start">
        <div class="flex flex-col items-center">
            <div class="relative">
                <img
                    :src="`/img/${item.image}.png`"
                    :alt="fullName"
                    class="p-4"
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
                                'bg-yellow-600/20': highlighted === index,
                            }"
                        >
                            <span>{{ getModifierLabel(modifier) }}</span>
                            <span
                                v-if="modifier.range"
                                class="text-green-600"
                                >{{
                                    `[${modifier.range.min} - ${modifier.range.max}]`
                                }}</span
                            >
                        </p>
                    </div>
                </transition>
            </div>
            <div
                class="text-center font-bold text-sm"
                :style="{ color: nameColor }"
            >
                <p v-if="item.name">{{ item.name }}</p>
                <p v-if="!item.skip_base_name">{{ item.base_name }}</p>
            </div>
            <div class="text-xs mt-3">
                <p class="font-semibold">Dev mode:</p>
                <a :href="wikiSearch" target="_blank">
                    <AppButton size="xs">Wiki lookup</AppButton>
                </a>
            </div>
        </div>
        <div class="flex-1">
            <div>
                <h2 class="font-bold text-xl">Item Editor</h2>
                <p class="text-sm text-zinc-500 mb-3">
                    Edit the modifiers of the item.
                </p>

                <div class="space-y-1">
                    <div
                        v-for="(modifier, index) in sortedModifiers"
                        :key="modifier"
                    >
                        <ModifierInput
                            :modifier="modifier"
                            :index="index"
                            @update:modifier="handleModifierChange"
                            @highlight="(index) => (highlighted = index)"
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
                    <AppButton @click="createItem" :disabled="loading">{{
                        buttonLabel
                    }}</AppButton>
                    <AppButton plain @click="showingDebug = !showingDebug"
                        >{{ showingDebug ? "Hide" : "Show" }} debug</AppButton
                    >
                </div>
            </div>

            <div class="mt-6">
                <transition
                    enter-active-class="transition transform ease-out duration-200"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition transform ease-in duration-200"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <div
                        class="text-xs text-green-400 bg-black/50 p-3 mt-3 rounded-lg"
                        v-show="showingDebug"
                    >
                        <code>
                            <pre>{{ compactModifiers }}</pre>
                        </code>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>
