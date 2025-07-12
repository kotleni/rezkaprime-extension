// vite.config.ts
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import fs from 'fs-extra';
import {getManifest} from './src/manifest';

const generateManifestPlugin = (
    browser: 'chrome' | 'firefox',
): PluginOption => {
    return {
        name: 'generate-manifest',
        writeBundle: async () => {
            const manifest = getManifest(browser);
            const distPath = resolve(__dirname, 'dist');
            await fs.writeJson(resolve(distPath, 'manifest.json'), manifest, {
                spaces: 2,
            });
            console.log(`\n✅ manifest.json for ${browser} generated!`);
        },
    };
};

// https://vitejs.dev/config/
export default defineConfig(({mode}: {mode: string}) => {
    const browser2 = mode === 'firefox' ? 'firefox' : 'chrome';

    return {
        plugins: [react(), generateManifestPlugin(browser2)],
        build: {
            rollupOptions: {
                input: {
                    popup: resolve(__dirname, 'src/popup/popup.html'),
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
    };
});
