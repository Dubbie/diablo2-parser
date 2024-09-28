<script setup>
import { inject, ref } from "vue";

const { defenses } = inject("stats");
const rowClasses = inject("rowClasses");
const labelClasses = inject("labelClasses");
const valueClasses = inject("valueClasses");

const showingStats = ref(true);

const statMap = {
    armorClass: {
        label: "Defense",
    },
};
</script>

<template>
    <div>
        <p
            class="text-base font-bold cursor-pointer select-none mb-1"
            @click="showingStats = !showingStats"
        >
            Defenses
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
                    v-for="[stat, data] in Object.entries(defenses)"
                    :key="stat"
                    :class="rowClasses"
                >
                    <span :class="labelClasses">{{
                        statMap[stat]?.label || stat
                    }}</span>
                    <span
                        :class="[valueClasses, statMap[stat]?.colorClass || '']"
                        >{{ data.value.total }}</span
                    >
                </p>
            </div>
        </transition>
    </div>
</template>
