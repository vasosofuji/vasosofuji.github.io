// Generates the downscaled copies the card fans load on phones.
//
// The fans were pointing straight at the gallery originals: 2000x3000 JPEGs
// drawn into a card about 300 CSS px wide. Every one of those decodes to
// roughly 24 MB of bitmap, and seven are on screen at once. iOS absorbs that;
// Android runs out of room, throws the decoded frames away and decodes them
// again on the next raster, which is what made the fan crawl there while it
// stayed smooth on a phone half its price.
//
// The sources stay untouched - the gallery and the lightbox still want the
// full-size file. These are extra siblings named `<name>-<width>.jpg`, picked
// through srcset by the browser.
//
//   node scripts/build-fan-variants.mjs          report only, writes nothing
//   node scripts/build-fan-variants.mjs --write  generate

import { readFile, writeFile, access, stat } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// The card fans are the only place `imgUrl:` appears, and main.tsx is the one
// file that lists them. Reading the paths from there rather than keeping a
// second copy here means a card added to a fan cannot be forgotten.
const SOURCE_OF_TRUTH = join(ROOT, 'src', 'main.tsx');

export const WIDTHS = [400, 800, 1200];

// The wider the variant, the smaller each pixel ends up on screen, so the
// quality can come down as the width goes up without any of it being visible.
// 1200 exists purely for phones at 3x density showing a 300px card; left at
// the same setting as the small ones it produced files bigger than the 2000px
// original it was supposed to replace.
const QUALITY = { 400: 80, 800: 78, 1200: 68 };

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
  return join(dirname(src), `${basename(src, ext)}-${width}${ext}`);
}

const source = await readFile(SOURCE_OF_TRUTH, 'utf8');
const paths = [...new Set([...source.matchAll(/imgUrl:\s*"([^"]+)"/g)].map((m) => m[1]))];

if (!paths.length) {
  console.error('build-fan-variants: found no card images in src/main.tsx');
  process.exit(1);
}

const kb = (n) => `${(n / 1024).toFixed(0)}kB`;

let made = 0;
let skipped = 0;
let added = 0;

for (const rel of paths) {
  const src = join(ROOT, rel);
  if (!(await exists(src))) {
    console.warn(`build-fan-variants: missing source ${rel}`);
    continue;
  }

  const meta = await sharp(src).metadata();

  for (const width of WIDTHS) {
    const out = variantPath(src, width);
    // Nothing to gain from upscaling a source that is already small.
    if (meta.width <= width) {
      skipped++;
      continue;
    }
    if (await exists(out)) {
      skipped++;
      continue;
    }

    if (!write) {
      console.log(`would write ${rel.replace(/\.[^.]+$/, '')}-${width}.jpg  (source ${meta.width}px)`);
      made++;
      continue;
    }

    const buf = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: QUALITY[width], mozjpeg: true, chromaSubsampling: '4:2:0' })
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
  `\nbuild-fan-variants: ${paths.length} card images, ${made} variant${made === 1 ? '' : 's'} ${
    write ? 'written' : 'pending'
  }, ${skipped} already present or too small.`
);
if (write) console.log(`sources ${kb(originals)}, variants added ${kb(added)}`);
if (!write) console.log('Re-run with --write to generate them.');
