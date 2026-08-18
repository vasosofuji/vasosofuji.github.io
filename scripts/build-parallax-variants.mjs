// Generates WebP variants for the home page parallax scroll gallery.
//
// The parallax gallery loads 12 photos arranged in four moving columns.
// Pointing directly at camera originals (2000x3000 and 3000x2000 JPEGs) forces
// the compositor to hold hundreds of megabytes of decoded bitmap textures in
// memory while translating them every frame.
//
// These WebP siblings are sized to match the actual responsive column widths
// and are picked by the browser via srcset. The source JPEGs remain untouched
// as fallbacks.
//
//   node scripts/build-parallax-variants.mjs          report only, writes nothing
//   node scripts/build-parallax-variants.mjs --write  generate

import { readFile, writeFile, access, stat } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Read directly from the parallax gallery component to stay in sync with
// whichever images are placed in the gallery.
const SOURCE_OF_TRUTH = join(ROOT, 'src', 'components', 'ui', 'parallax-scroll.tsx');

export const WIDTHS = [400, 800, 1200];

// Quality is stepped down for wider variants because higher-resolution renders
// place more physical pixels into the same screen area, making compression
// artifacts imperceptible while keeping file sizes lightweight.
const QUALITY = { 400: 80, 800: 78, 1200: 70 };

const write = process.argv.includes('--write');

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

export function variantPath(src, width) {
  const ext = extname(src);
  return join(dirname(src), `${basename(src, ext)}-${width}.webp`);
}

const source = await readFile(SOURCE_OF_TRUTH, 'utf8');
const paths = [...new Set([...source.matchAll(/"(photos\/[^"]+\.jpg)"/g)].map((m) => m[1]))];

if (!paths.length) {
  console.error('build-parallax-variants: found no photos in src/components/ui/parallax-scroll.tsx');
  process.exit(1);
}

const kb = (n) => `${(n / 1024).toFixed(0)}kB`;

let made = 0;
let skipped = 0;
let added = 0;

for (const rel of paths) {
  const src = join(ROOT, rel);
  if (!(await exists(src))) {
    console.warn(`build-parallax-variants: missing source ${rel}`);
    continue;
  }

  const meta = await sharp(src).metadata();

  for (const width of WIDTHS) {
    const out = variantPath(src, width);
    // Skip if the original image is narrower than this variant width.
    if (meta.width <= width) {
      skipped++;
      continue;
    }
    if (await exists(out)) {
      skipped++;
      continue;
    }

    if (!write) {
      console.log(`would write ${rel.replace(/\.[^.]+$/, '')}-${width}.webp (source ${meta.width}px)`);
      made++;
      continue;
    }

    const buf = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY[width], effort: 6 })
      .toBuffer();
    await writeFile(out, buf);
    added += buf.length;
    made++;
  }
}

const originals = (
  await Promise.all(paths.map(async (p) => ((await exists(join(ROOT, p))) ? (await stat(join(ROOT, p))).size : 0)))
).reduce((a, b) => a + b, 0);

console.log(
  `\nbuild-parallax-variants: ${paths.length} gallery images, ${made} variant${made === 1 ? '' : 's'} ${
    write ? 'written' : 'pending'
  }, ${skipped} already present or too small.`
);
if (write) console.log(`sources ${kb(originals)}, variants added ${kb(added)}`);
if (!write) console.log('Re-run with --write to generate them.');
