<script setup>
import { ref, watch, onMounted } from "vue";

// Define props with validation for model, min, max, and type
const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true,
    },
    min: {
        type: Number,
        default: null,
    },
    max: {
        type: Number,
        default: null,
    },
    type: {
        type: String,
        default: "text", // Default to text input
    },
});

// Create a local ref for the input
const inputValue = ref(props.modelValue); // Initialize with the model value
const input = ref(null);

// Emit event to update model value
const emit = defineEmits(["update:modelValue"]);

// Sync the modelValue prop to local inputValue when it changes
watch(
    () => props.modelValue,
    (newValue) => {
        inputValue.value = newValue;
    }
);

// Function to handle input event
const handleInput = (event) => {
    const value = event.target.value;

    // Update the local input value
    inputValue.value = value; // Set it as the current value

    // Handle numeric input specifically
    if (props.type === "number") {
        // Allow empty input but parse numeric value only if not empty
        const numericValue = value === "" ? null : parseFloat(value);

        // Check if the new value is valid (not empty and within the min and max range)
        const isWithinRange =
            numericValue !== null &&
            (props.min === null || numericValue >= props.min) &&
            (props.max === null || numericValue <= props.max);

        // Emit the value only if it's a valid number within the specified range
        if (isWithinRange) {
            emit("update:modelValue", numericValue);
        }
    } else {
        // For text input, emit the value directly (and only if it's not empty)
        if (value.trim() !== "") {
            emit("update:modelValue", value);
        }
    }
};

// Optional: Focus the input on mount if it has autofocus
onMounted(() => {
    if (input.value.hasAttribute("autofocus")) {
        input.value.focus();
    }
});
</script>

<template>
    <input
        class="bg-white/5 px-4 border-none focus:ring-inset focus:ring-2 focus:ring-indigo-500"
        v-model="inputValue"
        :type="type"
        ref="input"
        @input="handleInput"
    />
</template>
