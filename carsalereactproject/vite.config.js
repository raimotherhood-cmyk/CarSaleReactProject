import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import plugin from '@vitejs/plugin-react';
import { getBaseHeadTags, getPageSeo } from './src/seo.js';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), 'VITE_');
    return {
        plugins: [plugin(), {
            name: 'configured-page-head',
            transformIndexHtml(html, context) {
                const seo = getPageSeo(context.originalUrl || context.path, { siteUrl: env.VITE_SITE_URL?.trim() || undefined, email: env.VITE_ENQUIRY_EMAIL });
                return { html, tags: [...getBaseHeadTags(), ...seo.tags].map(tag => ({ ...tag, injectTo: 'head' })) };
            },
        }],
        build: { manifest: true, copyPublicDir: false, assetsDir: 'Assets' },
        ssr: { noExternal: ['react-router', 'react-router-dom'] },
        server: { port: 50984 },
    };
});