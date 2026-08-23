// Generates the hero image for the "Asprify or Doomify?" post.
// Original artwork: an Aspire-palette faceted triangle framing a retro
// first-person corridor, with a CRT scanline and status-bar treatment.
// Run with: npm run hero
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'src/assets/asprify-or-doomify.jpg');

const width = 1200;
const height = 630;

// Aspire brand palette, read from https://aspire.dev/favicon.svg
const purple = {
	base: '#512BD4',
	mid: '#7455DD',
	light: '#9780E5',
	pale: '#B9AAEE',
	wash: '#DCD5F6',
};

// Triangle framing the scene.
const apex = { x: 600, y: 70 };
const left = { x: 150, y: 548 };
const right = { x: 1050, y: 548 };

// Vanishing point for the corridor perspective.
const vp = { x: 600, y: 352 };

// Concentric tunnel frames receding toward the vanishing point.
const steps = 8;
const frames = Array.from({ length: steps }, (_, i) => {
	const s = 1 / (1 + i * 0.46);
	return { w: 560 * s, h: 268 * s };
});

const band = (outer, inner, fill, opacity) =>
	`<path fill-rule="evenodd" fill="${fill}" opacity="${opacity}" d="` +
	`M ${(vp.x - outer.w).toFixed(1)} ${(vp.y - outer.h).toFixed(1)} h ${(outer.w * 2).toFixed(1)} v ${(outer.h * 2).toFixed(1)} h ${(-outer.w * 2).toFixed(1)} Z ` +
	`M ${(vp.x - inner.w).toFixed(1)} ${(vp.y - inner.h).toFixed(1)} h ${(inner.w * 2).toFixed(1)} v ${(inner.h * 2).toFixed(1)} h ${(-inner.w * 2).toFixed(1)} Z" />`;

const bandColours = [purple.base, purple.mid, purple.light, purple.pale, purple.wash];
const tunnelBands = frames
	.slice(0, -1)
	.map((outer, i) => band(outer, frames[i + 1], bandColours[i % bandColours.length], 0.2 + i * 0.06))
	.join('\n      ');

const tunnelEdges = frames
	.map(({ w, h }) => {
		const x = (vp.x - w).toFixed(1);
		const y = (vp.y - h).toFixed(1);
		return `<rect x="${x}" y="${y}" width="${(w * 2).toFixed(1)}" height="${(h * 2).toFixed(1)}" fill="none" stroke="${purple.wash}" stroke-width="1.6" opacity="0.42" />`;
	})
	.join('\n      ');

// Corner lines running from the nearest frame back to the vanishing point.
const near = frames[0];
const corners = [
	[vp.x - near.w, vp.y - near.h],
	[vp.x + near.w, vp.y - near.h],
	[vp.x + near.w, vp.y + near.h],
	[vp.x - near.w, vp.y + near.h],
]
	.map(([x, y]) => `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${vp.x}" y2="${vp.y}" />`)
	.join('\n      ');

// Pillars stepping down each side wall, giving the corridor some texture.
const pillars = frames
	.slice(0, 6)
	.map(({ w, h }, i) => {
		const next = frames[i + 1];
		const thickness = (w - next.w) * 0.42;
		const top = vp.y - h * 0.92;
		const tall = h * 1.84;
		const shade = bandColours[(i + 2) % bandColours.length];
		return `<rect x="${(vp.x - w).toFixed(1)}" y="${top.toFixed(1)}" width="${thickness.toFixed(1)}" height="${tall.toFixed(1)}" fill="${shade}" opacity="0.5" />
      <rect x="${(vp.x + w - thickness).toFixed(1)}" y="${top.toFixed(1)}" width="${thickness.toFixed(1)}" height="${tall.toFixed(1)}" fill="${shade}" opacity="0.5" />`;
	})
	.join('\n      ');

// Floor lines radiating from the vanishing point toward the bottom edge.
const floorRays = Array.from({ length: 15 }, (_, i) => {
	const x = -600 + i * 170;
	return `<line x1="${vp.x}" y1="${vp.y}" x2="${x}" y2="${height}" />`;
}).join('\n      ');

