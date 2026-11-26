'use client'

import React, { useEffect, useState } from 'react'
import type { GalleryPhoto } from '../../types'

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') {
        setActive((current) => (current === null ? null : (current + 1) % photos.length))
      }
      if (event.key === 'ArrowLeft') {
        setActive((current) =>
          current === null ? null : (current - 1 + photos.length) % photos.length,
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, photos.length])

  if (photos.length === 0) return null
  const current = active === null ? null : photos[active]

  return (
    <section className="photo-gallery" aria-label="Photography">
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className="photo-card"
            onClick={() => setActive(index)}
            title="View photograph"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
            />
            <span className="photo-caption">{photo.caption}</span>
          </button>
        ))}
      </div>

      {current && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="photo-close"
            onClick={() => setActive(null)}
            aria-label="Close photograph"
          >
            ✕
          </button>
          <button
            type="button"
            className="photo-nav photo-prev"
            onClick={(event) => {
              event.stopPropagation()
              setActive((position) =>
                position === null ? null : (position - 1 + photos.length) % photos.length,
              )
            }}
            aria-label="Previous photograph"
          >
            ←
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} width={current.width} height={current.height} />
            <figcaption>{current.caption}</figcaption>
          </figure>
          <button
            type="button"
            className="photo-nav photo-next"
            onClick={(event) => {
              event.stopPropagation()
              setActive((position) => (position === null ? null : (position + 1) % photos.length))
            }}
            aria-label="Next photograph"
          >
            →
          </button>
        </div>
      )}
    </section>
  )
}
