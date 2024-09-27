import { defineConfig } from 'vite';
import defaultTheme from 'tailwindcss/defaultTheme';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
const port = 5173;
const origin = `${process.env.DDEV_PRIMARY_URL}:${port}`;

export default defineConfig({
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"Ubuntu"', ...defaultTheme.fontFamily.sans],
            }
        }
    },
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    server: {
        // respond to all network requests:
        host: '0.0.0.0',
        port: port,
        strictPort: true,
        // Defines the origin of the generated asset URLs during development
        origin: origin
      },
});
