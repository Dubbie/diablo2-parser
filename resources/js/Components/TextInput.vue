<script setup>
import { onMounted, ref } from "vue";

const model = defineModel({
    type: String,
    required: true,
});

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute("autofocus")) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        class="bg-white/5 px-4 border-none focus:ring-inset focus:ring-2 focus:ring-indigo-500"
        v-model="model"
        ref="input"
    />
</template>
