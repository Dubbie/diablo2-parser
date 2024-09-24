<script setup>
import NavLink from "./NavLink.vue";
</script>

<template>
    <div class="-mx-2">
        <p></p>

        <div class="flex items-center space-x-2">
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
