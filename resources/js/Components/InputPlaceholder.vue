<script setup>
import { ref, computed, watch } from "vue";

// Define the component's prop for handling a single entry
const props = defineProps({
    entry: {
        type: Object,
        required: true,
    },
});

// Tooltip visibility
const showingTooltip = ref(null);

// Hold dynamic values for each range
const values = ref({});

// Function to extract placeholders from the template
const getPlaceholders = (template) => {
    if (!template) return []; // If template is undefined, return an empty array

    // Capture placeholders only: [value], [perLevel], [minValue], [maxValue]
    const regex = /\[value\]|\[perLevel\]|\[minValue\]|\[maxValue\]/g;
    return [...template.matchAll(regex)].map((match) => match[0]); // Keep the brackets intact
};

// Initialize values based on placeholders and ranges
const initValues = () => {
    if (!props.entry.template) return; // Ensure the template exists before proceeding

    const placeholders = getPlaceholders(props.entry.template);
    const initialValues = {};
    placeholders.forEach((placeholder) => {
        const range = props.entry.range[placeholder.slice(1, -1)]; // Remove brackets for range lookup
        // Use the max value as the default initial value
        initialValues[placeholder] = range?.max ?? null;
    });
    values.value = initialValues;
};

// Watch for changes in the entry prop and reinitialize if necessary
watch(() => props.entry, initValues, { immediate: true });

// Computed property to break the template into text and placeholder parts
const templateParts = computed(() => {
    // Split the template by the known placeholders
    return props.entry.template.split(
        /(\[value\]|\[perLevel\]|\[minValue\]|\[maxValue\])/
    );
});
</script>

<template>
    <div>
        <!-- Ensure entry.template exists -->
        <div v-if="entry.template" class="flex items-baseline space-x-1">
            <template v-for="(part, index) in templateParts" :key="index">
                <!-- If it's a known placeholder, render an input -->
                <template
                    v-if="
                        [
                            '[value]',
                            '[perLevel]',
                            '[minValue]',
                            '[maxValue]',
                        ].includes(part)
                    "
                >
                    <div class="relative">
                        <input
                            type="tel"
                            :min="entry.range[part.slice(1, -1)]?.min ?? 0"
                            :max="entry.range[part.slice(1, -1)]?.max ?? 100"
                            class="max-w-10 px-0 py-0.5 rounded-lg border-none bg-white/5 text-center text-sm ring-2 ring-inset ring-white/10"
                            v-model="values[part]"
                            @mouseenter="showingTooltip = part"
                            @mouseleave="showingTooltip = null"
                        />

                        <!-- Tooltip for showing range -->
                        <div
                            class="absolute top-1/2 -translate-y-1/2 left-full ml-0.5 bg-black/70 backdrop-blur-md p-2 whitespace-nowrap text-xs rounded-lg shadow-lg z-50"
                            v-show="showingTooltip === part"
                        >
                            <p>
                                Min.:
                                <b>{{ entry.range[part.slice(1, -1)]?.min }}</b>
                            </p>
                            <p>
                                Max.:
                                <b>{{ entry.range[part.slice(1, -1)]?.max }}</b>
                            </p>
                        </div>
                    </div>
                </template>
                <!-- Render text parts (if it's not a placeholder) -->
                <template v-else>
                    <span>{{ part }}</span>
                </template>
            </template>
        </div>

        <!-- If no template exists, fallback to string -->
        <p v-else>{{ entry.string }}</p>
    </div>
</template>
