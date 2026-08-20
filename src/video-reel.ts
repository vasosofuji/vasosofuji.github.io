/**
 * The videos page hero: the showreel as a strip of stills that the page scroll
 * runs through, forwards on the way down and backwards on the way up.
 *
 * Deliberately not a React component. Nothing here is state that renders - it
 * is one canvas being repainted against the scroll position, and the words that
 * come and go over it are already in the HTML, where the site's own translation
 * pass can reach them and where they still exist with the script switched off.
 * React would only add a tree to keep in step with a scroll handler.
 *
 * The frames come from scripts/build-video-frames.mjs.
 */

const FRAME_COUNT = 96;

// Above this the wide set is worth its bytes; below it, or on a metered
// connection, the narrow one is a third of the weight and no visible loss at
// the size it is drawn.
const WIDE_FROM = 900;

// How many frames may be in flight at once. Enough to fill a fast connection,
// few enough that the first ones are not stuck behind the whole sequence.
const IN_FLIGHT = 6;

// Below this ratio the stage is taller than it is wide and the film is
// letterboxed into a band rather than cropped to fill. A phone held upright is
// about 0.46, and covering that with a 16:9 frame meant showing a quarter of
// its width blown up two and a half times: a blurred strip of the middle of
// every shot, which is not the film and is not worth the bytes either.
const LETTERBOX_BELOW = 1.2;

// Where the band sits in a portrait stage. Slightly high, so the writing
// underneath has room that is clearly its own.
const BAND_AT = 0.42;

// How hard the sequence chases the scroll. A flick on a phone covers hundreds
// of pixels in one gesture, and jumping straight to the frame that lands under
// it skips everything in between - which is the film not playing, just cutting.
// Easing towards it runs the frames through instead.
const CHASE = 0.16;

const framePath = (set: 'wide' | 'narrow', index: number) =>
  `misc/reel/${set}/${String(index).padStart(3, '0')}.webp`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * One step of the sequence catching up with the scroll. Pulled out as its own
 * function because it is the whole feel of the thing in three lines, and
 * because arithmetic with no DOM in it can be tested.
 */
export function chaseStep(shown: number, wanted: number): { at: number; settled: boolean } {
  const gap = wanted - shown;
  if (Math.abs(gap) <= 0.5) return { at: wanted, settled: true };
  return { at: shown + gap * CHASE, settled: false };
}

/**
 * How present a piece of writing is at a given point in the scroll. Full in the
 * middle of its window, nothing at either edge, and it reaches full a good way
 * before the middle so it holds rather than only touching it in passing.
 */
export function windowOpacity(progress: number, at: number, span: number): number {
  const local = (progress - at) / span;
  if (local <= -1 || local >= 1) return 0;
  return clamp((1 - Math.abs(local)) * 1.9, 0, 1);
}

/**
 * The order the frames are fetched in. Not 0,1,2...: on a slow connection that
 * gives a perfect opening second and nothing at all after it. This lays down a
 * coarse pass over the whole film first and then keeps halving the gaps, so
 * however far the sequence has got, what has arrived is spread across all of it
 * and scrolling anywhere finds a frame near enough to draw.
 */
function loadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const take = (index: number) => {
    if (index < count && !seen.has(index)) {
      seen.add(index);
      order.push(index);
    }
  };

  take(0);
  take(count - 1);
  for (let stride = 16; stride >= 1; stride = Math.floor(stride / 2)) {
    for (let i = 0; i < count; i += stride) take(i);
    if (stride === 1) break;
  }
  for (let i = 0; i < count; i++) take(i);
  return order;
}

