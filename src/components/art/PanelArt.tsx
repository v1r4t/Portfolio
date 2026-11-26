'use client'

import React from 'react'
import { useElementSize } from '../../utils/useElementSize'
import { BulbChain, ChevronBand, CornerCluster, HazardTape, ParichchitFrame, PermitStamp } from './Ornaments'

type Variant = 'poster' | 'about' | 'blogs' | 'projects' | 'contact'

interface CastItem {
  id: string
  x: number
  y: number
  s: number
  rot: number
  opacity?: number
}

const CAST: Record<Variant, CastItem[]> = {
  poster: [
    { id: 'm-star', x: 0.14, y: 0.42, s: 0.05, rot: 0 },
    { id: 'm-paisley', x: 0.2, y: 0.72, s: 0.05, rot: 20 },
    { id: 'm-marigold', x: 0.86, y: 0.62, s: 0.06, rot: 0 },
    { id: 'm-flower', x: 0.5, y: 0.93, s: 0.04, rot: 0 },
  ],
  about: [
    { id: 'm-peacock', x: 0.06, y: 0.16, s: 0.16, rot: -6, opacity: 0.9 },
    { id: 'm-paisley', x: 0.94, y: 0.24, s: 0.09, rot: 18 },
    { id: 'm-marigold', x: 0.91, y: 0.52, s: 0.07, rot: 0 },
    { id: 'm-jhumka', x: 0.86, y: 0.78, s: 0.08, rot: -12 },
    { id: 'm-kalash', x: 0.72, y: 0.9, s: 0.07, rot: 0 },
    { id: 'm-diya', x: 0.6, y: 0.94, s: 0.06, rot: 0 },
    { id: 'm-flower', x: 0.48, y: 0.9, s: 0.04, rot: 0 },
    { id: 'm-star', x: 0.35, y: 0.95, s: 0.04, rot: 0 },
    { id: 'm-paisley', x: 0.98, y: 0.66, s: 0.04, rot: -24 },
    { id: 'm-marigold', x: 0.07, y: 0.86, s: 0.06, rot: 0 },
  ],
  blogs: [
    { id: 'm-kalash', x: 0.06, y: 0.88, s: 0.07, rot: -6 },
    { id: 'm-cassette', x: 0.9, y: 0.9, s: 0.08, rot: 6 },
    { id: 'm-jhumka', x: 0.95, y: 0.6, s: 0.07, rot: 12 },
    { id: 'm-parrot', x: 0.08, y: 0.18, s: 0.11, rot: -8 },
    { id: 'm-flower', x: 0.3, y: 0.12, s: 0.04, rot: 0 },
    { id: 'm-paisley', x: 0.5, y: 0.95, s: 0.05, rot: 14 },
    { id: 'm-star', x: 0.7, y: 0.94, s: 0.04, rot: 0 },
    { id: 'm-marigold', x: 0.24, y: 0.96, s: 0.05, rot: 0 },
  ],
  projects: [
    { id: 'm-peacock', x: 0.93, y: 0.2, s: 0.14, rot: 6, opacity: 0.9 },
    { id: 'm-parrot', x: 0.06, y: 0.16, s: 0.1, rot: -8 },
    { id: 'm-kite', x: 0.12, y: 0.62, s: 0.08, rot: -10 },
    { id: 'm-elephant', x: 0.05, y: 0.9, s: 0.13, rot: -4 },
    { id: 'm-star', x: 0.32, y: 0.94, s: 0.04, rot: 0 },
    { id: 'm-paisley', x: 0.55, y: 0.95, s: 0.05, rot: 16 },
    { id: 'm-flower', x: 0.76, y: 0.95, s: 0.04, rot: 0 },
    { id: 'm-marigold', x: 0.95, y: 0.88, s: 0.06, rot: 0 },
  ],
  contact: [
    { id: 'm-elephant', x: 0.08, y: 0.2, s: 0.13, rot: -4 },
    { id: 'm-kalash', x: 0.93, y: 0.16, s: 0.08, rot: 4 },
    { id: 'm-peacock', x: 0.9, y: 0.66, s: 0.15, rot: 4 },
    { id: 'm-chilli', x: 0.5, y: 0.05, s: 0.16, rot: 3 },
    { id: 'm-diya', x: 0.3, y: 0.93, s: 0.07, rot: 0 },
    { id: 'm-marigold', x: 0.42, y: 0.95, s: 0.06, rot: 0 },
    { id: 'm-paisley', x: 0.62, y: 0.94, s: 0.05, rot: 16 },
    { id: 'm-star', x: 0.74, y: 0.96, s: 0.04, rot: 0 },
    { id: 'm-kite', x: 0.05, y: 0.72, s: 0.07, rot: -10 },
  ],
}

const EXTRAS: Record<Variant, React.ReactNode> = {
  poster: (
    <>
      <BulbChain className="bulbs-top" />
      <ChevronBand className="chevrons-bottom" flip />
    </>
  ),
  about: (
    <>
      <PermitStamp label="PERMIT" sub="ARCHIVE 2026" className="stamp-about" />
    </>
  ),
  blogs: (
    <>
      <PermitStamp label="DISPATCH" sub="NH-44" className="stamp-blogs" />
    </>
  ),
  projects: (
    <>
      <ChevronBand className="chevrons-bottom" flip />
      <HazardTape className="hazards-bottom" />
    </>
  ),
  contact: (
    <>
      <BulbChain className="bulbs-top" />
      <ChevronBand className="chevrons-bottom" flip />
      <HazardTape className="hazards-bottom" />
      <BulbChain className="bulbs-bottom" />
    </>
  ),
}

export const PanelArt: React.FC<{ variant: Variant }> = ({ variant }) => {
  const [artRef, { w, h }] = useElementSize<HTMLDivElement>()
  const cast = CAST[variant]

  return (
    <>
      <div className="lattice" aria-hidden="true" />
      <div className="trim-halftone" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <ParichchitFrame />
      {variant !== 'about' && variant !== 'contact' && <CornerCluster corner="tr" />}
      {variant === 'projects' && <CornerCluster corner="bl" />}
      {EXTRAS[variant]}

      <div ref={artRef} className="panel-art" aria-hidden="true">
        {w > 0 && h > 0 && (
          <svg className="panel-art-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
            {cast.map((item, idx) => {
              const size = item.s * Math.min(w, h) * 1.6
              const cx = item.x * w
              const cy = item.y * h
              return (
                <use
                  key={`${item.id}-${idx}`}
                  href={`#${item.id}`}
                  x={(cx - size / 2).toFixed(1)}
                  y={(cy - size / 2).toFixed(1)}
                  width={size.toFixed(1)}
                  height={size.toFixed(1)}
                  transform={`rotate(${item.rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
                  opacity={item.opacity ?? 1}
                />
              )
            })}
          </svg>
        )}
      </div>
    </>
  )
}
