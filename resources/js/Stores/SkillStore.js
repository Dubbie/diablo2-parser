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
                const response = await axios.get(route("api.skills.fetch"), {
                    params: {
                        class: characterStore.character.classData.name,
                    },
                });

                console.log(response.data);

                this.skills = response.data;
            } catch (error) {
                console.error("Failed to fetch skills:", error);
                this.error = "Failed to fetch skills. Please try again.";
            } finally {
                this.loading = false;
            }
        },
    },
});
