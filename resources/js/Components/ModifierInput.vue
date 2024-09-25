<script setup>
import { computed, ref, onMounted } from "vue";

const props = defineProps({
    modifier: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    triggerOnMount: {
        type: Boolean,
        default: false,
    },
});

const getDefaultValue = () => {
    if (props.modifier.values.length === 1) {
        return props.modifier.values[0];
    }

    return props.modifier.max ? props.modifier.max.toString() : "";
};

const modelValue = ref(getDefaultValue());
const showingRangeTooltip = ref(false);
const emit = defineEmits(["update:modifier", "highlight", "unhighlight"]);

// Function to process each string
const processString = (input) => {
    // Check for brackets in the string
    if (!input.includes("[")) {
        return [input]; // Return original string if no brackets
    }

    // Split the string based on the occurrence of '[range]'
    const parts = input.split(/(\[range\])/);

    // Trim parts and filter out empty strings
    const trimmedParts = parts.map((part) => part.trim()).filter(Boolean);

    // Combine parts directly into result
    const result = [];
    for (const part of trimmedParts) {
        if (part === "[range]") {
            result.push(part); // Add range to the result
        } else {
            // Append or push part based on the last element
            if (
                result.length > 0 &&
                !result[result.length - 1].includes("[range]")
            ) {
                result[result.length - 1] += " " + part; // Append to the last part
            } else {
                result.push(part); // Push as a new part
            }
        }
    }

    return result.map((part) => part.replace(/\s+/g, " ").trim());
};

// Reactive variable to hold the processed parts
const processedParts = ref(processString(props.modifier.template));

const isIncorrect = computed(() => {
    if (!props.modifier.range) {
        return false;
    }

    return (
        modelValue.value === "" ||
        (parseInt(modelValue.value) && parseInt(modelValue.value)) <
            props.modifier.range.min ||
        (parseInt(modelValue.value) && parseInt(modelValue.value)) >
            props.modifier.range.max
    );
});

const focusRingClasses = computed(() => {
    if (isIncorrect.value) {
        return "focus:ring-red-500";
    } else {
        return "focus:ring-blue-500";
    }
});

const handleUpdate = (newValue) => {
    modelValue.value = newValue;

    if (!isIncorrect.value) {
        emit("update:modifier", {
            index: props.index,
            value: newValue,
        });
    }
};

const handleFocus = () => {
    showingRangeTooltip.value = true;

    emit("highlight", props.index);
};

const handleBlur = () => {
    showingRangeTooltip.value = false;

    if (isIncorrect.value) {
        handleUpdate(getDefaultValue());
    }

    emit("unhighlight", props.index);
};

const maxWidth = computed(() => {
    if (props.modifier?.range?.max) {
        return props.modifier.range.max.toString().length + 1 + "ch";
    }
});

onMounted(() => {
    if (props.triggerOnMount) {
        handleUpdate(modelValue.value);
    }
});
</script>

<template>
    <div class="flex space-x-1 items-center">
        <template v-if="processedParts.includes('[range]')">
            <template v-for="part in processedParts" :key="part">
                <p v-if="part !== '[range]'">{{ part }}</p>
                <div v-else class="relative">
                    <input
                        :value="modelValue"
                        type="number"
                        class="text-center text-sm py-0.5 px-0 bg-white/5 border-none ring-1 ring-white/15"
                        :class="focusRingClasses"
                        :style="{ width: maxWidth }"
                        :min="modifier.min"
                        :max="modifier.max"
                        @focus="handleFocus"
                        @blur="handleBlur"
                        @input="handleUpdate($event.target.value)"
                    />

                    <div
                        class="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur p-2 whitespace-nowrap"
                        v-show="showingRangeTooltip"
                    >
                        <p class="text-xs text-zinc-400">Range</p>
                        <p class="font-bold text-sm">
                            {{ modifier.min }} - {{ modifier.max }}
                        </p>
                    </div>
                </div>
            </template>
        </template>
        <template v-else>
            <p>{{ modifier.label }}</p>
        </template>
    </div>
</template>
