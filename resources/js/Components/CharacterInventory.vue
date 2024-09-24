<script setup>
import AppButton from "./AppButton.vue";
import ItemDisplay from "./ItemDisplay.vue";

const props = defineProps({
    filter: {
        type: Object,
        required: true,
    },
    larm: Object,
    rarm: Object,
    helm: Object,
    boot: Object,
    tors: Object,
    belt: Object,
    glov: Object,
    amul: Object,
    lrin: Object,
    rrin: Object,
});

const baseSize = 25;

const getWidth = (x) => {
    return x * baseSize + "px";
};

const getHeight = (y) => {
    return y * baseSize + "px";
};

const itemPositions = {
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
    helm: {
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
    amul: {
        top: "41px",
        left: "201px",
        width: getWidth(1),
        height: getHeight(1),
    },
};

const elements = [
    "larm",
    "rarm",
    "helm",
    "tors",
    "glov",
    "boot",
    "belt",
    "lrin",
    "rrin",
    "amul",
];

const handleUneqip = ($event, slot) => {
    $event.preventDefault();
    // emitter.emit("unequip-item", slot);
};

const setFilter = (element) => {
    emit("set-filter", element);
};

const isTwoHandedInRightHand = (element) => {
    if (
        element === "rarm" &&
        props.rarm &&
        props.rarm.base_stats?.min_2h_damage > 0
    ) {
        return true;
    }

    return false;
};

const emit = defineEmits(["set-filter", "reset-items"]);
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
            v-for="element in elements"
            :key="element"
            class="absolute flex justify-center items-center hover:bg-yellow-600/30"
            :style="itemPositions[element]"
            :class="{
                'opacity-70': isTwoHandedInRightHand(element),
                'hover:bg-yellow-300/20': filter.slot !== element,
                'bg-yellow-300/20': filter.slot === element,
            }"
            @click="setFilter(element)"
        >
            <ItemDisplay
                v-if="props[element]"
                :item="props[element]"
                :padded="false"
                @click.right="handleUneqip($event, element)"
            />
        </div>
    </div>
</template>
