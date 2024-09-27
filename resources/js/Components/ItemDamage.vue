<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const modified = ref(false);

const getCalculatedDamage = (baseMinKey, baseMaxKey) => {
    let _min = props.item.base_stats[baseMinKey] ?? 0;
    let _max = props.item.base_stats[baseMaxKey] ?? 0;

    if (_min === 0 && _max === 0) {
        return null;
    }

    let _minAdd = 0;
    let _maxAdd = 0;
    let _multiplier = 1;

    modified.value = false;
    for (const modifier of props.item.modifiers) {
        if (modifier.name === "dmg_normal") {
            _minAdd += parseInt(modifier.values.minValue);
            _maxAdd += parseInt(modifier.values.maxValue);

            modified.value = true;
        }

        if (
            modifier.name === "secondary_mindamage" &&
            baseMinKey === "min_2h_damage"
        ) {
            _minAdd += parseInt(modifier.values.value);

            modified.value = true;
        }

        if (
            modifier.name === "secondary_maxdamage" &&
            baseMaxKey === "max_2h_damage"
        ) {
            _maxAdd += parseInt(modifier.values.value);

            modified.value = true;
        }

        if (modifier.name === "maxdamage_percent") {
            _multiplier += parseFloat(modifier.values.value) / 100;

            modified.value = true;
        }
    }

    // Do the calculations
    _min = Math.floor(_min * _multiplier + _minAdd);
    _max = Math.floor(_max * _multiplier + _maxAdd);

    if (_min === 0 && _max === 0) {
        return null;
    }

    return {
        min: _min,
        max: _max,
    };
};

const oneHandDamage = computed(() => {
    return getCalculatedDamage("min_damage", "max_damage");
});

const twoHandDamage = computed(() => {
    return getCalculatedDamage("min_2h_damage", "max_2h_damage");
});

const missileDamage = computed(() => {
    return getCalculatedDamage("min_missile_damage", "max_missile_damage");
});
</script>

<template>
    <div>
        <p v-if="oneHandDamage">
            One-Hand Damage:
            <span :class="{ 'text-blue-400': modified }"
                >{{ oneHandDamage.min }} to {{ oneHandDamage.max }}</span
            >
        </p>
        <p v-if="twoHandDamage">
            Two-Hand Damage:
            <span :class="{ 'text-blue-400': modified }"
                >{{ twoHandDamage.min }} to {{ twoHandDamage.max }}</span
            >
        </p>
        <p v-if="missileDamage">
            Missile Damage:
            <span :class="{ 'text-blue-400': modified }"
                >{{ missileDamage.min }} to {{ missileDamage.max }}</span
            >
        </p>
    </div>
</template>
