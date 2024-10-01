<script setup>
import TabContainer from "@/Components/TabContainer.vue";
import PlannerEquipment from "./PlannerEquipment.vue";
import { inject } from "vue";
import PlannerSkills from "./PlannerSkills.vue";

const props = defineProps({
    plannerState: {
        type: Object,
        required: true,
    },
});

const tabs = [
    {
        name: "equipment",
        label: "Equipment",
    },
    {
        name: "skills",
        label: "Skills",
    },
];

const emitter = inject("emitter");
</script>

<template>
    <div class="flex-1">
        <TabContainer
            :tabs="tabs"
            :active-tab="plannerState.showingMainTab"
            class="mb-3"
            @update:active-tab="emitter.emit('change-main-tab', $event)"
        />

        <div>
            <PlannerEquipment
                :planner-state="plannerState"
                v-show="plannerState.showingMainTab === 'equipment'"
            />
            <PlannerSkills
                :planner-state="plannerState"
                v-show="plannerState.showingMainTab === 'skills'"
            />
        </div>
    </div>
</template>
