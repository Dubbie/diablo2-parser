<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import { useItemStore } from "@/Stores/ItemStore";
import AppButton from "@/Components/AppButton.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";

const characterStore = useCharacterStore();
const itemStore = useItemStore();

const slots = computed(() => characterStore.character.equippedItems); // Get equipped items from character store
const activeSlot = computed(() => itemStore.slot);

const baseSize = 35;
const width = 381;

const getWidth = (x) => {
    return x * baseSize + "px";
};

const getHeight = (y) => {
    return y * baseSize + "px";
};

const slotData = {
    larm: {
        top: "55px",
        left: "20px",
        width: getWidth(2),
        height: getHeight(4),
    },
    rarm: {
        top: "55px",
        left: "292px",
        width: getWidth(2),
        height: getHeight(4),
    },
    head: {
        top: "20px",
        left: (width - baseSize * 2) / 2 + "px",
        width: getWidth(2),
        height: getHeight(2),
    },
    tors: {
        top: 20 + baseSize * 2 + 10 + "px",
        left: (width - baseSize * 2) / 2 + "px",
        width: getWidth(2),
        height: getHeight(3),
    },
    glov: {
        top: 55 + baseSize * 4 + 10 + "px",
        left: "20px",
        width: getWidth(2),
        height: getHeight(2),
    },
    boot: {
        top: 55 + baseSize * 4 + 10 + "px",
        left: "292px",
        width: getWidth(2),
        height: getHeight(2),
    },
    belt: {
        top: 20 + baseSize * 2 + 10 + baseSize * 3 + 10 + "px",
        left: (width - baseSize * 2) / 2 + "px",
        width: getWidth(2),
        height: getHeight(1),
    },
    lrin: {
        top: 20 + baseSize * 2 + 10 + baseSize * 3 + 10 + "px",
        left: 20 + baseSize * 2 + 14 + "px",
        width: getWidth(1),
        height: getHeight(1),
    },
    rrin: {
        top: 20 + baseSize * 2 + 10 + baseSize * 3 + 10 + "px",
        left: baseSize * 6 + 31 + "px",
        width: getWidth(1),
        height: getHeight(1),
    },
    neck: {
        top: "55px",
        left: baseSize * 6 + 31 + "px",
        width: getWidth(1),
        height: getHeight(1),
    },
};

const setActiveSlot = (slot) => {
    itemStore.setSlot(slot);
};

const isActiveSlot = (slot) => {
    return activeSlot.value === slot;
};

const inventory = {
    rows: 4,
    columns: 10,
};
const charmInventory = {
    rows: 4,
    columns: 10,
};
</script>

<template>
    <div class="relative">
        <div class="border border-white/10 rounded-xl bg-white/5">
            <div
                class="min-h-[286px]"
                :style="{ minWidth: width - 2 + 'px' }"
            ></div>

            <div class="-space-y-px mx-[20px] mb-4">
                <div
                    v-for="row in inventory.rows"
                    class="flex -space-x-px"
                    :key="row"
                >
                    <div
                        v-for="column in inventory.columns"
                        :key="column"
                        class="bg-black/40 border border-zinc-700"
                        :class="{
                            'rounded-tl-lg': column === 1 && row === 1,
                            'rounded-tr-lg':
                                column === inventory.columns && row === 1,
                        }"
                        :style="{
                            width: baseSize + 'px',
                            height: baseSize + 'px',
                        }"
                    ></div>
                </div>
                <div
                    v-for="row in charmInventory.rows"
                    class="flex -space-x-px"
                    :key="row"
                >
                    <div
                        v-for="column in charmInventory.columns"
                        :key="column"
                        class="bg-black/40 border border-yellow-800"
                        :class="{
                            'rounded-bl-lg':
                                column === 1 && row === charmInventory.rows,
                            'rounded-br-lg':
                                column === charmInventory.columns &&
                                row === charmInventory.rows,
                        }"
                        :style="{
                            width: baseSize + 'px',
                            height: baseSize + 'px',
                        }"
                    ></div>
                </div>
            </div>
        </div>

        <div class="flex justify-center mt-3">
            <AppButton plain class="w-full" @click="emit('reset-items')">
                Reset items
            </AppButton>
        </div>

        <div
            v-for="(position, slot) in slotData"
            :key="slot"
            class="absolute border rounded-lg"
            :style="position"
            :class="{
                'border-zinc-700 bg-black/40 hover:border-yellow-600/40 hover:bg-yellow-600/20':
                    !isActiveSlot(slot),
                'border-yellow-600 bg-yellow-600/20': isActiveSlot(slot),
                'bg-red-400/20 border-red-400/50': !isItemUsable(slots[slot]),
            }"
            @click="setActiveSlot(slot)"
            @click.right.prevent="
                characterStore.removeItemFromEquippedSlot(slot)
            "
        >
            <ItemDisplay
                v-if="slots[slot]"
                :item="slots[slot]"
                :padded="false"
                :background="false"
                tooltip-position="top-right"
            />
        </div>
    </div>
</template>
