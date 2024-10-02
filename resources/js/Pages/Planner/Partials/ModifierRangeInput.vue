<script setup>
import { ref, computed, watch } from "vue";

// Define emits
const emit = defineEmits(["update:entry"]);

// Function to emit updated values
const emitUpdate = () => {
    emit("update:entry", {
        index: props.index,
        values: values.value,
    });
};

// Define props
const props = defineProps({
    entry: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
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
    const regex = /\[value\]|\[perLevel\]|\[minValue\]|\[maxValue\]/g;
    return [...template.matchAll(regex)].map((match) => match[0]);
};

// Initialize values based on placeholders and ranges
const initValues = () => {
    if (!props.entry.template) return; // Ensure the template exists before proceeding
    const placeholders = getPlaceholders(props.entry.template);
    const initialValues = {};

    placeholders.forEach((placeholder) => {
        const key = placeholder.slice(1, -1); // Remove brackets
        const range = props.entry.range[key];

        // Check if value exists for this
        if (props.entry.values[key]) {
            initialValues[key] = props.entry.values[key];
        } else {
            initialValues[key] = range?.max ?? null;
        }
    });

    // Handle min value
    if (
        props.entry.range.minValue &&
        !initialValues.minValue &&
        props.entry.range.minValue.min === props.entry.range.minValue.max
    ) {
        initialValues.minValue = props.entry.range.minValue.min;
    }

    // Handle max value
    if (
        props.entry.range.maxValue &&
        !initialValues.maxValue &&
        props.entry.range.maxValue.min === props.entry.range.maxValue.max
    ) {
        initialValues.maxValue = props.entry.range.maxValue.min;
    }

    // If a value is already set in props.entry.values, use that as the initial value
    if (props.entry.values.value) {
        initialValues.value = props.entry.values.value;
    }

    // If per level is there, add it
    if (props.entry.values.perLevel) {
        initialValues.perLevel = props.entry.values.perLevel;
    }

    values.value = initialValues;

    emitUpdate();
};

// Function to handle focus
const handleFocus = (key) => {
    showingTooltip.value = key;
};

// Function to handle blur
const handleBlur = (placeholder) => {
    showingTooltip.value = null;

    if (isValueCorrect(placeholder)) {
        emitUpdate();
    } else {
        values.value[placeholder.slice(1, -1)] =
            props.entry.range[placeholder.slice(1, -1)].max;
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

// Function to get the correct ring class
const getRingClass = (placeholder) => {
    if (!isValueCorrect(placeholder)) {
        return "focus:ring-red-500";
    } else {
        return "ring-white/10 focus:ring-blue-500";
    }
};

// Function to handle new input
const handleNewInput = (key, value) => {
    values.value[key] = value;
};

// Computed property to break the template into text and placeholder parts
const templateParts = computed(() => {
    return props.entry.template.split(
        /(\[value\]|\[perLevel\]|\[minValue\]|\[maxValue\])/
    );
});

// Watch for changes in the entry prop to update local values
watch(
    () => props.entry,
    (newEntry) => {
        initValues(); // Re-initialize values if entry prop changes
    },
    { immediate: true }
);
</script>

<template>
    <div>
        <div v-if="entry.template" class="flex items-baseline space-x-1">
            <template v-for="(part, index) in templateParts" :key="index">
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
                            :value="values[part.slice(1, -1)]"
                            class="max-w-10 px-0 py-0.5 rounded-lg border-none bg-white/5 text-center ring-2 ring-inset focus:ring-inset focus:ring-2"
                            :class="getRingClass(part)"
                            @focus="handleFocus(part)"
                            @blur="handleBlur(part)"
                            @input="
                                handleNewInput(
                                    part.slice(1, -1),
                                    $event.target.value
                                )
                            "
                        />

                        <!-- Tooltip for showing range -->
                        <transition
                            enter-active-class="transition ease-out duration-200"
                            enter-from-class="will-change-transform -translate-x-2 opacity-0"
                            enter-to-class="will-change-auto translate-x-0 opacity-100"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="will-change-transform translate-x-0 opacity-100"
                            leave-to-class="will-change-auto -translate-x-2 opacity-0"
                        >
                            <div
                                class="absolute top-1/2 -translate-y-1/2 left-full ml-0.5 bg-black/70 backdrop-blur-md p-2 whitespace-nowrap text-sm rounded-lg shadow-lg z-50"
                                v-show="showingTooltip === part"
                            >
                                <p
                                    class="text-xs text-zinc-400 font-semibold mb-1"
                                >
                                    Range
                                </p>
                                <p>
                                    <span class="font-bold">{{
                                        entry.range[part.slice(1, -1)]?.min
                                    }}</span>
                                    <span class="mx-1 text-zinc-400">-</span>
                                    <span class="font-bold">{{
                                        entry.range[part.slice(1, -1)]?.max
                                    }}</span>
                                </p>
                            </div>
                        </transition>
                    </div>
                </template>
                <template v-else>
                    <span>{{ part }}</span>
                </template>
            </template>
        </div>

        <p v-else>{{ entry.string }}</p>
    </div>
</template>
