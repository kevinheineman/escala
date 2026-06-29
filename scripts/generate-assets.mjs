// Generates the raster icons and the social (OG) image from SVG sources, so no
// binary asset is ever hand-edited. `sharp` is a transient dependency — install
// it with `npm install --no-save sharp`, then run `node scripts/generate-assets.mjs`.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const favicon = readFileSync(join(pub, 'favicon.svg'));

// Shared "scale of A's" mark and palette (512×512 coordinate space): two faded
// A's behind one solid white A, signifying a range of sizes.
const A = 'M234 96L278 96L394 430L320 430L300 346L212 346L192 430L118 430ZM256 158L289 298L223 298Z';
const RED = '#F4555A';
const RED_TEXT = '#E23B42'; // a deeper red that clears AA-large on white

// The three A's, painted back-to-front (small left, medium right, large center).
const mark = `
  <path fill="#ffffff" fill-opacity="0.32" fill-rule="evenodd" transform="translate(22,168.5) scale(0.5)" d="${A}"/>
  <path fill="#ffffff" fill-opacity="0.32" fill-rule="evenodd" transform="translate(211.3,87) scale(0.62)" d="${A}"/>
  <path fill="#ffffff" fill-rule="evenodd" transform="translate(20.5,21) scale(0.92)" d="${A}"/>`;

// Full-bleed mark for the Apple touch icon (iOS adds its own rounding;
// transparent corners would render black, so the red fills the whole square).
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${RED}"/>
  ${mark}
</svg>`;

// ---- Open Graph image (1200×630) ----
// An ascending "Ag" specimen on the right echoes a type scale.
const specRows = [
  { y: 150, s: 24, c: '#8b93a3' },
  { y: 214, s: 34, c: '#5b6470' },
  { y: 298, s: 48, c: '#2b3440' },
  { y: 410, s: 70, c: '#11181c' },
  { y: 556, s: 100, c: RED },
];
const spec = specRows
  .map(
    (r) =>
      `<text x="720" y="${r.y}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${r.s}" fill="${r.c}">Ag</text>`,
  )
  .join('');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#eef1f4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <svg x="80" y="86" width="60" height="60" viewBox="0 0 512 512">
    <circle cx="256" cy="256" r="256" fill="${RED}"/>
    ${mark}
  </svg>
  <text x="156" y="132" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="62" fill="#11181c">Escala</text>
  <text x="82" y="210" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#586470">Type that scales, verified.</text>
  <text x="82" y="322" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="#11181c">A fluid type scale,</text>
  <text x="82" y="374" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="${RED_TEXT}">accessible by default.</text>
  <text x="82" y="556" font-family="Arial, Helvetica, sans-serif" font-size="23" fill="#586470">clamp() · 16px floor · zoom-safe · CSS · Tailwind · design tokens</text>
  ${spec}
</svg>`;

await sharp(favicon).resize(32, 32).png().toFile(join(pub, 'favicon-32.png'));
await sharp(Buffer.from(appleSvg)).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));
await sharp(Buffer.from(ogSvg)).png().toFile(join(pub, 'og.png'));

console.log('Generated favicon-32.png, apple-touch-icon.png, og.png');
