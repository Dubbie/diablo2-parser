<script setup>
import { computed } from "vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const defense = computed(() => {
    if (props.item.calculated_stats) {
        return props.item.calculated_stats.defense;
    }

    return null;
});

const oneHandDamage = computed(() => {
    if (props.item.calculated_stats) {
        return props.item.calculated_stats?.damage?.one_handed;
    }

    return null;
});

const twoHandDamage = computed(() => {
    if (props.item.calculated_stats) {
        return props.item.calculated_stats?.damage?.two_handed;
    }

    return null;
});

const missileDamage = computed(() => {
    if (props.item.calculated_stats) {
        return props.item.calculated_stats?.damage?.missile;
    }

    return null;
});
</script>

<template>
    <div>
        <p class="my-3 border-b border-white/10 font-bold">Calculated Stats</p>
        <div class="space-y-0.5">
            <p v-if="defense" class="flex space-x-1">
                <span>Defense:</span>
                <span
                    class="font-semibold"
                    :class="{ 'text-blue-400': defense.modified }"
                    >{{ defense.value }}</span
                >
            </p>
            <p v-if="oneHandDamage" class="flex space-x-1">
                <span>One-Hand Damage:</span>
                <span
                    class="font-semibold"
                    :class="{ 'text-blue-400': oneHandDamage.modified }"
                    >{{ oneHandDamage.value.min }} to
                    {{ oneHandDamage.value.max }}</span
                >
            </p>
            <p v-if="twoHandDamage" class="flex space-x-1">
                <span>Two-Hand Damage:</span>
                <span
                    class="font-semibold"
                    :class="{ 'text-blue-400': twoHandDamage.modified }"
                    >{{ twoHandDamage.value.min }} to
                    {{ twoHandDamage.value.max }}</span
                >
            </p>
            <p v-if="missileDamage" class="flex space-x-1">
                <span>Missile Damage:</span>
                <span
                    class="font-semibold"
                    :class="{ 'text-blue-400': missileDamage.modified }"
                    >{{ missileDamage.value.min }} to
                    {{ missileDamage.value.max }}</span
                >
            </p>
        </div>
    </div>
</template>
