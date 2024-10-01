<script setup>
import SelectInputComplex from "@/Components/SelectInputComplex.vue";
import TextInput from "@/Components/TextInput.vue";
import { computed } from "vue";
import { useCharacterStore } from "@/Stores/CharacterStore";

const characterStore = useCharacterStore();

const charactersList = computed(() => characterStore.charactersList);
const selectedClass = computed(() => characterStore.character.classData);

const charactersListOptions = computed(() => {
    if (!charactersList.value) {
        return [];
    }
    return charactersList.value.map((character) => {
        return {
            label: character.name,
            value: character,
        };
    });
});

const handleCharacterSelected = (character) => {
    characterStore.selectCharacter(character);
};

const handleLevelChange = (level) => {
    characterStore.setCharacterLevel(level);
};
</script>

<template>
    <div class="flex space-x-2">
        <SelectInputComplex
            :model-value="selectedClass"
            :options="charactersListOptions"
            class="w-full"
            @update:model-value="handleCharacterSelected"
        />

        <TextInput
            :model-value="characterStore.character.level"
            type="number"
            :min="1"
            :max="99"
            class="text-sm max-w-12 text-center"
            @update:model-value="handleLevelChange"
        />
    </div>
</template>
