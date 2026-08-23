// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// This repository is a GitHub Pages *user site* (`deaglegross.github.io`),
	// so the site is served from the domain root. `base` must therefore stay
	// unset — setting it would prefix every asset/link with a subpath and
	// break CSS and navigation. `base` is only for project sites.
	site: 'https://deaglegross.github.io',
	integrations: [mdx(), sitemap()],
	vite: {
		build: {
			// Vite inlines small assets as base64 data URIs. That is fine for icons
			// but wrong for video: a data URI cannot serve HTTP range requests, so
			// the browser loses seeking and must load the whole clip up front.
			// Always emit media as real files and leave everything else on the default.
			assetsInlineLimit: (filePath) =>
				/\.(mp4|webm|mov|m4v|ogv)$/i.test(filePath) ? false : undefined,
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
