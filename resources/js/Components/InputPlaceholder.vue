<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["update:entry"]);

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
        const key = placeholder.slice(1, -1);
        const range = props.entry.range[key]; // Remove brackets for range lookup
        // Use the max value as the default initial value
        initialValues[key] = range?.max ?? null;
    });

    // Check if the entry has either minValue or maxValue but not both
    if (
        props.entry.range.minValue &&
        props.entry.range.minValue["min"] ===
            props.entry.range.minValue["max"] &&
        !initialValues.minValue
    ) {
        initialValues.minValue = props.entry.range.minValue["min"];
    } else if (
        props.entry.range.maxValue &&
        props.entry.range.maxValue["min"] ===
            props.entry.range.maxValue["max"] &&
        !initialValues.maxValue
    ) {
        initialValues.maxValue = props.entry.range.maxValue["min"];
    }

    values.value = initialValues;

    emit("update:entry", {
        name: props.entry.name,
        values: values.value,
    });
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

// Function to handle focus
const handleFocus = (key) => {
    showingTooltip.value = key;
};

// Function to handle blur
const handleBlur = (placeholder) => {
    showingTooltip.value = null;

    if (isValueCorrect(placeholder)) {
        emit("update:entry", {
            name: props.entry.name,
            values: values.value,
        });
    } else {
        values.value[placeholder.slice(1, -1)] =
            props.entry.range[placeholder.slice(1, -1)].max;
    }
};

// Function to get the correct ring class
const getRingClass = (placeholder) => {
    if (!isValueCorrect(placeholder)) {
        return "focus:ring-red-500";
    } else {
        return "ring-white/10 focus:ring-blue-500";
    }
};

// Function to check if the value is correct
const isValueCorrect = (placeholder) => {
    const key = placeholder.slice(1, -1);

    if (!props.entry.range[key]) {
        return true;
    }

    return (
        parseInt(values.value[key]) >= parseInt(props.entry.range[key].min) &&
        parseInt(values.value[key]) <= parseInt(props.entry.range[key].max)
    );
};

// Function to handle new input
const handleNewInput = (key, value) => {
    values.value[key] = value;
};
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
                            class="max-w-10 px-0 py-0.5 rounded-lg border-none bg-white/5 text-center text-sm ring-2 ring-inset focus:ring-inset focus:ring-2"
                            :class="getRingClass(part)"
                            v-model="values[part.slice(1, -1)]"
                            @focus="handleFocus(part)"
                            @blur="handleBlur(part)"
                            @input="handleNewInput(part, $event.target.value)"
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
