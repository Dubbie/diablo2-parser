<script setup>
import NavLink from "./NavLink.vue";
import AppButton from "./AppButton.vue";
import PlannerSettingsModal from "./PlannerSettingsModal.vue";
import { ref } from "vue";
import { IconSettingsFilled } from "@tabler/icons-vue";

const showingSettingsModal = ref(false);
</script>

<template>
    <div class="flex items-center space-x-12">
        <p class="font-bold">
            <span>SanctaryForge</span>
            <span class="ml-1 bg-blue-500 text-xs px-1.5 rounded-md">v2</span>
        </p>

        <div class="flex-1 flex items-center space-x-2 -mx-2">
            <NavLink
                :href="route('planner')"
                :active="route().current('planner')"
                >Planner</NavLink
            >
            <NavLink
                :href="route('items.index')"
                :active="route().current('items.index')"
                >Items</NavLink
            >
        </div>

        <div>
            <div>
                <AppButton plain square @click="showSettingsModal = true">
                    <IconSettingsFilled class="size-5" />
                </AppButton>
            </div>
        </div>

        <PlannerSettingsModal
            :show="showSettingsModal"
            @close="showSettingsModal = false"
        />
    </div>
</template>
