import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

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

export default function PhotoLightbox({ photos, index, onClose, onNavigate }: PhotoLightboxProps) {
  const open = index !== null;
  const reduceMotion = useReducedMotion();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  // Which way the set was last moved through, so the incoming photograph enters
  // from the side the outgoing one left towards rather than always the same
  // side. Zero on first open, where there is nothing to come from.
  const [direction, setDirection] = React.useState(0);

  const go = React.useCallback(
    (step: number) => {
      if (index === null || !photos.length) return;
      setDirection(step > 0 ? 1 : -1);
      onNavigate((index + step + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  // A freshly opened lightbox should not slide in from anywhere.
  React.useEffect(() => {
    if (!open) setDirection(0);
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

  const photo = index === null ? null : photos[index];

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
          onClick={onClose}

        >
          <button ref={closeRef} type="button" className="pl-close" onClick={onClose} aria-label="Close">
            &times;
          </button>

          <motion.figure
            className="pl-figure"
            // Click inside the frame must not fall through to the backdrop.
            onClick={(e) => e.stopPropagation()}
            key={photo.src}
            // The frame follows the finger and the next photograph arrives from
            // the side it was dragged towards. Waiting for the finger to lift
            // and then jumping to the next image gave no sense of moving
            // through a set; this reads as pushing one card aside to get at the
            // one behind it. Vertical drag stays free so the page underneath
            // still scrolls the way it should.
            drag={photos.length > 1 && !reduceMotion ? 'x' : false}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.28}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const far = Math.abs(info.offset.x) > 90;
              const fast = Math.abs(info.velocity.x) > 420;
              if (far || fast) go(info.offset.x < 0 ? 1 : -1);
            }}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, scale: 0.97, x: direction === 0 ? 0 : direction * 90 }
            }
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ touchAction: 'pan-y', cursor: photos.length > 1 ? 'grab' : 'default' }}
          >
            <img className="pl-image" src={photo.src} alt={photo.alt} />

            {(photo.title || photo.details.length > 0) && (
              <figcaption className="pl-caption">
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
              </figcaption>
            )}

            {/* On a phone these render as a row beneath the caption; from 641px
                up the wrapper is display:contents and the buttons return to
                their pinned positions at the screen edges. */}
            {photos.length > 1 && (
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
                <p className="pl-counter">{index + 1} / {photos.length}</p>
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
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
