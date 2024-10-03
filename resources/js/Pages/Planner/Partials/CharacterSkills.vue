<script setup>
import SkillIcon from "@/Components/SkillIcon.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useSkillStore } from "@/Stores/SkillStore";
import { computed, watch } from "vue";

const skillStore = useSkillStore();
const characterStore = useCharacterStore();

// Group skills by page and ensure valid page numbers
const skillPages = computed(() => {
    const pages = { 1: [], 2: [], 3: [] }; // Ensure we always have 3 pages
    skillStore.skills.forEach((skill) => {
        const page = skill.description.page;
        if (
            page >= 1 &&
            page <= 3 &&
            skill.description.skill_column > 0 &&
            skill.description.skill_row > 0
        ) {
            console.log(`"Adding ${skill.description.name} to Page: ${page}"`);

            pages[page].push(skill);
        }
    });
    return pages;
});

const cols = 3;
const rows = 6;
const size = 48;
const gap = 10; // Add a gap of 10px between icons
const padding = 20;

const maxWidth = computed(() => {
    return size * cols + gap * (cols - 1) + padding * 2 + "px";
});

const maxHeight = computed(() => {
    return size * rows + gap * (rows - 1) + padding * 2 + "px";
});

watch(
    () => characterStore.character.classData.name,
    () => {
        skillStore.fetchSkills();
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div class="flex items-start space-x-3">
        <!-- Loop through each skill page (ensure pages 1, 2, 3 are always rendered) -->
        <div
            v-for="(pageSkills, pageIndex) in [1, 2, 3]"
            :key="pageIndex"
            class="relative bg-zinc-800 rounded-xl p-5 ring-1 ring-white/15"
            :style="{
                width: maxWidth,
                height: maxHeight,
            }"
        >
            <!-- Loop through skills on each page -->
            <SkillIcon
                v-for="skill in skillPages[pageSkills]"
                :key="skill.id"
                :skill="skill"
                class="absolute"
                :style="{
                    top: `${
                        (skill.description.skill_row - 1) * (size + gap) +
                        padding
                    }px`,
                    left: `${
                        (skill.description.skill_column - 1) * (size + gap) +
                        padding
                    }px`,
                }"
                :size="size"
            />
        </div>
    </div>
</template>
