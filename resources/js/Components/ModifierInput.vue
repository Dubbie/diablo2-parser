<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    modifier: {
        type: Object,
        required: true,
    },
});

const value = ref(props.modifier.max ? props.modifier.max.toString() : "");
const showingRangeTooltip = ref(false);

// Function to process each string
const processString = (input) => {
    // Check for brackets in the string
    if (!input.includes("[")) {
        return [input]; // Return original string if no brackets
    }

    // Replace the contents inside the brackets with "[range]"
    const replaced = input.replace(/\[[^\]]*\]/g, "[range]");

    // Split the string based on the occurrence of '[range]'
    const parts = replaced.split(/(\[range\])/);

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
const processedParts = ref(processString(props.modifier.label));
</script>

<template>
    <div class="flex space-x-1 items-center">
        <template v-for="part in processedParts" :key="part">
            <p v-if="part !== '[range]'">{{ part }}</p>
            <div v-else class="relative">
                <input
                    v-model="value"
                    type="tel"
                    class="w-12 text-center text-sm py-1 px-2 bg-white/5 border-none"
                    :min="modifier.min"
                    :max="modifier.max"
                    @focus="showingRangeTooltip = true"
                    @blur="showingRangeTooltip = false"
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
    </div>
</template>
