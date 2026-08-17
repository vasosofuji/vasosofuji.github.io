// Recompresses oversized images in place.
//
// The gallery ships originals straight out of the camera or editor - one
// portrait was 17 MB - which is a lot to push at a phone. This brings anything
// over the threshold down to a sane size without touching what is already
// small. Originals live in git, so a bad run is recoverable with `git checkout`.
//
//   node scripts/compress-images.mjs          report only, changes nothing
//   node scripts/compress-images.mjs --write  apply

import { readdir, stat, writeFile, rename } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['photos', 'misc'];

// Above this, recompress. Below it the file is already fine and gets skipped,
// so nothing is degraded for no gain.
const THRESHOLD = 350 * 1024;
// The lightbox shows at most ~900 CSS px, so 2400 still covers a 2x display
// with room to spare.
const MAX_EDGE = 2400;
const JPEG_QUALITY = 82;

const write = process.argv.includes('--write');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)}kB`;

let before = 0, after = 0, changed = 0, skipped = 0;
const rows = [];

for (const dir of DIRS) {
  for await (const file of walk(join(ROOT, dir))) {
    const ext = extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    // The `-400`/`-800`/`-1200` siblings belong to build-fan-variants.mjs,
    // which already picked a size and a quality for each of them. Re-encoding
    // one here would only add a second generation of loss.
    if (/-\d{3,4}\.(jpg|jpeg|png)$/i.test(file)) continue;

    const { size } = await stat(file);
    if (size <= THRESHOLD) { skipped++; continue; }

    const image = sharp(file, { failOn: 'none' });
    const meta = await image.metadata();
    const longest = Math.max(meta.width || 0, meta.height || 0);

    let pipeline = image.rotate(); // bake in EXIF orientation before resizing
    if (longest > MAX_EDGE) {
      pipeline = pipeline.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
    }

    pipeline = ext === '.png'
      ? pipeline.png({ compressionLevel: 9, palette: true })
      // Default 4:2:0 subsampling. 4:4:4 was actually producing files larger
      // than the originals here, and on photographic content the difference is
      // not visible.
      : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

    const buf = await pipeline.toBuffer();

    // Never make a file bigger than it already was.
    if (buf.length >= size) {
      rows.push([file, size, size, `${meta.width}x${meta.height}`, 'kept (recompress was larger)']);
      skipped++;
      continue;
    }

    before += size;
    after += buf.length;
    changed++;
    const outMeta = await sharp(buf).metadata();
    rows.push([file, size, buf.length, `${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`, '']);

    if (write) {
      const tmp = `${file}.tmp`;
      await writeFile(tmp, buf);
      await rename(tmp, file);
    }
  }
}

rows.sort((a, b) => b[1] - a[1]);
for (const [file, from, to, dims, note] of rows) {
  const rel = file.replace(ROOT, '').replace(/^[\\/]/, '');
  const pct = from === to ? '' : `-${(100 - (to / from) * 100).toFixed(0)}%`;
  console.log(`${rel.padEnd(42)} ${kb(from).padStart(8)} -> ${kb(to).padStart(8)} ${pct.padStart(6)}  ${dims} ${note}`);
}

console.log(`\n${write ? 'rewrote' : 'would rewrite'} ${changed} file(s), left ${skipped} alone`);
console.log(`${kb(before)} -> ${kb(after)}  (saves ${kb(before - after)})`);
if (!write) console.log('\nDry run. Re-run with --write to apply.');
