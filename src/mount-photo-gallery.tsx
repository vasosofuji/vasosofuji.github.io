import { StrictMode, useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import MasonryGrid from '@/components/ui/masonry-grid';
import PhotoLightbox, { type LightboxPhoto } from '@/components/ui/photo-lightbox';

declare global {
  interface Window {
    updateSheetMeta?: () => void;
    photoI18n?: {
      label: (kind: string) => string;
      value: (kind: string, value: string) => string;
      title: (value: string) => string;
      lang: () => string;
    };
  }
}

/**
 * Turns the photo grid already present in the page into a masonry layout.
 *
 * The cards are read straight out of the server-rendered markup rather than
 * duplicated into a data file: the HTML stays the single source of truth for
 * every photo and its camera/lens/location, and if this script never runs the
 * original grid is still on screen.
 */
type Photo = LightboxPhoto & {
  loading: 'lazy' | 'eager';
  srcSet?: string;
  sizes?: string;
};

function readPhotosFromDom(grid: HTMLElement): Photo[] {
  return Array.from(grid.querySelectorAll<HTMLElement>('.photo-card')).map((card, i) => {
    const img = card.querySelector('img');
    const details: { label: string; value: string }[] = [];

    card.querySelectorAll('.photo-info p').forEach((p) => {
      const labelEl = p.querySelector('span');
      if (!labelEl) return;
      const label = labelEl.textContent?.replace(/:\s*$/, '').trim() ?? '';
      const value = (p.textContent ?? '').replace(labelEl.textContent ?? '', '').trim();
      if (label && value) details.push({ label, value });
    });

    return {
      src: img?.getAttribute('src') ?? '',
      // The markup carries sized derivatives; this component rebuilds the card
      // from scratch, so without carrying these across every photo page fell
      // back to the full gallery original. On a phone that is a couple of
      // hundred kB per card arriving one after another, which is exactly what
      // it looks like on screen.
      srcSet: img?.getAttribute('srcset') ?? undefined,
      sizes: img?.getAttribute('sizes') ?? undefined,
      alt: img?.getAttribute('alt') ?? '',
      title: card.querySelector('.photo-info h4')?.textContent?.trim() || undefined,
      details,
      // The first row is above the fold; everything after it can wait.
      loading: (i < 3 ? 'eager' : 'lazy') as Photo['loading'],
    };
  }).filter((p) => p.src);
}

function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  // The markup is authored in English; script.js holds the Macedonian for the
  // field labels, the places and the descriptive titles. Re-render whenever the
  // visitor switches language.
  const [lang, setLang] = useState(() => window.photoI18n?.lang() ?? 'en');
  useEffect(() => {
    const onLang = () => setLang(window.photoI18n?.lang() ?? 'en');
    window.addEventListener('languagechange', onLang);
    return () => window.removeEventListener('languagechange', onLang);
  }, []);

  const translated = useMemo(
    () =>
      photos.map((photo) => {
        const title = photo.title ? window.photoI18n?.title(photo.title) ?? photo.title : undefined;
        const details = photo.details.map((d) => ({
          label: window.photoI18n?.label(d.label) ?? d.label,
          value: window.photoI18n?.value(d.label, d.value) ?? d.value,
        }));

        // Alt text follows the language too. Locations are all written
        // "City, Country - Venue", so the venue reads first and the city
        // second - "Flying Bird - Ostrovche, Ohrid".
        const place = details.find((d) => /^(Location|Локација)$/.test(d.label))?.value;
        const parts = place?.match(/^(.*?),\s*[^,-]+\s*-\s*(.*)$/);
        const alt = title
          ? parts
            ? `${title} - ${parts[2].trim()}, ${parts[1].trim()}`
            : title
          : photo.alt;

        return { ...photo, title, details, alt };
      }),
    // `lang` is the trigger: photoI18n reads the current language internally.
    [photos, lang]
  );

  // The header caption counts the cards in the grid, but script.js computes it
  // on DOMContentLoaded - by which point this module has already emptied the
  // grid and React has not committed yet, so it would count zero and hide
  // itself. Recount once the cards are actually in the DOM.
  useEffect(() => {
    window.updateSheetMeta?.();
  }, []);

  return (
    <>
      <MasonryGrid
        items={translated}
        className="masonry-grid--gallery"
        gap="1.5rem"
        staggerDelay={0.035}
        tilt={3}
        // Two columns on a phone: smaller frames, but far more of the set
        // visible at once, and tapping any of them opens it full screen.
        breakpoints={[
          { min: 0, columns: 2 },
          { min: 1000, columns: 3 },
          { min: 1500, columns: 4 },
        ]}
        onItemClick={setOpenIndex}
        renderItem={(photo) => (
          // Same classes as the original markup so the existing hover
          // treatment - lift, image zoom, and the info panel sliding in
          // underneath - keeps working untouched.
          <div
            className="photo-card photo-card--masonry"
            role="button"
            tabIndex={0}
            aria-label={photo.title ? `${photo.title} - open full screen` : 'Open photo full screen'}
          >
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes={photo.sizes}
              alt={photo.alt}
              loading={photo.loading}
              decoding="async"
              draggable={false}
            />
            {/* Omitted entirely when a photo has no caption yet, so hovering
                it cannot reveal an empty panel. */}
            {(photo.title || photo.details.length > 0) && (
              <div className="photo-info">
                {photo.title && <h4>{photo.title}</h4>}
                {photo.details.map((d) => (
                  <p key={d.label}>
                    <span>{d.label}:</span> {d.value}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      />
      <PhotoLightbox photos={translated} index={openIndex} onClose={close} onNavigate={setOpenIndex} />
    </>
  );
}

const grid = document.querySelector<HTMLElement>('.gallery-grid');

if (grid) {
  const photos = readPhotosFromDom(grid);
  if (photos.length) {
    grid.textContent = '';
    grid.classList.add('gallery-grid--masonry');
    createRoot(grid).render(
      <StrictMode>
        <PhotoGallery photos={photos} />
      </StrictMode>
    );
  }
}
