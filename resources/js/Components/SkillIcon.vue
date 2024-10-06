<script setup>
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useSkillStore } from "@/Stores/SkillStore";
import { computed, nextTick, ref, watch } from "vue";

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

const skillStore = useSkillStore();
const showingTooltip = ref(false);
const tooltip = ref(null);
const icon = ref(null);
const skillContext = computed(() =>
    skillStore.getSkillContext(props.skill.name)
);

const emit = defineEmits(["click"]);

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

const currentLevelLabel = computed(() => {
    if (skillContext.value.lvl() === 0) {
        return "First Level";
    }

    return `Current Skill Level: ${skillContext.value.lvl()}`;
});

// Adjust tooltip position
const adjustTooltipPosition = () => {
    if (tooltip.value && icon.value) {
        // Reset tooltip
        const tooltipRect = tooltip.value.getBoundingClientRect();
        const iconRect = icon.value.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const marginBelowIcon = 15;

        // Calculate available space below and above the icon
        const spaceBelow = viewportHeight - iconRect.bottom;

        // Initialize tooltip position
        let tooltipTop;
        let tooltipLeft;

        // Calculate the tooltip top position based on space
        if (spaceBelow >= tooltipRect.height + marginBelowIcon) {
            // Case 1: Tooltip fits below the icon
            tooltipTop = iconRect.height + marginBelowIcon;
        } else {
            // Case 3: No space available either above or below
            const iconPlusTooltipHeight =
                iconRect.height + marginBelowIcon + tooltipRect.height;
            const withIconTop = iconRect.top + iconPlusTooltipHeight;
            const moveUp = withIconTop - viewportHeight;
            tooltipTop = -1 * moveUp + iconRect.height + marginBelowIcon;
        }

        // Center the tooltip horizontally relative to the container
        tooltipLeft = iconRect.width / 2;

        // Adjust the position and set styles
        tooltip.value.style.top = `${tooltipTop}px`;
        tooltip.value.style.left = `${tooltipLeft}px`;
    }
};

// Trigger tooltip positioning when visible or skill changes
const updateTooltip = () => {
    nextTick(() => {
        adjustTooltipPosition(); // Ensure DOM is ready
    });
};

// Update tooltip position when hovering
const showTooltip = () => {
    showingTooltip.value = true;
    updateTooltip();
};

const hideTooltip = () => {
    showingTooltip.value = false;
};

const handleClick = (event) => {
    emit("click", event);
    updateTooltip();
};

watch(
    () => props.skill,
    () => {
        if (showingTooltip.value) {
            updateTooltip();
        }
    }
);
</script>

<template>
    <div>
        <div class="relative">
            <div class="bg-black relative group">
                <img
                    ref="icon"
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
                    @mouseenter="showTooltip"
                    @mouseleave="hideTooltip"
                    @click="handleClick"
                />
            </div>

            <p
                class="select-none absolute inline-flex items-center justify-center top-full left-full -translate-y-[5px] -translate-x-1 rounded-md text-xs font-semibold bg-black/40 text-center size-5"
                :class="{
                    'text-transparent': skillContext.lvl() === 0,
                    'text-blue-400': skillContext.lvl() !== skillContext.blvl(),
                }"
            >
                {{ skillContext.lvl() }}
            </p>

            <div
                ref="tooltip"
                class="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur z-10 p-2 text-center text-sm whitespace-nowrap"
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

                    <div class="space-y-3 mt-3">
                        <div v-if="skill?.descriptionLines?.details?.length">
                            <p
                                v-for="line in skill.descriptionLines.details"
                                :key="line"
                                v-html="line"
                            ></p>
                        </div>

                        <div v-if="skill?.descriptionLines?.current?.length">
                            <p>{{ currentLevelLabel }}</p>
                            <p
                                v-for="line in skill.descriptionLines.current"
                                :key="line"
                                v-html="line"
                            ></p>
                        </div>

                        <div v-if="skill?.descriptionLines?.next?.length">
                            <p>Next Level:</p>
                            <p
                                v-for="line in skill.descriptionLines.next"
                                :key="line"
                                v-html="line"
                            ></p>
                        </div>

                        <div v-if="skill?.descriptionLines?.synergies?.length">
                            <p
                                v-for="line in skill.descriptionLines.synergies"
                                :key="line"
                                v-html="line"
                            ></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
