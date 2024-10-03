import { defineStore } from "pinia";
import { useCharacterStore } from "./CharacterStore";

export const useSkillStore = defineStore("skill", {
    state: () => ({
        class: null,
        skills: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchSkills() {
            const characterStore = useCharacterStore();
            this.loading = true;

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
            this.skills = data.map((skill) => ({
                ...skill,
                level: 0, // Initialize skill levels to 0
            }));
        },

        modifyLevel(skill, amount) {
            const newLevel = Math.max(
                0,
                Math.min(skill.level + amount, skill.max_level)
            );
            skill.level = newLevel;
        },

        addLevel(skill, amount = 1) {
            if (this.isAllocatable(skill)) {
                this.modifyLevel(skill, amount);
            }
        },

        removeLevel(skill, amount = 1) {
            this.modifyLevel(skill, -amount);
        },

        isAllocatable(skill) {
            const characterStore = useCharacterStore();
            const { level } = characterStore.character;
            const meetsLevelRequirement = level >= skill.required_level;

            const prerequisitesFulfilled = skill.skill_prerequisites.every(
                (pSkill) =>
                    this.skills.find((s) => s.id === pSkill.prerequisite_id)
                        ?.level > 0
            );

            return meetsLevelRequirement && prerequisitesFulfilled;
        },

        isUsable(skill) {
            const characterStore = useCharacterStore();
            const { level } = characterStore.character;

            return level >= skill.required_level && skill.level > 0;
        },
    },
});
