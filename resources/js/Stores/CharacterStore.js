import { defineStore } from "pinia";
import { useStatCalculationStore } from "./StatCalculationStore";
import { watch } from "vue";
import { useSkillStore } from "./SkillStore";

export const useCharacterStore = defineStore("character", {
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
            return (
                this.maxPoints -
                this.totalBaseAttributes -
                state.totalPointsAllocated
            );
        },
    },
    actions: {
        async fetchCharacterClasses() {
            this.loading = true;

            try {
                const response = await axios.get(route("api.characters.fetch"));
                this.charactersList = response.data;

                this.selectCharacter(this.charactersList[0]);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                this.error =
                    "Failed to fetch character classes. Please try again.";
            } finally {
                this.loading = false;
            }
        },

        selectCharacter(character) {
            this.character.classData = character;
            this.character.attributes = character.base_attributes;
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
                if (action === "add") {
                    amount = this.maxAllocatablePoints; // Use max allocatable points
                } else {
                    amount = this.character.modified_attributes[attribute]; // Remove all allocated points for that attribute
                }
            }

            this[action + "Attribute"](attribute, amount);
        },

        addAttribute(attribute, amount = 1) {
            // Calculate how much can be added without exceeding max allocatable points
            const maxAllocatable = this.maxAllocatablePoints;

            if (amount > maxAllocatable) {
                amount = maxAllocatable;
            }

            // Update the modified attribute and total points allocated
            this.character.modified_attributes[attribute] += amount;
            this.totalPointsAllocated += amount;
        },

        removeAttribute(attribute, amount = 1) {
            // Calculate how much can be removed without going negative
            const currentAllocated =
                this.character.modified_attributes[attribute];

            if (amount > currentAllocated) {
                amount = currentAllocated; // Prevent removing more than allocated
            }

            // Update the modified attribute and total points allocated
            this.character.modified_attributes[attribute] -= amount;
            this.totalPointsAllocated -= amount;

            // Ensure totalPointsAllocated doesn't go negative after removal
            if (this.totalPointsAllocated < 0) {
                this.totalPointsAllocated = 0; // Cap it at zero
            }
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

        removeItemFromEquippedSlot(slot) {
            this.character.equippedItems[slot] = null;
        },

        initStatWatcher() {
            const statCalculationStore = useStatCalculationStore();
            const updateStats = () => {
                statCalculationStore.calculateStats();
            };

            // Combine watchers for modified attributes, equipped items, and character level
            watch(
                () => [
                    this.character.modified_attributes,
                    this.character.equippedItems,
                    this.character.level,
                ],
                updateStats,
                { deep: true }
            );
        },
    },
});
