// Generates the WebP sprite sheet for the preloader camera animation.
//
// The loader originally loaded 96 separate GIF files totalling 6.3 MB.
// Requesting 96 individual files created severe network contention on
// cold cache visits and stalled page loads, particularly on mobile devices.
//
// This script composites all 96 frames into a single compact WebP atlas
// arranged as an 8x12 grid. Each frame is downscaled from 836x564 to 250x169,
// which provides crisp 1.25x pixel density for the 200 CSS px canvas while
// keeping total texture dimensions (2000x2028) strictly within universal 2048x2048
// mobile GPU limits and reducing sprite payload to roughly 213 kB.
//
// The source GIFs in misc/loading/ remain untouched as the source of truth.
//
//   node scripts/build-loader-sprite.mjs          report only, writes nothing
//   node scripts/build-loader-sprite.mjs --write  generate

import { writeFile, access, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'misc', 'loading');
const OUTPUT_FILE = join(ROOT, 'misc', 'loading-sprite.webp');

export const TOTAL_FRAMES = 96;
export const COLS = 8;
export const ROWS = 12;
export const FRAME_WIDTH = 250;
export const FRAME_HEIGHT = 169;
export const QUALITY = 78;

const write = process.argv.includes('--write');

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const kb = (n) => `${(n / 1024).toFixed(0)}kB`;

if (!(await exists(SOURCE_DIR))) {
  console.error(`build-loader-sprite: missing source directory ${SOURCE_DIR}`);
  process.exit(1);
}

const frames = [];
let sourceBytes = 0;

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const num = String(100 + i).padStart(4, '0');
  const filename = `Sequence ${num}.gif`;
  const fullPath = join(SOURCE_DIR, filename);
  if (!(await exists(fullPath))) {
    console.error(`build-loader-sprite: missing frame ${filename}`);
    process.exit(1);
  }
  const fileStat = await stat(fullPath);
  sourceBytes += fileStat.size;
  frames.push(fullPath);
}

if (!write) {
  console.log(
    `\nbuild-loader-sprite: ${TOTAL_FRAMES} frames found (${kb(sourceBytes)} total).`
  );
  console.log(
    `would write misc/loading-sprite.webp (${COLS}x${ROWS} grid, ${COLS * FRAME_WIDTH}x${ROWS * FRAME_HEIGHT}px)`
  );
  console.log('Re-run with --write to generate it.');
  process.exit(0);
}

const composites = [];

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const left = col * FRAME_WIDTH;
  const top = row * FRAME_HEIGHT;

  const buf = await sharp(frames[i])
    .resize(FRAME_WIDTH, FRAME_HEIGHT)
    .toBuffer();

  composites.push({ input: buf, left, top });
}

const atlas = sharp({
  create: {
    width: COLS * FRAME_WIDTH,
    height: ROWS * FRAME_HEIGHT,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
}).composite(composites);

const webpBuffer = await atlas
  .webp({ quality: QUALITY, effort: 6 })
  .toBuffer();

await writeFile(OUTPUT_FILE, webpBuffer);

console.log(
  `\nbuild-loader-sprite: successfully generated misc/loading-sprite.webp`
);
console.log(
  `sources ${kb(sourceBytes)} (96 files), sprite sheet ${kb(webpBuffer.length)} (1 file, ${(100 - (webpBuffer.length / sourceBytes) * 100).toFixed(1)}% reduction).`
);
