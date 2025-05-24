import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteStaticCopy} from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'public/manifest.json',
                    dest: '.',  // relative to outDir
                }
            ],
        }),
    ],
    build: {
        minify: false,  // for debugging
        outDir: 'build',
        rollupOptions: {
            input: {
                popup: './popup/index.html',
                sidepanel: './sidepanel/index.html',
                options: './options/index.html',
                content_script: './other_scripts/content_script.ts',
                service_worker: './other_scripts/service_worker.ts',
            },
            output: {
                entryFileNames: "assets/[name].js"
            }
        },
    },
});
