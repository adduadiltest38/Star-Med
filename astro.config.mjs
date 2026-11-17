// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Production URL of the site. Used for canonical URLs, Open Graph,
 * structured data and the sitemap. Set SITE_URL in your hosting
 * provider (or .env) before deploying.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://www.starmedclinic.example';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  output: 'static',
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        if (item.url.replace(/\/$/, '') === SITE_URL.replace(/\/$/, '')) {
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
