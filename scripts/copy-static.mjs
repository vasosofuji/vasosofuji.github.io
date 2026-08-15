// Copies the asset folders that Vite cannot see into the build output.
//
// Most images are referenced as plain runtime strings rather than imports —
// `photos/...` in src/main.tsx, `misc/loading/Sequence NNNN.gif` built from a
// template literal in script.js, and the video's data-src. None of those are
// statically analysable, so Vite leaves them out of dist/ and the built site
// 404s on them. Copying the folders verbatim keeps those paths resolving.

import { cp, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const entries = ['photos', 'misc', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'llms.txt'];

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

if (!(await exists(dist))) {
  console.error('copy-static: dist/ does not exist — run the build first.');
  process.exit(1);
}

for (const entry of entries) {
  const from = join(root, entry);
  if (!(await exists(from))) {
    console.warn(`copy-static: skipping missing ${entry}`);
    continue;
  }
  await cp(from, join(dist, entry), { recursive: true });
  console.log(`copy-static: copied ${entry}`);
}
