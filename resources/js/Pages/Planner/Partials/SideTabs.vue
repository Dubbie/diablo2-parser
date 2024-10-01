<script setup>
import TabContainer from "@/Components/TabContainer.vue";
import { ref } from "vue";
import CharacterInventory from "./CharacterInventory.vue";
import CharacterAttributes from "./CharacterAttributes.vue";

const sideTabs = [
    {
        name: "inventory",
        label: "Inventory",
    },
    {
        name: "attributes",
        label: "Attributes",
    },
];

const activeTab = ref(sideTabs[0].name);
</script>

<template>
    <div>
        <TabContainer
            :tabs="sideTabs"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
        />

        <div class="mt-2">
            <CharacterInventory v-if="activeTab === 'inventory'" />
            <CharacterAttributes v-if="activeTab === 'attributes'" />
        </div>
    </div>
</template>
