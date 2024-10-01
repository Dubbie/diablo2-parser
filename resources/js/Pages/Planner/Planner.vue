<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { useStatCalculationStore } from "@/Stores/StatCalculationStore";
import { computed, onMounted, reactive } from "vue";
import CharacterInputs from "./Partials/CharacterInputs.vue";
import SideTabs from "./Partials/SideTabs.vue";
import ItemFinder from "@/Components/ItemFinder.vue";

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
const statCalculationStore = useStatCalculationStore();
const isLoading = computed(() => characterStore.loading); // Get loading state

const calculatedStats = computed(() => statCalculationStore);

onMounted(() => {
    characterStore.fetchCharacterClasses();
    // statCalculationStore.calculateFinalStrength();

    // Watch
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
                <div class="min-w-[320px]">
                    <CharacterInputs />
                    <SideTabs class="mt-2" />
                </div>

                <div class="flex-1">
                    <ItemFinder :filter="filter" />
                </div>

                <div class="min-w-[200px]">
                    <p class="font-bold mb-1">Attributes:</p>
                    <p>Strength: {{ calculatedStats.attributes.strength }}</p>
                    <p>Dexterity: {{ calculatedStats.attributes.dexterity }}</p>
                    <p>Vitality: {{ calculatedStats.attributes.vitality }}</p>
                    <p>Energy: {{ calculatedStats.attributes.energy }}</p>

                    <p class="font-bold mt-3 mb-1">Resistances:</p>
                    <p>Fire: {{ calculatedStats.resistances.fire }}%</p>
                    <p>Cold: {{ calculatedStats.resistances.cold }}%</p>
                    <p>
                        Lightning: {{ calculatedStats.resistances.lightning }}%
                    </p>
                    <p>Poison: {{ calculatedStats.resistances.poison }}%</p>
                    <p>Curse: {{ calculatedStats.resistances.curse }}%</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
