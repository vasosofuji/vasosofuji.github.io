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

const framePath = (set: 'wide' | 'narrow', index: number) =>
  `misc/reel/${set}/${String(index).padStart(3, '0')}.webp`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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

  const beats = Array.from(section.querySelectorAll<HTMLElement>('[data-reel-beat]'));
  const intro = section.querySelector<HTMLElement>('[data-reel-intro]');
  const progressBar = section.querySelector<HTMLElement>('[data-reel-progress]');

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const set: 'wide' | 'narrow' =
    window.innerWidth >= WIDE_FROM && !connection?.saveData ? 'wide' : 'narrow';

  const frames = new Array<HTMLImageElement | null>(FRAME_COUNT).fill(null);
  let nearestReady = -1;
  let drawn = -1;
  let wanted = 0;

  // --- painting ------------------------------------------------------------
  // Cover-fit by hand rather than through CSS, because the canvas is a fixed
  // bitmap and object-fit would only scale whatever was painted into it.
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const box = stage.getBoundingClientRect();
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
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
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

  // --- the scroll ----------------------------------------------------------
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let queued = false;

  const update = () => {
    queued = false;

    const box = section.getBoundingClientRect();
    const travel = box.height - stage.offsetHeight;
    const progress = travel > 0 ? clamp(-box.top / travel, 0, 1) : 0;

    wanted = Math.round(progress * (FRAME_COUNT - 1));
    const target = nearestTo(wanted);
    if (target !== -1 && target !== drawn) paint(target);

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

    // The title holds the first screen to itself and is gone by the time the
    // first beat arrives.
    if (intro) {
      const out = clamp(progress / 0.07, 0, 1);
      intro.style.opacity = String(1 - out);
      intro.style.transform = still ? '' : `translate3d(0, ${-out * 40}px, 0)`;
      intro.style.visibility = out >= 1 ? 'hidden' : '';
    }

    // Each beat owns a window of the scroll: it rises into it, holds through
    // the middle, and leaves. The windows are laid out in the markup so they
    // touch rather than overlap, because they all occupy the same place on
    // screen and two at once is two lots of text on top of each other.
    for (const beat of beats) {
      const at = Number(beat.dataset.reelAt ?? '0');
      const span = Number(beat.dataset.reelSpan ?? '0.10');
      const local = (progress - at) / span;
      let opacity = 0;
      let shift = 24;

      if (local > -1 && local < 1) {
        // Triangular, softened: full at the centre of the window, nothing at
        // either edge.
        const near = 1 - Math.abs(local);
        opacity = clamp(near * 1.9, 0, 1);
        shift = local < 0 ? (1 - near) * 28 : (1 - near) * -28;
      }

      beat.style.opacity = String(opacity);
      beat.style.transform = still ? '' : `translate3d(0, ${shift}px, 0)`;
      beat.style.visibility = opacity < 0.02 ? 'hidden' : '';
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
    if (drawn !== -1) paint(drawn);
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
