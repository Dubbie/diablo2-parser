<script setup>
import { ref, computed } from "vue";
import { useItemStore } from "@/Stores/ItemStore";
import { useCharacterStore } from "@/Stores/CharacterStore";
import Modal from "@/Components/Modal.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";
import AppButton from "@/Components/AppButton.vue";
import ModifierRangeInput from "./ModifierRangeInput.vue";

const itemStore = useItemStore();

const isVisible = computed(() => itemStore.selectedItem !== null);
const selectedItem = computed(() => itemStore.selectedItem);

const saveItem = () => {
    itemStore.addItemToCharacter();
    closeModal();
};

const handleModifierChange = (data) => {
    const index = data.index;
    const newValues = JSON.parse(JSON.stringify(data.values));

    itemStore.updateModifier(index, newValues);
};

const closeModal = () => {
    itemStore.selectedItem = null; // Clear selected item when modal is closed
};
</script>

<template>
    <Modal :show="isVisible" @close="closeModal">
        <div class="p-4">
            <p class="font-semibold mb-3">Item Editor</p>

            <div class="flex items-center space-x-4">
                <ItemDisplay
                    :item="selectedItem"
                    tooltip-position="top-right"
                />
            </div>

            <p
                class="my-3 border-b border-white/10 font-bold"
                :style="{ color: selectedItem.name_color }"
            >
                {{ selectedItem.unique ? "Unique" : "Normal" }}
            </p>
            <div class="space-y-0.5">
                <div
                    v-for="(modifier, index) in selectedItem.modifiers"
                    :key="index"
                >
                    <ModifierRangeInput
                        :entry="modifier"
                        :index="index"
                        @update:entry="handleModifierChange"
                    />
                </div>
            </div>

            <div class="flex space-x-2 justify-end">
                <AppButton plain @click="closeModal">Cancel</AppButton>
                <AppButton color="blue" @click="saveItem"
                    >Add to character</AppButton
                >
            </div>
        </div>
    </Modal>
</template>
