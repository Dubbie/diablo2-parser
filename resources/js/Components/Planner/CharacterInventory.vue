<script setup>
import AppButton from "@/Components/AppButton.vue";
import ItemDisplay from "@/Components/ItemDisplay.vue";

const emit = defineEmits(["set-filter", "reset-items", "unequip-item"]);

const props = defineProps({
    filter: {
        type: Object,
        required: true,
    },
    slots: {
        type: Object,
        required: true,
    },
});

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

const handleUneqip = ($event, slot) => {
    $event.preventDefault();
    emit("unequip-item", slot);
};

const setFilter = (element) => {
    emit("set-filter", element);
};

const isActiveSlot = (slot) => {
    return props.filter.slot === slot;
};
</script>

<template>
    <div class="relative">
        <img
            src="/img/inventory.png"
            alt="Character Inventory"
            class="block w-full"
        />

        <div class="flex justify-center mt-3">
            <AppButton plain class="w-full" @click="emit('reset-items')"
                >Reset items</AppButton
            >
        </div>

        <div
            v-for="(position, slot) in slotData"
            :key="slot"
            class="absolute flex justify-center items-center"
            :style="position"
            :class="{
                'hover:bg-yellow-300/20': !isActiveSlot(slot),
                'bg-yellow-300/20': isActiveSlot(slot),
            }"
            @click="setFilter(slot)"
        >
            <ItemDisplay
                v-if="slots[slot]"
                :item="slots[slot]"
                :padded="false"
                :background="false"
                tooltip-position="top-right"
                @click.right="handleUneqip($event, slot)"
            />
        </div>
    </div>
</template>
