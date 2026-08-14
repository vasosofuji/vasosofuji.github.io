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
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const go = React.useCallback(
    (step: number) => {
      if (index === null || !photos.length) return;
      onNavigate((index + step + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

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
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const s = touchStart.current;
            touchStart.current = null;
            if (!s) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - s.x;
            const dy = t.clientY - s.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
          }}
        >
          <button ref={closeRef} type="button" className="pl-close" onClick={onClose} aria-label="Close">
            &times;
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="pl-nav pl-nav--prev"
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
              >
                &#8592;
              </button>
              <button
                type="button"
                className="pl-nav pl-nav--next"
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); go(1); }}
              >
                &#8594;
              </button>
            </>
          )}

          <motion.figure
            className="pl-figure"
            // Click inside the frame must not fall through to the backdrop.
            onClick={(e) => e.stopPropagation()}
            key={photo.src}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
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
                {photos.length > 1 && (
                  <p className="pl-counter">{index + 1} / {photos.length}</p>
                )}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
