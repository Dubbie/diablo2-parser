import { defineStore } from "pinia";

const THEMES = [
    {
        label: "LoD",
        value: "lod",
    },
    {
        label: "Minimalistic",
        value: "minimalistic",
    },
];

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        theme: THEMES[0].value,
        loading: false,
    }),

    actions: {
        async setTheme(theme) {
            this.loading = true;

            try {
                const response = await axios.post(route("api.theme.update"), {
                    theme,
                });

                if (response.status === 200) {
                    this.theme = theme;
                }
            } catch (error) {
                console.error("Request error", error);
            } finally {
                this.loading = false;
            }
        },

        getThemes() {
            return THEMES;
        },

        async getTheme() {
            this.loading = true;
            try {
                const response = await axios.get(route("api.theme.fetch"));

                if (response.status === 200) {
                    this.theme = response.data.theme ?? THEMES[0].value;
                }
            } catch (error) {
                console.error("Request error", error);
            } finally {
                this.loading = false;
            }
        },
    },
});
