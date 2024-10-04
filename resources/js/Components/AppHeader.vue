<script setup>
import { computed } from "vue";
import NavLink from "./NavLink.vue";
import SelectInput from "./SelectInput.vue";
import { useSettingsStore } from "@/Stores/SettingsStore";

const settingsStore = useSettingsStore();
settingsStore.getTheme();

const theme = computed(() => settingsStore.theme);
const loading = computed(() => settingsStore.loading);

const handleNewTheme = async (value) => {
    settingsStore.setTheme(value);
};
</script>

<template>
    <div class="flex items-center space-x-12">
        <p class="font-bold">
            <span>SanctaryForge</span>
            <span class="ml-1 bg-blue-500 text-xs px-1.5 rounded-md">v2</span>
        </p>

        <div class="flex-1 flex items-center space-x-2 -mx-2">
            <NavLink
                :href="route('items.index')"
                :active="route().current('items.index')"
                >Items</NavLink
            >
            <NavLink
                :href="route('planner')"
                :active="route().current('planner')"
                >Planner</NavLink
            >
        </div>

        <div>
            <div>
                <p class="text-xs font-semibold text-right mb-1">Theme</p>
                <SelectInput
                    :model-value="theme"
                    :options="settingsStore.getThemes()"
                    :class="{
                        'pointer-events-none opacity-50': loading,
                    }"
                    dropdown-position="right"
                    @update:model-value="handleNewTheme"
                />
            </div>
        </div>
    </div>
</template>
