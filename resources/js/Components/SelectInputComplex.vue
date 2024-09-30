<script setup>
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";
import { IconSelector } from "@tabler/icons-vue";
import { computed } from "vue";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
    },
    emptyLabel: {
        type: String,
        default: "Please choose...",
    },
    options: Array,
});

const selectedOption = computed(() => {
    return props.options.find((option) => {
        return option.value === props.modelValue;
    });
});

const label = computed(() => {
    if (!selectedOption.value) {
        return props.emptyLabel;
    }

    return selectedOption.value.label;
});

const handleChange = (newValue) => {
    emit("update:model-value", newValue);
};

const emit = defineEmits(["update:model-value"]);
</script>

<template>
    <Listbox
        :model-value="modelValue"
        @update:model-value="handleChange"
        as="div"
        class="relative"
        v-slot="{ open }"
    >
        <ListboxButton
            class="py-2 px-3 text-sm border-none bg-transparent rounded-xl ring-1 ring-inset text-white w-full"
            :class="{
                'ring-2 ring-indigo-500': open,
                'ring-white/10 hover:ring-white/30': !open,
            }"
        >
            <div class="flex justify-between">
                <p>{{ label }}</p>

                <IconSelector class="text-zinc-500 size-5 -mr-2" />
            </div>
        </ListboxButton>

        <transition
            leave-active-class="transition ease-in-out duration-300"
            leave-from-class="opacity-0"
            leave-to-class="opacity-100"
        >
            <ListboxOptions
                class="absolute top-full left-0 z-20 bg-zinc-800 p-1 rounded-xl border border-white/15 mt-1 max-h-64 overflow-y-scroll shadow-lg shadow-black/5"
            >
                <ListboxOption
                    v-for="option in options"
                    :key="option"
                    :value="option.value"
                    v-slot="{ active, selected }"
                >
                    <div
                        class="px-2 py-1 rounded-lg cursor-pointer text-sm"
                        :class="{
                            'bg-indigo-600 text-white': active,
                            'bg-zinc-600 font-medium': selected,
                        }"
                    >
                        <p>{{ option.label }}</p>
                    </div>
                </ListboxOption>
            </ListboxOptions>
        </transition>
    </Listbox>
</template>
