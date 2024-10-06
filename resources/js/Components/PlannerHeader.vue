<script setup>
import NavLink from "./NavLink.vue";
</script>

<template>
    <div
        class="flex items-center space-x-12 border-b border-b-white/15 px-8 py-2"
    >
        <p class="font-semibold">
            <span>SanctaryForge</span>
            <span class="ml-1 bg-blue-500 text-xs px-1.5 rounded-md">v2</span>
        </p>

        <div class="flex-1 flex items-center space-x-2 -mx-2">
            <NavLink
                :href="route('items.index')"
                :active="route().current('items.index')"
                >Items</NavLink
            >
            <NavLink
                :href="route('planner')"
                :active="route().current('planner')"
                >Planner</NavLink
            >
        </div>
    </div>
</template>
