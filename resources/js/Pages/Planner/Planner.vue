<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { computed, onMounted } from "vue";
import CharacterInputs from "./Partials/CharacterInputs.vue";
import SideTabs from "./Partials/SideTabs.vue";
import MainTabs from "./Partials/MainTabs.vue";
import { useSkillStore } from "@/Stores/SkillStore";
import StatSummary from "./Partials/StatSummary.vue";
import SelectInputComplex from "@/Components/SelectInputComplex.vue";

const props = defineProps({
    debug: {
        type: Boolean,
        default: false,
    },
});

const skillStore = useSkillStore();
const characterStore = useCharacterStore();
const isLoading = computed(() => characterStore.loading); // Get loading state
const hasClassData = computed(
    () => characterStore.character.classData.name ?? null
);

const skill = computed(() => skillStore.selectedSkill);
const availableSkills = computed(() => {
    return skillStore.getAvailableSkills.map((skill) => {
        return {
            label: skill.description.name,
            value: skill,
        };
    });
});
const handleSkillSelected = (skill) => {
    if (skill) {
        skillStore.selectedSkill = skill;
    }
};

onMounted(() => {
    characterStore.fetchCharacterClasses();
    characterStore.initStatWatcher();
    skillStore.initWatchers();
});
</script>

<template>
    <AppLayout title="Planner" wide>
        <div v-if="isLoading">
            <!-- Show loading screen -->
            <p>Loading...</p>
        </div>
        <div v-else>
            <div v-if="characterStore.error" class="text-red-500">
                {{ characterStore.error }}
            </div>

            <div class="flex space-x-8">
                <div class="w-[320px] shrink-0">
                    <CharacterInputs />
                    <SideTabs class="mt-2" />
                </div>

                <div class="flex-1 flex space-x-6">
                    <MainTabs :has-class-data="hasClassData" />
                </div>

                <div class="w-[196px]">
                    <!-- Main skill -->
                    <div class="mb-4">
                        <SelectInputComplex
                            :model-value="skill"
                            :options="availableSkills"
                            @update:model-value="handleSkillSelected"
                        />
                        <p class="text-xs mt-1 text-zinc-500 text-center">
                            Main skill
                        </p>
                    </div>

                    <!-- Stat summary -->
                    <StatSummary />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
