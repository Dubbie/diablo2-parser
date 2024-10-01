// stores/characterStore.js
import { defineStore } from 'pinia';
import { useStatCalculationStore } from './StatCalculationStore';
import { watch } from 'vue';

export const useCharacterStore = defineStore('character', {
    state: () => ({
        character: {
            classData: {},
            level: 99,
            attributes: {
                str: 0,
                dex: 0,
                vit: 0,
                int: 0,
            },
            modified_attributes: {
                str: 0,
                dex: 0,
                vit: 0,
                int: 0,
            },
            equippedItems: {
                larm: null,
                rarm: null,
                tors: null,
                head: null,
                boot: null,
                belt: null,
                glov: null,
                lrin: null,
                rrin: null,
                neck: null,
            },
        },
        charactersList: [],
        error: null,
        loading: false,
        totalPointsAllocated: 0,
    }),
    getters: {
        maxPoints: () => 505, // Hardcoded for now
        totalBaseAttributes: (state) => {
            const { str, dex, vit, int } = state.character.attributes;
            return str + dex + vit + int;
        },
        maxAllocatablePoints(state) {
            return this.maxPoints - this.totalBaseAttributes - state.totalPointsAllocated;
        },
    },
    actions: {
        async fetchCharacterClasses() {
            this.loading = true;

            try {
                const response = await axios.get(route('api.characters.fetch'));
                this.charactersList = response.data;

                this.selectCharacter(this.charactersList[0]);
            } catch (error) {
                console.error('Failed to fetch classes:', error);
                this.error = "Failed to fetch character classes. Please try again.";
            } finally {
                this.loading = false;
            }
        },

        selectCharacter(character) {
            this.character.classData = character;
            this.character.attributes = character.base_attributes;

            // Reset modified attributes and total points when a new character is selected
            this.resetAttributes();
        },

        setCharacterLevel(level) {
            this.character.level = level;
        },

        adjustAttribute(attribute, action, event) {
            let amount = 1; // Default amount
            if (event.ctrlKey) {
                amount = 5; // Ctrl adds/removes 5 points
            } else if (event.altKey) {
                amount = 100; // Alt adds/removes 100 points
            } else if (event.shiftKey) {
                if (action === 'add') {
                    amount = this.maxAllocatablePoints; // Use max allocatable points
                } else {
                    amount = this.character.modified_attributes[attribute]; // Remove all allocated points for that attribute
                }
            }

            if (action === 'add') {
                this.addAttribute(attribute, amount);
            } else if (action === 'remove') {
                this.removeAttribute(attribute, amount);
            }
        },

        addAttribute(attribute, amount = 1) {
            if (this.totalPointsAllocated + amount > this.maxAllocatablePoints) {
                amount = this.maxAllocatablePoints; // Limit to remaining allocatable points
            }

            this.character.modified_attributes[attribute] += amount;
            this.totalPointsAllocated += amount;
        },

        removeAttribute(attribute, amount = 1) {
            if (this.character.modified_attributes[attribute] - amount < 0) {
                amount = this.character.modified_attributes[attribute]; // Don't go negative
            }

            this.character.modified_attributes[attribute] -= amount;
            this.totalPointsAllocated -= amount;
        },

        resetAttributes() {
            this.character.modified_attributes = {
                str: 0,
                dex: 0,
                vit: 0,
                int: 0,
            };
            this.totalPointsAllocated = 0;
        },

        addItemToEquippedSlot(slot, item) {
            this.character.equippedItems[slot] = item;
        },

        initStatWatcher() {
            const statCalculationStore = useStatCalculationStore();

            // Watch modified attributes and equipped items for changes
            watch(
                () => this.character.modified_attributes,
                () => {
                    statCalculationStore.calculateFinalAttributes();
                },
                { deep: true }
            );

            watch(
                () => this.character.equippedItems,
                () => {
                    statCalculationStore.calculateFinalAttributes();
                },
                { deep: true }
            );

            watch(
                () => this.character.level,
                () => {
                    statCalculationStore.calculateFinalAttributes();
                }
            );
        }
    },
});
