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
                popup: resolve(__dirname, 'index.html'),
                background: resolve(__dirname, 'src/background/main.ts'),
                content: resolve(__dirname, 'src/content/main.tsx'),
                styles: resolve(__dirname, 'src/index.css'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        // Set to `false` to prevent Vite from clearing the dist folder on every build
        // This is important for the manifest.json and other assets
        emptyOutDir: true,
    },
});
