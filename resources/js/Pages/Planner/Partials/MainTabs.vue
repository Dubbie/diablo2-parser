<script setup>
import ItemFinder from "@/Components/ItemFinder.vue";
import StatSummary from "./StatSummary.vue";
import CharacterSkills from "./CharacterSkills.vue";
import TabContainer from "@/Components/TabContainer.vue";
import { useItemStore } from "@/Stores/ItemStore";
import { computed, ref, watch } from "vue";

const itemStore = useItemStore();
const slot = computed(() => itemStore.slot);

const props = defineProps({
    filter: {
        type: Object,
        required: true,
    },
    hasClassData: String,
});

const mainTabs = [
    {
        name: "equipment",
        label: "Equipment",
    },
    {
        name: "skills",
        label: "Skills",
    },
];

const activeTab = ref(mainTabs[0].name);

watch(
    () => slot.value,
    () => {
        if (slot.value) {
            activeTab.value = "equipment";
        }
    }
);
</script>

<template>
    <div class="flex-1">
        <TabContainer
            :tabs="mainTabs"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
        />

        <div class="mt-3">
            <div v-show="activeTab === 'equipment'" class="flex space-x-6">
                <div class="flex-1">
                    <ItemFinder :filter="filter" />
                </div>
                <div class="min-w-[180px] text-sm">
                    <StatSummary />
                </div>
            </div>

            <div v-show="activeTab === 'skills'">
                <CharacterSkills v-if="hasClassData" />
            </div>
        </div>
    </div>
</template>
