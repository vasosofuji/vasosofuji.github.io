import * as React from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';

export interface LightboxPhoto {
  src: string;
  alt: string;
  title?: string;
  /** Label/value pairs already printed on the card, e.g. Camera / Lens / Location. */
  details: { label: string; value: string }[];
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Maps a position on the endless strip back onto the set. */
const wrap = (i: number, n: number) => (n > 0 ? ((i % n) + n) % n : 0);

// Past either of these the gesture counts as a page rather than a nudge. The
// distance is measured against the frame so it means the same thing on a phone
// as it does on a desktop; the velocity is what makes a short flick work.
const PAGE_FRACTION = 0.2;
const PAGE_MAX_PX = 110;
const FLICK_VELOCITY = 380;
// Below this the gesture was a tap that wandered, not a swipe.
const MIN_SWIPE_PX = 10;
// Dark between one photograph and the next. Without it the strip was pitched by
// exactly one frame width, and since a frame is rarely a whole number of pixels
// the rounding left a hairline of the previous photograph showing down the edge
// of the screen. It also gives the swipe an edge to read against.
const GUTTER = 20;
// How far a finger has to travel before the direction of the gesture is
// decided, so a scroll that drifts sideways is not read as a page turn.
const AXIS_LOCK_PX = 8;

export default function PhotoLightbox({ photos, index, onClose, onNavigate }: PhotoLightboxProps) {
  const open = index !== null;
  const count = photos.length;
  const reduceMotion = useReducedMotion();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  // The photographs sit on an endless strip: `base` is the one that was at
  // position zero when the frame opened and `pos` is how far along the strip
  // the view has travelled, so paging never runs out of strip in either
  // direction and there is always a real neighbour waiting on both sides.
  const [base, setBase] = React.useState(index ?? 0);
  const [pos, setPos] = React.useState(0);
  const current = wrap(base + pos, count);

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  // One frame plus the dark beside it: what the strip travels per photograph.
  const step = width + GUTTER;

  // The strip's offset. Held as a motion value so a finger can move it without
  // re-rendering anything - the caption, the counter and the arrows are outside
  // it and stay exactly where they are while the photographs slide underneath.
  const x = useMotionValue(0);
  const running = React.useRef<ReturnType<typeof animate> | null>(null);
  const flick = React.useRef(0);
  const jump = React.useRef(true);

  const settle = React.useCallback(
    (target: number, instant: boolean) => {
      running.current?.stop();
      if (instant || reduceMotion) {
        x.set(target);
        return;
      }
      running.current = animate(x, target, {
        type: 'spring',
        stiffness: 420,
        damping: 46,
        mass: 0.9,
        velocity: flick.current,
        restDelta: 0.5,
      });
      flick.current = 0;
    },
    [reduceMotion, x]
  );

  const go = React.useCallback(
    (step: number) => {
      if (count < 2 || !step) return;
      const next = pos + step;
      setPos(next);
      onNavigate(wrap(base + next, count));
    },
    [base, count, onNavigate, pos]
  );

  // An index arriving from outside - a card in the grid being tapped - drops
  // the strip onto that photograph rather than travelling to it.
  React.useEffect(() => {
    if (index === null || current === index) return;
    setBase(index);
    setPos(0);
    jump.current = true;
  }, [current, index]);

  // Park the strip on the current position. Only a step the visitor asked for
  // animates; opening on a photograph and re-measuring after a rotation both
  // land there without a journey.
  const lastPos = React.useRef(pos);
  React.useEffect(() => {
    const stepped = lastPos.current !== pos && !jump.current;
    lastPos.current = pos;
    jump.current = false;
    settle(-pos * step, !stepped);
  }, [pos, settle, step]);

  // getBoundingClientRect, not clientWidth: the latter is rounded to whole
  // pixels, and a third of a pixel of error per frame is all it takes to leave
  // the edge of the neighbouring photograph on screen.
  const measure = React.useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    if (node) setWidth(node.getBoundingClientRect().width);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (viewportRef.current) {
        jump.current = true;
        setWidth(viewportRef.current.getBoundingClientRect().width);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  // Keyboard: Escape closes, arrows page through the set.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, go]);

  // Hold the page still behind the overlay without the usual scrollbar jump.
  React.useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    closeRef.current?.focus();
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  React.useEffect(() => () => running.current?.stop(), []);

  // --- THE SWIPE ---
  // Written against pointer events rather than handed to a drag helper: the
  // strip has to follow the finger from the exact offset it was already at,
  // stay inside the two neighbouring frames, and hand its speed to the spring
  // that finishes the movement. That is what makes it read as one card being
  // pushed aside to get at the next rather than as an image being dragged and
  // then swapped once it is let go.
  const drag = React.useRef<{
    id: number;
    startX: number;
    startY: number;
    from: number;
    axis: 'x' | 'y' | null;
    lastX: number;
    lastT: number;
    velocity: number;
  } | null>(null);
  const draggedAt = React.useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || reduceMotion || e.button > 0) return;
    running.current?.stop();
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      from: x.get(),
      axis: null,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (d.axis === null) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      // A gesture that set off vertically belongs to the page, not to the strip.
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      d.axis = 'x';
      // Not every pointer can be captured, and a gesture that cannot be is
      // still a gesture - it just ends at the edge of the frame instead.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* no capture available */
      }
    }

    const now = performance.now();
    const elapsed = now - d.lastT;
    if (elapsed > 0) d.velocity = ((e.clientX - d.lastX) / elapsed) * 1000;
    d.lastX = e.clientX;
    d.lastT = now;

    // Free within one frame either side; past that it drags heavily, so the
    // gesture cannot be thrown three photographs along in one go.
    const span = step || 1;
    const min = -(pos + 1) * span;
    const max = -(pos - 1) * span;
    let next = d.from + dx;
    if (next < min) next = min + (next - min) * 0.2;
    else if (next > max) next = max + (next - max) * 0.2;
    x.set(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.axis !== 'x') return;

    draggedAt.current = Date.now();
    const rest = -pos * (step || 1);
    const offset = x.get() - rest;
    const travelled = Math.abs(offset);
    const threshold = Math.min(PAGE_MAX_PX, (width || 1) * PAGE_FRACTION);
    const paged =
      travelled > MIN_SWIPE_PX && (travelled > threshold || Math.abs(d.velocity) > FLICK_VELOCITY);

    flick.current = d.velocity;
    if (paged) go(offset < 0 ? 1 : -1);
    else settle(rest, false);
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    drag.current = null;
    settle(-pos * (step || 1), false);
  };

  // Only the photograph and the text are inert; the dark around them closes,
  // the way it always has. A swipe that finishes over that dark fires a click
  // of its own, which is what the moment's grace period is for.
  const onOverlayClick = (e: React.MouseEvent) => {
    if (Date.now() - draggedAt.current < 350) return;
    if ((e.target as HTMLElement).closest('.pl-image, .pl-caption, .pl-close, .pl-controls')) return;
    onClose();
  };

  const photo = index === null ? null : photos[current];
  const slots = count > 1 ? [pos - 1, pos, pos + 1] : [pos];

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="pl-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={photo.title || photo.alt || 'Photo'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          onClick={onOverlayClick}
        >
          <button ref={closeRef} type="button" className="pl-close" onClick={onClose} aria-label="Close">
            &times;
          </button>

          {/* The frame and its caption. Kept clear of the buttons outside it so
              nothing that is meant to hold still shares a transform with the
              photographs - which is also what used to throw the desktop arrows
              across the screen a moment after the frame opened. */}
          <motion.div
            className="pl-stage"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <figure className="pl-figure">
              <div className="pl-viewport" ref={measure}>
                <motion.div
                  className="pl-track"
                  style={{ x }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerCancel}
                >
                  {slots.map((slot) => {
                    const shown = photos[wrap(base + slot, count)];
                    const isCurrent = slot === pos;
                    return (
                      <div
                        className="pl-slide"
                        key={slot}
                        style={{ transform: `translateX(calc(${slot * 100}% + ${slot * GUTTER}px))` }}
                        aria-hidden={!isCurrent}
                      >
                        <img
                          className="pl-image"
                          src={shown.src}
                          alt={isCurrent ? shown.alt : ''}
                          draggable={false}
                        />
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {(photo.title || photo.details.length > 0) && (
                <figcaption className="pl-caption">
                  <motion.div
                    key={current}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  >
                    {photo.title && <h3 className="pl-title">{photo.title}</h3>}
                    {photo.details.length > 0 && (
                      <dl className="pl-details">
                        {photo.details.map((d) => (
                          <div key={d.label} className="pl-detail">
                            <dt>{d.label}</dt>
                            <dd>{d.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </motion.div>
                </figcaption>
              )}
            </figure>
          </motion.div>

          {/* On a phone these render as a row beneath the frame; from 641px up
              the wrapper is display:contents and the arrows return to their
              pinned positions at the screen edges. Either way they are outside
              the frame, so the swipe never carries them along with it. */}
          {count > 1 && (
            <div className="pl-controls">
              <button
                type="button"
                className="pl-nav pl-nav--prev"
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <p className="pl-counter">{current + 1} / {count}</p>
              <button
                type="button"
                className="pl-nav pl-nav--next"
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); go(1); }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
