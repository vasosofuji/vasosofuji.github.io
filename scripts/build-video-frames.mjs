// Turns the showreel into the still frames the videos page scrubs through.
//
// The hero on /videos is a scroll-driven sequence: the page is scrolled, and
// the frames advance or reverse with it, so the film reads as something the
// visitor is running by hand rather than something playing at them. That needs
// the film as images, because a <video> cannot be seeked frame-accurately at
// scroll speed on a phone - Safari and Chrome on Android both drop the seek and
// hold the last decoded frame, which is exactly the stutter the effect lives or
// dies by.
//
// There is no ffmpeg on this machine, so the decode is done by the browser
// puppeteer already ships: the film is served over a throwaway local server,
// seeked one sample at a time, drawn into a canvas at each output width, and
// read straight back out as WebP. Chrome's own encoder, no intermediate PNG.
//
// Two sets are written. The wide one is for desktop, the narrow one for phones,
// where a third of the pixels are needed and the whole sequence has to arrive
// over a mobile connection before the effect can start.
//
//   node scripts/build-video-frames.mjs           report only, writes nothing
//   node scripts/build-video-frames.mjs --write   extract

import { mkdir, writeFile, rm, readdir, stat } from 'node:fs/promises';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'misc', 'Perseida Spot.mp4');
const OUT_DIR = join(ROOT, 'misc', 'reel');

// Sampled, not every frame off the timeline. The film runs at 25 to 30fps, so
// every frame would be several hundred images and tens of megabytes for a
// sequence the eye reads as continuous well below that. At this count the
// sequence turns over about fifteen frames per screen of scrolling, which is
// past the point where more frames stop being visible and start being weight.
export const FRAME_COUNT = 96;

// Trimmed off each end: the first and last moments of a cut are usually a fade
// from or to black, and a scroll sequence that opens on black looks broken.
export const HEAD_TRIM = 0.04;
export const TAIL_TRIM = 0.04;

// The film is heavily grained, and grain is the one thing WebP cannot throw
// away cheaply: dropping the quality from 0.72 to 0.60 saved under a tenth of
// the bytes, because almost none of them are quantisation. Resolution is the
// only lever that moves, so these are sized to what the sequence is actually
// displayed at rather than to the source. In motion, which is the only way
// these are ever seen, the difference does not read.
export const SIZES = [
  { name: 'wide', width: 1024, quality: 0.66 },
  { name: 'narrow', width: 576, quality: 0.64 },
];

const write = process.argv.includes('--write');
const kb = (n) => `${(n / 1024).toFixed(0)}kB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`;

if (!existsSync(SOURCE)) {
  console.error(`build-video-frames: missing ${SOURCE}`);
  process.exit(1);
}

// --- the throwaway server ---------------------------------------------------
// Chrome refuses file:// media, and the seeking below needs range requests, so
// the film goes over HTTP like it would in the page.
const server = createServer((req, res) => {
  if (req.url !== '/reel.mp4') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#000"></body>');
    return;
  }
  const size = statSync(SOURCE).size;
  const range = req.headers.range;
  if (range) {
    const [from, to] = range.replace('bytes=', '').split('-');
    const start = Number.parseInt(from, 10);
    const end = to ? Number.parseInt(to, 10) : size - 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4',
    });
    createReadStream(SOURCE, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Length': size, 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes' });
  createReadStream(SOURCE).pipe(res);
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
});

try {
  const page = await browser.newPage();
  await page.goto(`${origin}/`, { waitUntil: 'domcontentloaded' });

  const meta = await page.evaluate(async (src) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = src;
    document.body.appendChild(video);
    window.__reel = video;

    const ready = await new Promise((settle) => {
      video.addEventListener('loadeddata', () => settle(true), { once: true });
      video.addEventListener('error', () => settle(false), { once: true });
      setTimeout(() => settle(false), 60000);
    });
    if (!ready) return { ok: false, error: video.error?.message ?? 'timed out loading the film' };

    const canvases = {};
    window.__grab = async (time, sizes) => {
      await new Promise((settle) => {
        const done = () => settle();
        video.addEventListener('seeked', done, { once: true });
        video.currentTime = time;
        setTimeout(done, 5000);
      });
      // One more frame so the newly decoded picture is actually on the element
      // before it is drawn; Chrome fires `seeked` a touch ahead of that.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const out = {};
      for (const size of sizes) {
        const height = Math.round((size.width / video.videoWidth) * video.videoHeight);
        let canvas = canvases[size.name];
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.width = size.width;
          canvas.height = height;
          canvases[size.name] = canvas;
        }
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        out[size.name] = canvas.toDataURL('image/webp', size.quality).split(',')[1];
      }
      return out;
    };

    return { ok: true, duration: video.duration, width: video.videoWidth, height: video.videoHeight };
  }, `${origin}/reel.mp4`);

  if (!meta.ok) {
    console.error(`build-video-frames: ${meta.error}`);
    process.exit(1);
  }

  const start = meta.duration * HEAD_TRIM;
  const end = meta.duration * (1 - TAIL_TRIM);
  const span = end - start;
  const aspect = +(meta.width / meta.height).toFixed(4);

  console.log(`build-video-frames: ${meta.width}x${meta.height}, ${meta.duration.toFixed(2)}s`);
  console.log(
    `build-video-frames: ${FRAME_COUNT} frames from ${start.toFixed(2)}s to ${end.toFixed(2)}s ` +
      `(one every ${(span / (FRAME_COUNT - 1)).toFixed(3)}s)`
  );

  if (!write) {
    console.log('build-video-frames: report only, pass --write to extract');
    process.exit(0);
  }

  for (const size of SIZES) {
    await rm(join(OUT_DIR, size.name), { recursive: true, force: true });
    await mkdir(join(OUT_DIR, size.name), { recursive: true });
  }

  const totals = Object.fromEntries(SIZES.map((s) => [s.name, 0]));

  for (let i = 0; i < FRAME_COUNT; i++) {
    const time = start + (span * i) / (FRAME_COUNT - 1);
    const grabbed = await page.evaluate((t, sizes) => window.__grab(t, sizes), time, SIZES);

    for (const size of SIZES) {
      const bytes = Buffer.from(grabbed[size.name], 'base64');
      totals[size.name] += bytes.length;
      await writeFile(join(OUT_DIR, size.name, `${String(i).padStart(3, '0')}.webp`), bytes);
    }

    if ((i + 1) % 12 === 0 || i === FRAME_COUNT - 1) {
      console.log(`build-video-frames: ${i + 1}/${FRAME_COUNT}`);
    }
  }

  await writeFile(
    join(OUT_DIR, 'manifest.json'),
    `${JSON.stringify({ count: FRAME_COUNT, aspect, sizes: SIZES.map((s) => ({ name: s.name, width: s.width })) }, null, 2)}\n`
  );

  for (const size of SIZES) {
    console.log(
      `build-video-frames: ${size.name} ${size.width}px - ${mb(totals[size.name])} total, ` +
        `${kb(totals[size.name] / FRAME_COUNT)} a frame`
    );
  }
} finally {
  await browser.close();
  server.close();
}
