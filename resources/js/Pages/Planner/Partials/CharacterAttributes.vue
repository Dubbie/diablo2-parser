<script setup>
import AppButton from "@/Components/AppButton.vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { IconMinus, IconPlus } from "@tabler/icons-vue";
import { computed } from "vue";

const characterStore = useCharacterStore();

const requiredStrength = computed(() => {
    let required = 0;

    Object.values(characterStore.character.equippedItems).forEach((item) => {
        const itemReq = item?.calculated_stats?.required_str?.value || 0;

        if (itemReq > required) {
            required = itemReq;
        }
    });

    return required;
});

const requiredDex = computed(() => {
    let required = 0;

    Object.values(characterStore.character.equippedItems).forEach((item) => {
        const itemReq = item?.calculated_stats?.required_dex?.value || 0;

        if (itemReq > required) {
            required = itemReq;
        }
    });

    return required;
});

const finalAttributes = computed(() => {
    return {
        str: {
            label: "Strength",
            base: characterStore.character.attributes.str,
            mod: characterStore.character.modified_attributes.str,
            required: requiredStrength.value,
        },
        dex: {
            label: "Dexterity",
            base: characterStore.character.attributes.dex,
            mod: characterStore.character.modified_attributes.dex,
            required: requiredDex.value,
        },
        vit: {
            label: "Vitality",
            base: characterStore.character.attributes.vit,
            mod: characterStore.character.modified_attributes.vit,
            required: 0,
        },
        int: {
            label: "Energy",
            base: characterStore.character.attributes.int,
            mod: characterStore.character.modified_attributes.int,
            required: 0,
        },
    };
});
</script>

<template>
    <div class="bg-zinc-800 rounded-xl p-5">
        <div class="space-y-2">
            <div
                v-for="(value, key) in finalAttributes"
                :key="key"
                class="flex items-center justify-items-center"
            >
                <p
                    class="flex-1 justify-self-start flex justify-between items-baseline mr-2"
                >
                    <span>{{ value.label }}</span>
                    <span
                        class="text-xs font-semibold"
                        :class="{
                            'text-red-400':
                                value.required > value.base + value.mod,
                            'text-zinc-500':
                                value.required <= value.base + value.mod,
                        }"
                    >
                        ({{ value.base + value.mod
                        }}{{
                            value.required > 0 &&
                            value.mod + value.base < value.required
                                ? ` / ${value.required}`
                                : ""
                        }})
                    </span>
                </p>

                <div class="bg-black/40 rounded-l-lg">
                    <AppButton
                        square
                        size="xs"
                        :disabled="value.mod === 0"
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

                <div
                    class="text-center w-[12%] justify-self-stretch bg-black/40"
                >
                    <p class="font-semibold px-1 select-none">
                        {{ value.mod }}
                    </p>
                </div>

                <div class="bg-black/40 rounded-r-lg">
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
            </div>
        </div>

        <div class="grid grid-cols-2 mt-3">
            <div>
                <AppButton
                    color="red"
                    plain
                    size="xs"
                    class="-ml-2"
                    @click="characterStore.resetAttributes()"
                >
                    Reset Attributes</AppButton
                >
            </div>
            <p class="text-zinc-400 text-sm text-right">
                Unspent Points:
                <span class="font-semibold text-zinc-200">{{
                    characterStore.maxAllocatablePoints
                }}</span>
            </p>
            <div class="text-xs col-span-2 mt-3 text-zinc-500">
                <p>Tips:</p>

                <p>Ctrl + Click = 5 points</p>
                <p>Alt + Click = 100 points</p>
                <p>Shift + Click = All points</p>
            </div>
        </div>
    </div>
</template>
