<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { computed, onMounted, reactive } from "vue";
import CharacterInputs from "./Partials/CharacterInputs.vue";
import SideTabs from "./Partials/SideTabs.vue";
import ItemFinder from "@/Components/ItemFinder.vue";
import StatSummary from "./Partials/StatSummary.vue";
import CharacterSkills from "./Partials/CharacterSkills.vue";

const props = defineProps({
    debug: {
        type: Boolean,
        default: false,
    },
});

const filter = reactive({
    slot: null,
    templates: true,
});

const characterStore = useCharacterStore();
const isLoading = computed(() => characterStore.loading); // Get loading state
const hasClassData = computed(
    () => characterStore.character.classData.name ?? null
);

onMounted(() => {
    characterStore.fetchCharacterClasses();
    characterStore.initStatWatcher();
});
</script>

<template>
    <AppLayout title="Planner" wide>
        <h1 class="font-bold text-3xl">Planner</h1>
        <p class="text-zinc-400 text-sm mb-6">
            Play around with the planner to find the best items for your.
        </p>

        <div v-if="isLoading">
            <!-- Show loading screen -->
            <p>Loading...</p>
        </div>
        <div v-else>
            <div v-if="characterStore.error" class="text-red-500">
                {{ characterStore.error }}
            </div>

            <div class="flex space-x-4">
                <div class="w-[320px]">
                    <CharacterInputs />
                    <SideTabs class="mt-2" />
                </div>

                <div class="flex-1 flex space-x-6">
                    <!-- <div class="flex-1">
                        <ItemFinder :filter="filter" />
                    </div> -->

                    <CharacterSkills v-if="hasClassData" />
                </div>

                <div class="min-w-[180px] text-sm">
                    <StatSummary />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
