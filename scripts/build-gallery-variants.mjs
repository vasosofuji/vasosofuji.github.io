// Generates the sized WebP the photo pages load.
//
// The category pages ship the full gallery originals, twelve of them per page
// at a couple of hundred kB each, all eager. On a phone that arrives as a slow
// procession of photographs appearing one after another, which is exactly what
// it looks like: every image loading by itself. The cards are at most a screen
// wide there, so most of those bytes are never seen.
//
// Same shape as build-fan-variants.mjs and build-parallax-variants.mjs: reads
// the list from the markup that actually uses it, writes siblings next to the
// sources, and leaves the originals alone for the lightbox.
//
//   node scripts/build-gallery-variants.mjs          report only
//   node scripts/build-gallery-variants.mjs --write  generate

import { readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['portraits.html', 'concerts.html', 'landscapes.html', 'gallery.html'];
const WIDTHS = [480, 960];
const QUALITY = { 480: 74, 960: 72 };

const write = process.argv.includes('--write');
const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

const sources = new Set();
for (const page of PAGES) {
  const file = join(ROOT, page);
  if (!(await exists(file))) continue;
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(/src="(photos\/[^"]+\.(?:jpg|jpeg))"/gi)) sources.add(m[1]);
}

let made = 0, skipped = 0, bytes = 0;
for (const rel of sources) {
  const src = join(ROOT, rel);
  if (!(await exists(src))) continue;
  const meta = await sharp(src).metadata();
  for (const width of WIDTHS) {
    if (meta.width <= width) { skipped++; continue; }
    const out = join(dirname(src), `${basename(src, extname(src))}-${width}.webp`);
    if (await exists(out)) { skipped++; continue; }
    if (!write) { made++; continue; }
    const buf = await sharp(src).resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY[width] }).toBuffer();
    await writeFile(out, buf);
    bytes += buf.length;
    made++;
  }
}

console.log(`build-gallery-variants: ${sources.size} source images, ${made} variant${made === 1 ? '' : 's'} ${write ? 'written' : 'pending'}, ${skipped} already present or too small.`);
if (write && bytes) console.log(`added ${(bytes / 1024 / 1024).toFixed(1)} MB of derivatives`);
if (!write) console.log('Re-run with --write to generate them.');
