import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteSitemap } from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteSSG } from 'vite-ssg/serialized-data';

const routes = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
];

export default defineConfig({
    plugins: [
        react(),
        viteSSG({ includedRoutes: () => routes }),
        ViteSitemap({
            baseUrl: 'https://happy-rock-0d9f35100.2.azurestaticapps.net/',
            routes,
            generateRobotsTxt: true,
        }),
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    title: 'Default Title',
                    description: 'Default Description',
                },
            },
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                },
            },
        },
    },
});