// Lit doorway at the end of the corridor.
const doorway = `
      <rect x="${vp.x - 44}" y="${vp.y - 58}" width="88" height="116" fill="#160a35" />
      <rect x="${vp.x - 44}" y="${vp.y - 58}" width="88" height="116" fill="url(#doorGlow)" />
      <rect x="${vp.x - 44}" y="${vp.y - 58}" width="88" height="116" fill="none" stroke="#ffd27a" stroke-width="2.5" opacity="0.9" />`;

// Facet overlay, echoing the segmented look of the Aspire palette.
const facets = `
    <polygon points="${apex.x},${apex.y} 838,330 362,330" fill="${purple.wash}" opacity="0.20" />
    <polygon points="362,330 838,330 ${right.x},${right.y}" fill="${purple.pale}" opacity="0.13" />
    <polygon points="362,330 ${right.x},${right.y} ${left.x},${left.y}" fill="${purple.light}" opacity="0.10" />`;

// Status bar: three framed panels with segmented meters.
const panel = (x, filled, colour) => {
	const segs = Array.from({ length: 10 }, (_, i) => {
		const on = i < filled;
		return `<rect x="${x + 18 + i * 22}" y="${height - 52}" width="15" height="26" fill="${colour}" opacity="${on ? 0.95 : 0.18}" />`;
	}).join('\n      ');
	return `<rect x="${x}" y="${height - 62}" width="272" height="46" fill="#1d0f45" opacity="0.9" />
      <rect x="${x}" y="${height - 62}" width="272" height="46" fill="none" stroke="${purple.light}" stroke-width="2" opacity="0.55" />
      ${segs}`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#100527" />
      <stop offset="50%" stop-color="#28115a" />
      <stop offset="100%" stop-color="${purple.base}" />
    </linearGradient>
    <linearGradient id="tri" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${purple.mid}" />
      <stop offset="60%" stop-color="${purple.base}" />
      <stop offset="100%" stop-color="#25105a" />
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${purple.wash}" stop-opacity="0.5" />
      <stop offset="100%" stop-color="${purple.wash}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="doorGlow" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0%" stop-color="#fff0c2" stop-opacity="1" />
      <stop offset="60%" stop-color="#ffb057" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#ff6a2a" stop-opacity="0.25" />
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
      <stop offset="50%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.62" />
    </radialGradient>
    <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="#000000" opacity="0.16" />
    </pattern>
    <clipPath id="triClip">
      <polygon points="${apex.x},${apex.y} ${right.x},${right.y} ${left.x},${left.y}" />
    </clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#sky)" />
  <ellipse cx="600" cy="310" rx="540" ry="340" fill="url(#halo)" opacity="0.32" />

  <polygon points="${apex.x},${apex.y} ${right.x},${right.y} ${left.x},${left.y}" fill="url(#tri)" />

  <g clip-path="url(#triClip)">
    <g>
      ${tunnelBands}
    </g>
    <g>
      ${pillars}
    </g>
    <g stroke="${purple.wash}" stroke-width="1.2" opacity="0.26">
      ${floorRays}
    </g>
    <g>
      ${tunnelEdges}
    </g>
    <g stroke="${purple.wash}" stroke-width="1.4" opacity="0.35">
      ${corners}
    </g>
    ${doorway}
    <ellipse cx="${vp.x}" cy="${vp.y}" rx="210" ry="150" fill="url(#doorGlow)" opacity="0.22" />
    ${facets}
  </g>

  <polygon points="${apex.x},${apex.y} ${right.x},${right.y} ${left.x},${left.y}"
    fill="none" stroke="${purple.wash}" stroke-width="3.5" opacity="0.8" />

  <rect y="${height - 78}" width="${width}" height="78" fill="#100527" opacity="0.94" />
  <rect y="${height - 78}" width="${width}" height="3" fill="${purple.light}" opacity="0.75" />
  ${panel(72, 7, '#7fe08a')}
  ${panel(464, 5, purple.pale)}
  ${panel(856, 3, '#ff8a3d')}

  <rect width="${width}" height="${height}" fill="url(#scanlines)" />
  <rect width="${width}" height="${height}" fill="url(#vignette)" />
</svg>`;

await mkdir(dirname(output), { recursive: true });
await writeFile(output, await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer());

console.log(`Wrote ${output} (${width}x${height})`);