export function mountVideoReel(): void {
  const section = document.querySelector<HTMLElement>('[data-reel]');
  const stage = section?.querySelector<HTMLElement>('[data-reel-stage]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-reel-canvas]');
  if (!section || !stage || !canvas) return;

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return;

  // Beats along the bottom and marks along the top, all driven the same way off
  // whatever scroll position their markup names.
  const timed = Array.from(section.querySelectorAll<HTMLElement>('[data-reel-at]'));
  const intro = section.querySelector<HTMLElement>('[data-reel-intro]');
  const progressBar = section.querySelector<HTMLElement>('[data-reel-progress]');

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const set: 'wide' | 'narrow' =
    window.innerWidth >= WIDE_FROM && !connection?.saveData ? 'wide' : 'narrow';

  const frames = new Array<HTMLImageElement | null>(FRAME_COUNT).fill(null);
  let nearestReady = -1;
  let drawn = -1;
  // Where the scroll says the film should be, and where it has actually got to.
  // The second chases the first rather than snapping to it.
  let wanted = 0;
  let shown = 0;

  // --- painting ------------------------------------------------------------
  // Cover-fit by hand rather than through CSS, because the canvas is a fixed
  // bitmap and object-fit would only scale whatever was painted into it.
  let width = 0;
  let height = 0;
  let letterbox = false;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const box = stage.getBoundingClientRect();
    letterbox = box.width / box.height < LETTERBOX_BELOW;
    width = Math.round(box.width * ratio);
    height = Math.round(box.height * ratio);
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    drawn = -1;
  };

  const paint = (index: number) => {
    const image = frames[index];
    if (!image) return;

    const fill = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const fit = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const scale = letterbox ? fit : fill;
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;

    if (letterbox) {
      // Nothing covers the bars, so the previous frame would show through them.
      context.fillStyle = '#050505';
      context.fillRect(0, 0, width, height);
    }

    context.drawImage(image, (width - w) / 2, (height - h) * (letterbox ? BAND_AT : 0.5), w, h);
    drawn = index;
  };

  /** The frame nearest the one asked for that has actually arrived. */
  const nearestTo = (index: number) => {
    if (frames[index]) return index;
    for (let step = 1; step < FRAME_COUNT; step++) {
      if (frames[index - step]) return index - step;
      if (frames[index + step]) return index + step;
    }
    return -1;
  };

  // --- loading -------------------------------------------------------------
  const queue = loadOrder(FRAME_COUNT);
  let cursor = 0;
  let active = 0;

  const pump = () => {
    while (active < IN_FLIGHT && cursor < queue.length) {
      const index = queue[cursor++];
      if (frames[index]) continue;
      active++;
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        frames[index] = image;
        active--;
        if (nearestReady === -1) {
          nearestReady = index;
          section.classList.add('is-running');
        }
        // A frame that has just landed may be a closer match to where the page
        // is sitting than whatever is currently painted.
        if (drawn === -1 || Math.abs(index - wanted) < Math.abs(drawn - wanted)) paint(index);
        pump();
      };
      image.onerror = () => {
        active--;
        pump();
      };
      image.src = framePath(set, index);
    }
  };

  // --- running the film ----------------------------------------------------
  // A second loop of its own, because the frames do not follow the scroll one
  // for one: they run after it. It stops the moment it has caught up.
  let chasing = false;

  const chase = () => {
    const step = chaseStep(shown, wanted);
    shown = step.at;
    chasing = !step.settled;

    const target = nearestTo(Math.round(shown));
    if (target !== -1 && target !== drawn) paint(target);
    if (chasing) requestAnimationFrame(chase);
  };

  const startChase = () => {
    if (chasing) return;
    chasing = true;
    requestAnimationFrame(chase);
  };

  // --- the scroll ----------------------------------------------------------
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let queued = false;

  const update = () => {
    queued = false;

    const box = section.getBoundingClientRect();
    const travel = box.height - stage.offsetHeight;
    const progress = travel > 0 ? clamp(-box.top / travel, 0, 1) : 0;

    wanted = progress * (FRAME_COUNT - 1);
    startChase();

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

    // The title holds the first screen to itself and is gone by the time the
    // first beat arrives.
    if (intro) {
      const out = clamp(progress / 0.07, 0, 1);
      intro.style.opacity = String(1 - out);
      intro.style.transform = still ? '' : `translate3d(0, ${-out * 40}px, 0)`;
      intro.style.visibility = out >= 1 ? 'hidden' : '';
    }

    // Every piece of writing owns a window of the scroll: it rises into it,
    // holds through the middle, and leaves. The windows are laid out in the
    // markup, so anything sharing a place on screen is given windows that
    // touch rather than overlap - two at once is two lots of text on top of
    // each other. The marks along the top and the beats along the bottom are
    // free to run at the same time, and deliberately do.
    for (const el of timed) {
      const at = Number(el.dataset.reelAt ?? '0');
      const span = Number(el.dataset.reelSpan ?? '0.10');
      const rise = Number(el.dataset.reelRise ?? '28');
      const local = (progress - at) / span;
      const opacity = windowOpacity(progress, at, span);
      // Rises into its window from below and leaves upwards, so a run of them
      // reads as one strip of writing moving with the film.
      const away = clamp(Math.abs(local), 0, 1);
      const shift = local < 0 ? away * rise : away * -rise;

      el.style.opacity = String(opacity);
      el.style.transform = still ? '' : `translate3d(0, ${shift}px, 0)`;
      el.style.visibility = opacity < 0.02 ? 'hidden' : '';
    }
  };

  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  resize();
  pump();
  update();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resize();
    update();
  });
}

/**
 * The rail of finished work under the reel. The scrolling itself is the
 * browser's, with scroll-snap doing the stops - a hand-written version of this
 * on a phone is always a worse copy of what the platform already does. This is
 * only the two arrows for people driving with a mouse, and the disabled states
 * that tell them when they have run out of rail.
 */
export function mountVideoRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;

  const previous = document.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = document.querySelector<HTMLButtonElement>('[data-rail-next]');

  const stride = () => {
    const card = rail.querySelector<HTMLElement>('.video-card');
    if (!card) return rail.clientWidth * 0.8;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const sync = () => {
    const end = rail.scrollWidth - rail.clientWidth;
    if (previous) previous.disabled = rail.scrollLeft <= 2;
    if (next) next.disabled = rail.scrollLeft >= end - 2;
  };

  previous?.addEventListener('click', () => rail.scrollBy({ left: -stride(), behavior: 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: stride(), behavior: 'smooth' }));

  rail.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
}
