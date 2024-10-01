import { defineStore } from 'pinia';
import { useCharacterStore } from '@/Stores/CharacterStore';

export const useStatCalculationStore = defineStore('statCalculation', {
    state: () => ({
        attributes: {
            strength: 0,
            dexterity: 0,
            vitality: 0,
            energy: 0,
        },
    }),
    actions: {
        calculateFinalAttributes() {
            const characterStore = useCharacterStore();

            console.log('Calculating final attributes...');
            console.log(characterStore.character);

            // Reset the final attributes
            this.attributes.strength = characterStore.character.attributes.str + characterStore.character.modified_attributes.str;
            this.attributes.dexterity = characterStore.character.attributes.dex + characterStore.character.modified_attributes.dex;
            this.attributes.vitality = characterStore.character.attributes.vit + characterStore.character.modified_attributes.vit;
            this.attributes.energy = characterStore.character.attributes.int + characterStore.character.modified_attributes.int;

            // Iterate over each equipped item
            Object.keys(characterStore.character.equippedItems).forEach(slot => {
                const item = characterStore.character.equippedItems[slot];

                if (!item) {
                    return;
                }

                if (this.isItemUsable(item)) {
                    // Look for any attribute modifiers in the item's modifiers
                    item.modifiers.forEach(modifier => {
                        const { name, values } = modifier;
                        if (name === 'strength') {
                            this.attributes.strength += parseInt(values.value);
                        } else if (name === 'dexterity') {
                            this.attributes.dexterity += parseInt(values.value);
                        } else if (name === 'vitality') {
                            this.attributes.vitality += parseInt(values.value);
                        } else if (name === 'energy') {
                            this.attributes.energy += parseInt(values.value);
                        }
                    });
                }
            });
        },

        isItemUsable(item) {
            const characterStore = useCharacterStore();
            const level = characterStore.character.level || 1;

            const requiredStr = item.calculated_stats?.required_str?.value || 0;
            const requiredDex = item.calculated_stats?.required_dex?.value || 0;
            const requiredLevel = item.calculated_stats?.required_level?.value || 0;

            return this.attributes.strength >= requiredStr && this.attributes.dexterity >= requiredDex && level >= requiredLevel;
        },
    },
});
