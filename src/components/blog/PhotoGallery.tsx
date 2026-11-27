'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { GalleryPhoto } from '../../types'

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const lastFocused = useRef<HTMLElement | null>(null)
  const isOpen = active !== null

  useEffect(() => {
    if (!isOpen) return

    lastFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
      lastFocused.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (active === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActive(null)
        return
      }
      if (event.key === 'ArrowRight') {
        setActive((current) => (current === null ? null : (current + 1) % photos.length))
        return
      }
      if (event.key === 'ArrowLeft') {
        setActive((current) =>
          current === null ? null : (current - 1 + photos.length) % photos.length,
        )
        return
      }
      if (event.key !== 'Tab') return

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
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
          ref={dialogRef}
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          data-lenis-prevent
          onClick={() => setActive(null)}
        >
          <button
            ref={closeRef}
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
