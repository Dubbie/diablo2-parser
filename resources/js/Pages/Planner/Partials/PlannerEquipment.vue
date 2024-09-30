<script setup>
import ItemFinder from "@/Components/ItemFinder.vue";
import { IconSearch } from "@tabler/icons-vue";
import { inject } from "vue";

const props = defineProps({
    plannerState: {
        type: Object,
        required: true,
    },
});

const emitter = inject("emitter");
</script>

<template>
    <div>
        <ItemFinder
            v-if="plannerState.showItemFinder"
            :filter="plannerState.filter"
            @item-selected="emitter.emit('item-selected', $event)"
        />

        <div v-else>
            <div class="flex space-x-3 items-start">
                <div
                    class="p-2 ring-1 ring-white/10 flex justify-center items-center rounded-lg"
                >
                    <IconSearch class="text-zinc-400 size-5" stroke-width="2" />
                </div>
                <div class="flex-1">
                    <p class="font-semibold">
                        Choose an equippable slot to search for items.
                    </p>
                    <p class="text-zinc-500 text-sm">
                        You can choose slots on the paperdoll.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
