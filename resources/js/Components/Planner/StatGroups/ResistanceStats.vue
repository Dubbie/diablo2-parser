<script setup>
import { inject, ref } from "vue";

const { resistances } = inject("stats");
const rowClasses = inject("rowClasses");
const labelClasses = inject("labelClasses");
const valueClasses = inject("valueClasses");

const showingStats = ref(true);
const showingHistory = ref(null);

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
    curseResist: {
        label: "Curse Resistance",
        colorClass: "text-purple-500",
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
                <div
                    class="relative"
                    v-for="[stat, data] in Object.entries(resistances)"
                    :key="stat"
                >
                    <div
                        :class="rowClasses"
                        @mouseenter="showingHistory = stat"
                        @mouseleave="showingHistory = null"
                    >
                        <p :class="labelClasses">
                            {{ statMap[stat]?.label || stat }}
                        </p>
                        <p
                            :class="[
                                valueClasses,
                                statMap[stat]?.colorClass || '',
                            ]"
                        >
                            {{ data.value.total }}%
                        </p>
                    </div>

                    <div
                        v-if="showingHistory === stat"
                        class="absolute top-full right-0 bg-black/70 backdrop-blur-md p-3 z-20 space-y-1 whitespace-nowrap"
                    >
                        <div
                            v-for="details in data.value.history"
                            :key="details"
                        >
                            <p
                                class="font-bold text-xs flex space-x-2 justify-between"
                            >
                                <span> {{ details.source }}:</span>
                                <span
                                    :class="{
                                        'text-red-500': details.value < 0,
                                        'text-green-500': details.value > 0,
                                    }"
                                    >{{
                                        details.value > 0
                                            ? "+" + details.value
                                            : details.value
                                    }}%</span
                                >
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
