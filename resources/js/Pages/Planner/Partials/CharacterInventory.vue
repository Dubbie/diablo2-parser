<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import { useItemStore } from "@/Stores/ItemStore";
import AppButton from "@/Components/AppButton.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";
import { useSettingsStore } from "@/Stores/SettingsStore";

const characterStore = useCharacterStore();
const itemStore = useItemStore();
const settingsStore = useSettingsStore();

const slots = computed(() => characterStore.character.equippedItems); // Get equipped items from character store
const activeSlot = computed(() => itemStore.slot);
const theme = computed(() => settingsStore.theme);

const baseSize = 25;

const getWidth = (x) => {
    return x * baseSize + "px";
};

const getHeight = (y) => {
    return y * baseSize + "px";
};

const slotData = {
    larm: {
        top: "38px",
        left: "20px",
        width: getWidth(2),
        height: getHeight(4),
    },
    rarm: {
        top: "38px",
        left: "249px",
        width: getWidth(2),
        height: getHeight(4),
    },
    head: {
        top: "14px",
        left: "134px",
        width: getWidth(2),
        height: getHeight(2),
    },
    tors: {
        top: "85px",
        left: "133px",
        width: getWidth(2),
        height: getHeight(3),
    },
    glov: {
        top: "160px",
        left: "20px",
        width: getWidth(2),
        height: getHeight(2),
    },
    boot: {
        top: "160px",
        left: "249px",
        width: getWidth(2),
        height: getHeight(2),
    },
    belt: {
        top: "181px",
        left: "133px",
        width: getWidth(2),
        height: getHeight(1),
    },
    lrin: {
        top: "181px",
        left: "90px",
        width: getWidth(1),
        height: getHeight(1),
    },
    rrin: {
        top: "181px",
        left: "200px",
        width: getWidth(1),
        height: getHeight(1),
    },
    neck: {
        top: "41px",
        left: "201px",
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

const themeClasses = computed(() => {
    return {
        lod: {
            inactiveSlot: "bg-black/40 hover:bg-yellow-600/20",
            activeSlot: "bg-yellow-600/20",
            unusableSlot: "bg-red-500/30",
        },
        minimalistic: {
            inactiveSlot:
                "ring-1 ring-zinc-700 rounded-lg bg-black/40 hover:ring-yellow-400/40 hover:bg-yellow-600/10",
            activeSlot: "rounded-lg ring-1 ring-yellow-400/40 bg-yellow-600/20",
            unusableSlot: "ring-1 ring-red-500 bg-red-500/30",
        },
    }[theme.value];
});
</script>

<template>
    <div class="relative">
        <img
            src="/img/inventory.png"
            alt="Inventory"
            class="w-full"
            v-if="theme === 'lod'"
        />
        <div
            class="w-[320px] h-[501px] bg-zinc-800 rounded-xl ring-1 ring-white/15"
            v-if="theme === 'minimalistic'"
        ></div>

        <div class="flex justify-center mt-3">
            <AppButton plain class="w-full" @click="emit('reset-items')">
                Reset items
            </AppButton>
        </div>

        <div
            v-for="(position, slot) in slotData"
            :key="slot"
            class="absolute"
            :style="position"
            :class="{
                [themeClasses.inactiveSlot]: !isActiveSlot(slot),
                [themeClasses.activeSlot]: isActiveSlot(slot),
                [themeClasses.unusableSlot]: !isItemUsable(slots[slot]),
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
