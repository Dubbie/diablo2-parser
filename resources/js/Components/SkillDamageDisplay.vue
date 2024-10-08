<script setup>
const props = defineProps({
    skillDamage: Object,
});

const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
};
</script>

<template>
    <div class="skill-display">
        <div v-if="skillDamage?.damage">
            <div v-for="(damage, key) in skillDamage.damage" :key="key">
                <h4 class="text-sm font-medium">{{ formatKey(key) }}</h4>
                <div
                    class="text-xs text-zinc-400"
                    v-if="
                        typeof damage === 'object' && damage?.min !== undefined
                    "
                >
                    <p>
                        {{ formatKey(key) }}: {{ damage.min }} -
                        {{ damage.max }}
                    </p>
                </div>

                <div
                    class="text-xs text-zinc-400"
                    v-if="typeof damage === 'object' && damage?.mainHand"
                >
                    <p>
                        Main Hand: {{ damage.mainHand.min }} -
                        {{ damage.mainHand.max }}
                    </p>
                    <p v-if="damage.offHand">
                        Off Hand: {{ damage.offHand.min }} -
                        {{ damage.offHand.max }}
                    </p>
                </div>

                <div
                    class="text-xs text-zinc-400 mt-2"
                    v-if="
                        typeof damage === 'object' && damage?.fpa !== undefined
                    "
                >
                    <p>
                        Attacking Frames:
                        {{ damage.fpa }}
                    </p>
                </div>

                <div
                    class="text-xs text-zinc-400"
                    v-if="
                        typeof damage === 'object' && damage?.aps !== undefined
                    "
                >
                    <p>
                        {{ Math.round(damage.aps * 100) / 100 }} Attacks per sec
                    </p>
                </div>

                <div
                    class="text-xs text-zinc-400 mt-2"
                    v-if="
                        typeof damage === 'object' && damage?.dps !== undefined
                    "
                >
                    <p>{{ Math.round(damage.dps * 100) / 100 }} DPS</p>
                </div>

                <!-- Handle other dynamic structures -->
                <div
                    class="text-xs text-zinc-400"
                    v-if="typeof damage === 'number'"
                >
                    <p>{{ formatKey(key) }}: {{ damage }}</p>
                </div>

                <div v-if="typeof damage === 'object' && !damage">
                    <p class="text-xs text-zinc-400">Unusable</p>
                </div>
            </div>
        </div>
    </div>
</template>
