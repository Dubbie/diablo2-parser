<script setup>
import { inject, ref } from "vue";

const { resistances } = inject("stats");
const rowClasses = inject("rowClasses");
const labelClasses = inject("labelClasses");
const valueClasses = inject("valueClasses");

const showingStats = ref(true);

const statMap = {
    fireResist: {
        label: "Fire Resistance",
        colorClass: "text-red-500",
    },
    coldResist: {
        label: "Cold Resistance",
        colorClass: "text-blue-500",
    },
    lightResist: {
        label: "Light Resistance",
        colorClass: "text-yellow-500",
    },
    poisonResist: {
        label: "Poison Resistance",
        colorClass: "text-green-500",
    },
};
</script>

<template>
    <div>
        <p
            class="text-base font-bold cursor-pointer select-none mb-1"
            @click="showingStats = !showingStats"
        >
            Resistances
        </p>
        <transition
            enter-active-class="transition transform ease-out duration-300"
            enter-from-class="scale-90"
            enter-to-class="scale-100"
            leave-active-class="transition transform ease-in duration-200"
            leave-from-class="scale-100"
            leave-to-class="scale-90"
        >
            <div v-show="showingStats">
                <p
                    v-for="[stat, value] in Object.entries(resistances)"
                    :key="stat"
                    :class="rowClasses"
                >
                    <span :class="labelClasses">{{
                        statMap[stat]?.label || stat
                    }}</span>
                    <span
                        :class="[valueClasses, statMap[stat]?.colorClass || '']"
                        >{{ value }}%</span
                    >
                </p>
            </div>
        </transition>
    </div>
</template>
