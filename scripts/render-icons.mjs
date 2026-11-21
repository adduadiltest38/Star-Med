/** Generates raster icons (favicon.ico, apple-touch-icon, PWA icons, logo.png) from public/favicon.svg. */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile('public/favicon.svg');
const png = (size) => sharp(svg, { density: 512 }).resize(size, size).png().toBuffer();

await writeFile('public/apple-touch-icon.png', await sharp(svg, { density: 512 }).resize(180, 180).flatten({ background: '#ffffff' }).png().toBuffer());
await writeFile('public/icon-192.png', await png(192));
await writeFile('public/icon-512.png', await png(512));
await writeFile('public/logo.png', await png(512));

// Minimal ICO container with a single 32x32 PNG image.
const img = await png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(img.length, 14); header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, img]));
console.log('icons written');
