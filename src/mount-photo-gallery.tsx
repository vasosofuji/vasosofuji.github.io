import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import MasonryGrid from '@/components/ui/masonry-grid';
import PhotoLightbox, { type LightboxPhoto } from '@/components/ui/photo-lightbox';

/**
 * Turns the photo grid already present in the page into a masonry layout.
 *
 * The cards are read straight out of the server-rendered markup rather than
 * duplicated into a data file: the HTML stays the single source of truth for
 * every photo and its camera/lens/location, and if this script never runs the
 * original grid is still on screen.
 */
type Photo = LightboxPhoto & { loading: 'lazy' | 'eager' };

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

  return (
    <>
      <MasonryGrid
        items={photos}
        className="masonry-grid--gallery"
        gap="1.5rem"
        staggerDelay={0.035}
        tilt={3}
        onItemClick={setOpenIndex}
        renderItem={(photo, i) => (
          // Same classes as the original markup so the existing hover
          // treatment — lift, image zoom, and the info panel sliding in
          // underneath — keeps working untouched.
          <div className="photo-card photo-card--masonry">
            <img
              src={photo.src}
              alt={photo.alt}
              loading={photo.loading}
              decoding="async"
              draggable={false}
            />
            <div className="photo-info">
              {photo.title && <h4>{photo.title}</h4>}
              {photo.details.map((d) => (
                <p key={d.label}>
                  <span>{d.label}:</span> {d.value}
                </p>
              ))}
            </div>
            <span className="sr-only">Open photo {i + 1} full screen</span>
          </div>
        )}
      />
      <PhotoLightbox photos={photos} index={openIndex} onClose={close} onNavigate={setOpenIndex} />
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
