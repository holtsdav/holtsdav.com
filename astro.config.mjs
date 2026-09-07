// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { contactDev } from './scripts/contact-dev.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://holtsdav.com',
	vite: {
		plugins: [tailwindcss(), contactDev()],
		server: {
			strictPort: true,
			proxy: {
				'/api/contact': { target: 'http://127.0.0.1:8787', changeOrigin: true },
			},
		},
	},
});
