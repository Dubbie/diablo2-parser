<script setup>
import AppButton from "@/Components/AppButton.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { IconMinus, IconPlus } from "@tabler/icons-vue";
import { computed } from "vue";

const characterStore = useCharacterStore();

const finalAttributes = computed(() => {
    return {
        str: {
            label: "Strength",
            base: characterStore.character.attributes.str,
            mod: characterStore.character.modified_attributes.str,
        },
        dex: {
            label: "Dexterity",
            base: characterStore.character.attributes.dex,
            mod: characterStore.character.modified_attributes.dex,
        },
        vit: {
            label: "Vitality",
            base: characterStore.character.attributes.vit,
            mod: characterStore.character.modified_attributes.vit,
        },
        int: {
            label: "Energy",
            base: characterStore.character.attributes.int,
            mod: characterStore.character.modified_attributes.int,
        },
    };
});
</script>

<template>
    <div>
        <div class="space-y-2">
            <div
                v-for="(value, key) in finalAttributes"
                :key="key"
                class="grid grid-cols-11 items-center justify-items-center"
            >
                <p class="col-span-4 justify-self-start">{{ value.label }}</p>

                <div>
                    <AppButton
                        square
                        size="xs"
                        @click="
                            (event) =>
                                characterStore.adjustAttribute(
                                    key,
                                    'remove',
                                    event
                                )
                        "
                    >
                        <IconMinus class="size-4" stroke-width="3" />
                    </AppButton>
                </div>

                <div class="text-center col-span-2">
                    <p class="font-semibold px-3 select-none">
                        {{ value.mod }}
                    </p>
                </div>

                <div>
                    <AppButton
                        square
                        size="xs"
                        @click="
                            (event) =>
                                characterStore.adjustAttribute(
                                    key,
                                    'add',
                                    event
                                )
                        "
                    >
                        <IconPlus class="size-4" stroke-width="3" />
                    </AppButton>
                </div>

                <div class="col-span-3 justify-self-end">
                    <p class="text-xs font-semibold text-zinc-400">
                        (Base: {{ value.base }})
                    </p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 mt-3">
            <div class="text-xs text-zinc-400">
                <p>Tips:</p>

                <p>Ctrl + Click = 5 points</p>
                <p>Alt + Click = 100 points</p>
                <p>Shift + Click = All points</p>
            </div>

            <div>
                <p class="text-zinc-400 text-sm text-right">
                    Unspent Points:
                    <span class="font-semibold text-zinc-200">{{
                        characterStore.maxAllocatablePoints
                    }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
