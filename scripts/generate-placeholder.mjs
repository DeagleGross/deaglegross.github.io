// Regenerates the gradient placeholder used as the fallback hero and social preview image.
// Run with: npm run placeholder
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'src/assets/blog-placeholder.jpg');

// 1200x630 is the size social platforms expect for og:image.
const width = 1200;
const height = 630;

// Colours match --accent / --accent-dark / --black in src/styles/global.css.
const diagonals = Array.from({ length: 9 }, (_, i) => {
	const offset = -420 + i * 190;
	return `<path d="M ${offset} ${height} L ${offset + 620} 0" />`;
}).join('\n    ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1219" />
      <stop offset="55%" stop-color="#000d8a" />
      <stop offset="100%" stop-color="#2337ff" />
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.18" r="0.65">
      <stop offset="0%" stop-color="#5f6dff" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#5f6dff" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="orb" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.20" />
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#glow)" />

  <g fill="none" stroke="url(#stroke)" stroke-width="1.5">
    ${diagonals}
  </g>

  <circle cx="965" cy="150" r="230" fill="url(#orb)" />
</svg>`;

await mkdir(dirname(output), { recursive: true });
await writeFile(output, await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer());

console.log(`Wrote ${output} (${width}x${height})`);
