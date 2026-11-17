/**
 * Renders the SVG illustration sources in design/illustrations/ to high-resolution
 * PNG masters in src/assets/images/. Astro's image pipeline then generates
 * responsive AVIF/WebP variants at build time.
 *
 * Usage: node scripts/render-illustrations.mjs [name-filter]
 * Requires Playwright (dev only). Replace the PNGs with real photographs at any time.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright is resolved from the global install (or add it as a devDependency).
const { chromium } = require('playwright');
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('design/illustrations');
const OUT = path.resolve('src/assets/images');
const filter = process.argv[2];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
for (const file of (await readdir(SRC)).filter((f) => f.endsWith('.svg'))) {
  if (filter && !file.includes(filter)) continue;
  const svg = await readFile(path.join(SRC, file), 'utf8');
  const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/) ?? [];
  const width = Number(w), height = Number(h);
  const scale = file.startsWith('og-') ? 0.5 : 1; // OG image at exact 1200x630
  await page.setViewportSize({ width: Math.round(width * scale), height: Math.round(height * scale) });
  await page.setContent(
    `<html><head><style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style></head><body>${svg}</body></html>`,
  );
  const out = path.join(OUT, file.replace(/\.svg$/, '.png'));
  await page.screenshot({ path: out, omitBackground: true });
  console.log('rendered', path.relative(process.cwd(), out));
}
await browser.close();
