<script setup>
import { computed, ref } from "vue";
import { router } from "@inertiajs/vue3";
import InputPlaceholder from "@/Components/InputPlaceholder.vue";
import ModifierInput from "@/Components/ModifierInput.vue";
import AppButton from "@/Components/AppButton.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const showingDebug = ref(false);

const nameColor = computed(() => {
    switch (props.item.item_type) {
        case "unique":
            return "rgb(199, 179, 119)";
        default:
            return "rgb(255, 255, 255)";
    }
});

const wikiSearch = computed(() => {
    return (
        "https://wiki.projectdiablo2.com/wiki/Special:Search?go=Go&search=" +
        props.item.name
    );
});

const sortedModifiers = computed(() => {
    return [...props.item.modifiers].sort((a, b) => a.priority < b.priority);
});

const compactModifiers = computed(() => {
    // Sort modifiers by priority
    const modifiers = [...props.item.modifiers].sort(
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
</script>

<template>
    <div class="flex space-x-6 items-start">
        <div class="flex flex-col items-center">
            <img :src="`/img/${item.image}.png`" alt="" />
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
            <div class="text-sm text-center bg-black text-blue-400">
                <p v-for="modifier in sortedModifiers" :key="modifier">
                    {{ modifier.label }}
                </p>
            </div>

            <div class="mt-6">
                <h2 class="font-bold text-xl">Item Editor</h2>
                <p class="text-sm text-zinc-500 mb-3">
                    Edit the modifiers of the item.
                </p>

                <div class="space-y-1">
                    <ModifierInput
                        v-for="modifier in sortedModifiers"
                        :key="modifier"
                        :modifier="modifier"
                    />
                </div>
            </div>

            <div class="mt-6">
                <AppButton
                    plain
                    @click="showingDebug = !showingDebug"
                    class="w-full"
                    >{{ showingDebug ? "Hide" : "Show" }} debug</AppButton
                >
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
