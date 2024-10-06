import { defineStore } from "pinia";
import { useSkillDescription } from "@/Composables/useSkillDescription";
import { useCharacterStore } from "@/Stores/CharacterStore";
import { calculateElementalDamage } from "@/Composables/useSkillCalculations";
import { isItemUsable } from "@/Stores/StatCalculation/Utils";
import axios from "axios";
import { watch } from "vue";

export const useSkillStore = defineStore("skill", {
    state: () => ({
        class: null,
        skills: [], // Array of skills loaded from the backend
        skillLookup: {}, // Quick access to skills by name
        passives: {}, // Passives derived from skills
        bonuses: {
            allSkills: 0,
        },
        loading: false,
        error: null,
    }),

    actions: {
        async fetchSkills() {
            this.loading = true;
            const characterStore = useCharacterStore();
            try {
                const { data } = await axios.get(route("api.skills.fetch"), {
                    params: { class: characterStore.character.classData.name },
                });
                this.prepareSkillData(data);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
                this.error = "Failed to fetch skills. Please try again.";
            } finally {
                this.loading = false;
            }
        },

        prepareSkillData(data) {
            this.skills = data.map((skill) => {
                // Initialize base_level first
                const base_level = 0; // Adjust this as needed, e.g., based on current assignments

                // Now pass the skill with the base_level included
                const skillWithBaseLevel = {
                    ...skill,
                    base_level, // Add base_level here
                };

                // Now initialize context with the updated skill
                const context = this.initializeSkillContext(
                    skillWithBaseLevel,
                    this
                );

                return {
                    ...skillWithBaseLevel,
                    context, // Store the initialized context
                };
            });

            // Create a map for quick access to skills by name
            this.skillLookup = this.skills.reduce((acc, skill) => {
                acc[skill.name] = skill;
                return acc;
            }, {});

            // Initialize passives based on skills
            this.initializePassives();

            // Generate descriptions
            this.updateDescriptions();
        },

        initializeSkillContext(skill, state) {
            const context = {
                tempLevel: 0, // Temporary level for displaying stuff
                blvl: function () {
                    return this.tempLevel > 0
                        ? this.tempLevel
                        : skill.base_level;
                }, // Base level (hard points assigned)
                lvl: function () {
                    let slvl = this.blvl();

                    // Check if hard points are assigned, if so, gain bonuses!
                    if (skill.base_level > 0) {
                        slvl += state.bonuses.allSkills;
                    }

                    return slvl;
                },
                par1: skill.param_1 ? parseInt(skill.param_1) : 0,
                par2: skill.param_2 ? parseInt(skill.param_2) : 0,
                par3: skill.param_3 ? parseInt(skill.param_3) : 0,
                par4: skill.param_4 ? parseInt(skill.param_4) : 0,
                par5: skill.param_5 ? parseInt(skill.param_5) : 0,
                par6: skill.param_6 ? parseInt(skill.param_6) : 0,
                par7: skill.param_7 ? parseInt(skill.param_7) : 0,
                par8: skill.param_8 ? parseInt(skill.param_8) : 0,

                // Helper function for calculations
                calculateLinear: function (param1, param2) {
                    const level = this.lvl();
                    return level > 0 ? param1 + (level - 1) * param2 : 0;
                },
                calculateDiminishing: function (param1, param2) {
                    const level = this.lvl();

                    return Math.floor(
                        (Math.floor((110 * level) / (level + 6)) *
                            (param2 - param1)) /
                            100 +
                            param1
                    );
                },
                calculateToHit() {
                    // For now, only handle the basics.
                    const baseToHit = skill.to_hit;
                    const toHitPerLev = skill.to_hit_per_level;
                    const level = this.lvl() - 1;
                    return baseToHit + toHitPerLev * level;
                },

                calculateMinElementalDamage() {
                    const dmg = calculateElementalDamage(skill);
                    return dmg.min;
                },

                calculateMaxElementalDamage() {
                    const dmg = calculateElementalDamage(skill);
                    return dmg.max;
                },

                ln12: function () {
                    return this.calculateLinear(this.par1, this.par2);
                },
                ln34: function () {
                    return this.calculateLinear(this.par3, this.par4);
                },
                ln56: function () {
                    return this.calculateLinear(this.par5, this.par6);
                },
                ln78: function () {
                    return this.calculateLinear(this.par7, this.par8);
                },
                dm12: function () {
                    return this.calculateDiminishing(this.par1, this.par2);
                },
                dm34: function () {
                    return this.calculateDiminishing(this.par3, this.par4);
                },
                dm56: function () {
                    return this.calculateDiminishing(this.par5, this.par6);
                },
                dm78: function () {
                    return this.calculateDiminishing(this.par7, this.par8);
                },
                toht: function () {
                    return this.calculateToHit();
                },
                edmn: function () {
                    return this.calculateMinElementalDamage();
                },
                edmx: function () {
                    return this.calculateMaxElementalDamage();
                },
                setPreview: function () {
                    const currentLevel = this.blvl();
                    this.tempLevel = currentLevel + 1;
                },
                resetPreview: function () {
                    this.tempLevel = 0;
                },
            };

            // To ensure `this` points to the context object,
            // bind the functions to the context
            Object.keys(context).forEach((key) => {
                if (typeof context[key] === "function") {
                    context[key] = context[key].bind(context);
                }
            });

            return context;
        },

        calculateItemBonuses() {
            const characterStore = useCharacterStore();
            const { equippedItems: itemSlots } = characterStore.character;

            this.bonuses.allSkills = 0;

            Object.entries(itemSlots).forEach(([slot, item]) => {
                if (item && isItemUsable(item)) {
                    // Go through modifiers, check for all skill
                    item.modifiers.forEach((modifier) => {
                        const { name } = modifier;
                        if (name === "item_allskills") {
                            this.bonuses.allSkills += parseInt(
                                modifier.values.value
                            );
                        }
                    });
                }
            });
        },

        initializePassives() {
            // Initialize passives based on skills with relevant data
            this.passives = this.skills.reduce((acc, skill) => {
                if (skill.passiveEffect) {
                    acc[skill.name] = skill.passiveEffect;
                }
                return acc;
            }, {});
        },

        addLevel(skill, amount) {
            if (this.isAllocatable(skill)) {
                this.modifyBaseLevel(skill, amount);
            }
        },

        removeLevel(skill, amount) {
            this.modifyBaseLevel(skill, -amount);
        },

        modifyBaseLevel(skill, amount) {
            const newBaseLevel = Math.max(
                0,
                Math.min(skill.base_level + amount, skill.max_level)
            );
            skill.base_level = newBaseLevel;

            // Update the context when the base level changes
            skill.context = this.initializeSkillContext(skill, this);

            // Update passives when the base level changes
            this.updatePassives();

            // Generate descriptions
            this.updateDescriptions();
        },

        updatePassives() {
            // Re-initialize passives based on current skills and their effective levels
            this.passives = this.skills.reduce((acc, skill) => {
                if (skill.passiveEffect) {
                    acc[skill.name] = this.calculatePassiveEffect(skill);
                }
                return acc;
            }, {});
        },

        calculatePassiveEffect(skill) {
            // Logic to calculate the effect of the passive based on the skill's context
            const effectiveLevel = skill.context.lvl; // Get the effective level
            return effectiveLevel * skill.passiveMultiplier; // Example logic for passive calculation
        },

        updateDescriptions() {
            const { generateDescriptions } = useSkillDescription();
            generateDescriptions(this.skills);
        },

        isAllocatable(skill) {
            // Check if the skill can be allocated based on prerequisites and level requirement
            const characterStore = useCharacterStore();
            const prerequisitesMet = skill.skill_prerequisites.every(
                (pSkill) => {
                    const prereqId = pSkill.prerequisite_id;
                    const prerequisiteSkill = this.skills.find(
                        (s) => s.id === prereqId
                    );
                    return (
                        prerequisiteSkill && prerequisiteSkill.base_level > 0
                    );
                }
            );

            const sufficientLevel =
                characterStore.character.level >= skill.required_level; // Check character level

            return prerequisitesMet && sufficientLevel;
        },

        isUsable(skill) {
            // Check if the effective level of the skill is greater than 0
            return skill.context.lvl > 0;
        },

        initEquipmentWatcher() {
            const characterStore = useCharacterStore();
            watch(
                () => [
                    characterStore.character.equippedItems,
                    characterStore.character.level,
                    characterStore.character.modified_attributes,
                ],
                () => {
                    this.calculateItemBonuses();
                },
                {
                    deep: true,
                }
            );
        },
    },

    getters: {
        getSkillContext:
            (state) =>
            (skillName, strict = false) => {
                const skillContext = state.skillLookup[skillName]?.context;
                if (!skillContext) {
                    console.warn(`Context for skill "${skillName}" not found.`);
                    return null;
                }

                // TODO: Implement strict. Idk what it means yet.

                return skillContext;
            },
    },
});
