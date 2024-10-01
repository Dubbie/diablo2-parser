// stores/itemStore.js
import { defineStore } from 'pinia';
import { useCharacterStore } from '@/Stores/CharacterStore';
import { useItemCalculator } from '@/Composables/itemCalculator';
import axios from 'axios';

export const useItemStore = defineStore('item', {
    state: () => ({
        items: [], // List of available items from the backend
        selectedItem: null,
        slot: null,
        q: "",
        loading: false,
        abortController: null, // Store the current AbortController
        debounceTimer: null, // Store the debounce timer
    }),
    actions: {
        async fetchItems() {
            this.loading = true; // Set loading state

            // Abort the previous request if it's still ongoing
            if (this.abortController) {
                console.log('Aborting previous request');
                this.abortController.abort(); // Abort the previous request
            }

            // Create a new AbortController
            this.abortController = new AbortController();

            try {
                console.log('Fetching items with query:', this.q);
                const response = await axios.get(route('api.items.fetch'), {
                    params: {
                        slot: this.slot,
                        q: this.q,
                        templates: true,
                    },
                    signal: this.abortController.signal, // Pass the signal to axios
                });

                this.items = response.data; // Assuming the API returns an array of items
                console.log('Items fetched:', this.items);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted:', error.message);
                } else {
                    console.error('Failed to fetch items:', error);
                }
            } finally {
                this.loading = false; // Reset loading state
            }
        },

        setQuery(value) {
            this.q = value;

            // Clear the previous debounce timer
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }

            // Set a new debounce timer
            if (value.length >= 3) {
                this.debounceTimer = setTimeout(() => {
                    this.fetchItems(); // Fetch items after the debounce period
                }, 300); // Wait for 300ms
            } else {
                this.resetItems(); // Reset items if query is too short
            }
        },

        setSlot(value) {
            this.slot = value;

            // Reset items
            this.resetItems();

            // If q is already good, fetch items
            if (this.q.length >= 3) {
                this.fetchItems();
            }
        },

        selectItem(item) {
            console.log("Selected item:");
            console.log(item);

            this.selectedItem = { ...item }; // Create a copy of the item for editing
        },

        updateModifier(index, values) {
            this.selectedItem.modifiers[index].values = values;

            // Calculate the stats after modifier updates
            const characterStore = useCharacterStore();
            const { calculateStats } = useItemCalculator(this.selectedItem, characterStore.level);
            this.selectedItem.calculated_stats = calculateStats();
        },

        resetItems(withSlot = false) {
            this.items = [];

            if (withSlot) {
                this.selectedItem = null;
                this.slot = null;
                this.q = "";
            }
        },

        addItemToCharacter() {
            const characterStore = useCharacterStore();
            characterStore.addItemToEquippedSlot(this.slot, this.selectedItem);

            this.resetItems(true);
        }
    },
});
