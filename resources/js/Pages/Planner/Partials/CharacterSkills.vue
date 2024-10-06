<script setup>
import SkillIcon from "@/Components/SkillIcon.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useSettingsStore } from "@/Stores/SettingsStore";
import { useSkillStore } from "@/Stores/SkillStore";
import { computed, watch } from "vue";

const skillStore = useSkillStore();
const characterStore = useCharacterStore();
const settingsStore = useSettingsStore();

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
            pages[page].push(skill);
        }
    });
    return pages;
});

const theme = computed(() => settingsStore.theme);
const cols = 3;
const rows = 6;
const size = 48;
const gap = 20; // Add a gap of 10px between icons
const padding = 14;

const maxWidth = computed(() => {
    return size * cols + gap * (cols - 1) + padding * 3 + "px";
});

const maxHeight = computed(() => {
    return size * rows + gap * (rows - 1) + padding * 3 + "px";
});

const handleRightClick = (event, skill) => {
    event.preventDefault();

    if (event.ctrlKey) {
        skillStore.removeLevel(skill, skill.base_level); // Remove all points if shift is pressed
    } else {
        skillStore.removeLevel(skill, 1); // Remove 1 point on normal right-click
    }
};

const shortClassName = computed(() => {
    return {
        Barbarian: "bar",
        Amazon: "ama",
        Druid: "dru",
        Necromancer: "nec",
        Paladin: "pal",
        Sorceress: "sor",
        Assassin: "ass",
    }[characterStore.character.classData.name];
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

const getBgImage = (page) => {
    return {
        lod: `url(/img/pages/${shortClassName.value}/${page}.png)`,
        minimalistic: null,
    }[theme.value];
};
</script>

<template>
    <div class="flex items-start gap-x-1">
        <div
            v-for="(pageSkills, pageIndex) in [3, 2, 1]"
            :key="pageIndex"
            class="relative bg-zinc-800 rounded-xl p-5"
            :style="{
                width: maxWidth,
                height: maxHeight,
            }"
        >
            <div
                class="absolute inset-0"
                :style="{
                    backgroundImage: getBgImage(pageSkills),
                }"
            ></div>

            <!-- Loop through skills on each page -->
            <SkillIcon
                v-for="skill in skillPages[pageSkills]"
                :key="skill.id"
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
                :skill="skill"
                :size="size"
                :is-allocatable="skillStore.isAllocatable(skill)"
                :is-usable="skillStore.isUsable(skill)"
                @click="skillStore.addLevel(skill, 1)"
                @click.ctrl="
                    skillStore.addLevel(
                        skill,
                        skill.max_level - skill.base_level
                    )
                "
                @click.right.prevent="handleRightClick($event, skill)"
            />
        </div>
    </div>
</template>
