<script setup>
import { useCharacterStore } from "@/Stores/CharacterStore";
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
    isAllocatable: {
        type: Boolean,
        required: true,
    },
    isUsable: {
        type: Boolean,
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

const imageSrc = computed(() => {
    return `/img/skills/${props.skill.description.icon_usable}`;
});
</script>

<template>
    <div>
        <div class="relative">
            <div class="bg-black relative group">
                <img
                    :src="imageSrc"
                    :alt="skill.description.name"
                    class="relative block"
                    :style="{
                        width: `${size}px`,
                        height: `${size}px`,
                    }"
                    :class="{
                        'opacity-50': !isAllocatable && !isUsable,
                    }"
                    @mouseenter="showingTooltip = true"
                    @mouseleave="showingTooltip = false"
                />
            </div>

            <p
                class="select-none absolute inline-flex items-center justify-center top-full left-full -translate-y-2 -translate-x-1 rounded-md text-xs font-semibold bg-black/40 text-center size-5"
                :class="{
                    'text-transparent': skill.level === 0,
                }"
            >
                {{ skill.level }}
            </p>

            <div
                class="absolute top-full left-1/2 translate-y-3 -translate-x-1/2 bg-black/80 backdrop-blur z-10 p-2 text-center text-sm whitespace-nowrap"
                v-show="showingTooltip"
            >
                <p class="mb-2 text-lime-400">{{ skill.description.name }}</p>

                <div class="text-xs">
                    <p v-html="formattedDescription"></p>
                    <p
                        v-if="
                            skill.required_level_accr >
                            useCharacterStore().character.level
                        "
                    >
                        Required Level: {{ skill.required_level_accr }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
