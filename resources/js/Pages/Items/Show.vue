<script setup>
import AppButton from "@/Components/AppButton.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import { Link } from "@inertiajs/vue3";
import { computed, ref } from "vue";

const props = defineProps({
    item: Object,
    max: {
        type: Number,
        required: true,
    },
    previousId: Number,
    nextId: Number,
});

const showingDebug = ref(false);

const previousLink = computed(() => {
    if (props.previousId) {
        return route("items.show", props.previousId);
    }

    return null;
});

const nextLink = computed(() => {
    if (props.nextId) {
        return route("items.show", props.nextId);
    }

    return null;
});

const wikiSearch = computed(() => {
    return `https://wiki.projectdiablo2.com/wiki/Special:Search?go=Go&search=${props.item.name}`;
});
</script>

<template>
    <AppLayout :title="item.name">
        <Link
            :href="route('items.index')"
            class="flex space-x-2 items-center text-zinc-500 mb-2 font-semibold hover:text-zinc-400"
        >
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="size-4"
                >
                    <path
                        fill-rule="evenodd"
                        d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </span>
            <span>Back to list</span>
        </Link>

        <h1 class="font-bold text-3xl mb-6">Items Details</h1>

        <div class="flex justify-between mb-6">
            <AppButton v-if="previousLink" :href="previousLink"
                >Previous</AppButton
            >
            <AppButton v-if="nextLink" :href="nextLink">Next</AppButton>
        </div>

        <div>
            <div class="flex flex-col items-center justify-center">
                <img
                    :src="`/img/${item.image}.png`"
                    :alt="item.full_name"
                    class="mb-3"
                />

                <div
                    class="font-bold text-center"
                    :style="{ color: item.name_color }"
                >
                    <p v-if="item.name">{{ item.name }}</p>
                    <p v-if="!item.skip_base_name">{{ item.base_name }}</p>
                </div>
            </div>

            <p class="mt-3 text-sm font-bold mb-2">Original labels:</p>
            <div class="text-green-400">
                <p v-for="modifier in item.modifiers" :key="modifier">
                    {{ modifier.label }}
                </p>
            </div>

            <div class="mt-12">
                <div class="flex space-x-1">
                    <AppButton
                        color="green"
                        @click="showingDebug = !showingDebug"
                        >{{ showingDebug ? "Hide" : "Show" }} Debug</AppButton
                    >
                    <a :href="wikiSearch" target="_blank">
                        <AppButton color="white">Search wiki</AppButton>
                    </a>
                </div>

                <div v-show="showingDebug" class="text-xs font-mono">
                    <code>
                        <pre>{{ item.modifiers }}</pre>
                    </code>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
