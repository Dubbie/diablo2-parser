<script setup>
import { onMounted, ref } from "vue";
import TextInput from "./TextInput.vue";
import InputLabel from "./InputLabel.vue";

const emit = defineEmits(["update:defense"]);

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const showingRange = ref(false);
const defense = ref(props.item.base_stats.max_ac.toString());

const handleFocus = () => {
    showingRange.value = true;
};

const handleBlur = () => {
    showingRange.value = false;

    if (isCorrectValue()) {
        emit("update:defense", defense.value);
    } else {
        defense.value = props.item.base_stats.max_ac.toString();
    }
};

const isCorrectValue = () => {
    if (
        defense.value < props.item.base_stats.min_ac ||
        defense.value > props.item.base_stats.max_ac
    ) {
        return false;
    }

    return true;
};

onMounted(() => {
    emit("update:defense", defense.value);
});
</script>

<template>
    <div>
        <InputLabel for="defense" value="Defense" />
        <div class="relative">
            <TextInput
                id="defense"
                v-model="defense"
                type="tel"
                :min="props.item.base_stats.min_ac"
                :max="props.item.base_stats.max_ac"
                class="text-sm w-24"
                @focus="handleFocus"
                @blur="handleBlur"
            />

            <div
                class="absolute top-full left-0 bg-black/70 backdrop-blur-md px-2 py-1 font-bold"
                v-show="showingRange"
            >
                <p>Range:</p>
                <p>
                    <span>{{ props.item.base_stats.min_ac }}</span>
                    <span class="text-zinc-500 mx-1">-</span>
                    <span>{{ props.item.base_stats.max_ac }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
