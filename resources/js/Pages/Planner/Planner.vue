<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { computed, onMounted } from "vue";
import CharacterInputs from "./Partials/CharacterInputs.vue";
import SideTabs from "./Partials/SideTabs.vue";

const props = defineProps({
    debug: {
        type: Boolean,
        default: false,
    },
});

const characterStore = useCharacterStore();
const isLoading = computed(() => characterStore.loading); // Get loading state
const selectedClass = computed(() => characterStore.character.classData);

onMounted(() => {
    characterStore.fetchCharacterClasses();
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

            <div class="grid grid-cols-4 gap-6">
                <div>
                    <CharacterInputs />
                    <SideTabs class="mt-2" />
                </div>

                <div class="col-span-2">
                    <p>Main view here</p>
                    <p>{{ selectedClass }}</p>
                </div>

                <div>
                    <p>Stats here</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
