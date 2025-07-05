// vite.config.ts
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                // Our popup is the default entry, linked by index.html
                popup: resolve(__dirname, 'index.html'),
                // Our background script
                background: resolve(__dirname, 'src/background/main.ts'),
                // Our content script
                content: resolve(__dirname, 'src/content/main.ts'),
            },
            output: {
                // The name of the script files
                entryFileNames: '[name].js',
                // The name of the chunk files
                chunkFileNames: 'chunks/[name].js',
                // The name of the asset files
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        // Set to `false` to prevent Vite from clearing the dist folder on every build
        // This is important for the manifest.json and other assets
        emptyOutDir: true,
    },
});
