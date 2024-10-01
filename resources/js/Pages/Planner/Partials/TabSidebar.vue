<script setup>
import CharacterAttributes from "@/Components/Planner/CharacterAttributes.vue";
import CharacterInventory from "@/Components/Planner/CharacterInventory.vue";
import { inject } from "vue";

const props = defineProps({
    plannerState: {
        type: Object,
        required: true,
    },
});

const emitter = inject("emitter");
</script>

<template>
    <div>
        <CharacterInventory
            v-show="plannerState.showingSideTab === 'inventory'"
            :filter="plannerState.filter"
            :slots="plannerState.pdollSlots"
            @unequip-item="emitter.emit('unequip-item', $event)"
            @set-filter="emitter.emit('set-filter', $event)"
            @reset-items="emitter.emit('reset-items')"
        />

        <CharacterAttributes
            v-show="plannerState.showingSideTab === 'attributes'"
        />
    </div>
</template>
