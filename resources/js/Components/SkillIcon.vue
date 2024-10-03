<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    skill: {
        type: Object,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
});

const showingTooltip = ref(false);

// Computed property to format the skill description
const formattedDescription = computed(() => {
    // Split by "\n", reverse the array, and join with "<br />"
    const reversedDescription = props.skill.description.long
        .split("\\n")
        .reverse()
        .join("<br />");

    // Capitalize the first character
    return (
        reversedDescription.charAt(0).toUpperCase() +
        reversedDescription.slice(1)
    );
});
</script>

<template>
    <div>
        <div class="relative">
            <img
                :src="`/img/skills/${skill.description.icon_usable}`"
                :alt="skill.description.name"
                class="block"
                :style="{
                    width: `${size}px`,
                    height: `${size}px`,
                }"
                @mouseenter="showingTooltip = true"
                @mouseleave="showingTooltip = false"
            />

            <div
                class="absolute top-full left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur z-10 p-2 text-center text-sm whitespace-nowrap"
                v-show="showingTooltip"
            >
                <p class="mb-2 text-lime-400">{{ skill.description.name }}</p>

                <div class="text-xs">
                    <p v-html="formattedDescription"></p>

                    <p
                        v-for="dsc2 in skill.description.lines.filter(
                            (dsc) => dsc.type === 2
                        )"
                    >
                        {{ dsc2.formatted }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
