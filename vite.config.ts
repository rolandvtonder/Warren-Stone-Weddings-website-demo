import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

// One HTML entry per page, so every section of the site has its own URL
// (/services/, /process/ …) and works on any static host — no router.
const page = (p: string) => resolve(__dirname, p);

export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/; the deploy workflow sets
  // BASE_PATH to that. Locally it stays at the root.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Photos, petals and the logo live in public/ and are served as-is.
    target: 'es2020',
    rollupOptions: {
      input: {
        home: page('index.html'),
        services: page('services/index.html'),
        process: page('process/index.html'),
        weddings: page('weddings/index.html'),
        about: page('about/index.html'),
        contact: page('contact/index.html'),
      },
    },
  },
});
