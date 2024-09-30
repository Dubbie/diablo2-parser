<script setup>
import SelectInputComplex from "@/Components/SelectInputComplex.vue";
import TextInput from "@/Components/TextInput.vue";
import { computed, inject, onMounted, ref } from "vue";

const props = defineProps({
    plannerState: {
        type: Object,
        required: true,
    },
});

const characters = ref([]);
const emitter = inject("emitter");

const characterClassOptions = computed(() => {
    return characters.value.map((char) => {
        return {
            label: char.name,
            value: char,
        };
    });
});

const loadCharacters = async () => {
    emitter.emit("loading-planner", true);

    try {
        const response = await axios.get(route("api.characters.fetch"));
        characters.value = response.data;

        // Emit default class
        emitter.emit("change-class", characters.value[0]);
    } catch (error) {
        console.error(error);
    } finally {
        emitter.emit("loading-planner", false);
    }
};

onMounted(() => {
    loadCharacters();
});
</script>

<template>
    <div class="flex space-x-1 mb-1">
        <SelectInputComplex
            class="flex-1"
            v-model="plannerState.characterClass"
            :options="characterClassOptions"
        />

        <TextInput
            v-model="plannerState.level"
            :min="1"
            :max="99"
            type="number"
            class="text-sm w-16"
        />
    </div>
</template>
