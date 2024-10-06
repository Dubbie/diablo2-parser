<script setup>
import { computed } from "vue";
import Modal from "./Modal.vue";
import SelectInput from "./SelectInput.vue";
import { useSettingsStore } from "@/Stores/SettingsStore";
import AppButton from "./AppButton.vue";

const settingsStore = useSettingsStore();
settingsStore.getTheme();

const theme = computed(() => settingsStore.theme);
const loading = computed(() => settingsStore.loading);

const handleNewTheme = async (value) => {
    settingsStore.setTheme(value);
};

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <Modal :show="props.show" @close="$emit('close')">
        <div class="p-8">
            <div class="mb-4">
                <p class="font-semibold mb-1">Planner Settings</p>
                <p class="text-sm text-zinc-400">
                    Change the settings for the planner.
                </p>
            </div>

            <div class="space-y-0.5">
                <div>
                    <label
                        for="planner-theme"
                        class="text-zinc-400 text-sm font-medium"
                        >Planner Theme</label
                    >
                    <div class="w-1/4 mt-1">
                        <SelectInput
                            :model-value="theme"
                            :options="settingsStore.getThemes()"
                            :class="{
                                'pointer-events-none opacity-50': loading,
                            }"
                            @update:model-value="handleNewTheme"
                        />
                    </div>
                </div>
            </div>

            <div class="mt-6">
                <AppButton color="white" @click="$emit('close')"
                    >Close</AppButton
                >
            </div>
        </div>
    </Modal>
</template>
