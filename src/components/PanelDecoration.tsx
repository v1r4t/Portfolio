import React from 'react'
import { useElementSize } from '../utils/useElementSize'

interface PanelDecorationProps {
  panel: 'about' | 'blogs' | 'projects' | 'contact'
}

const PANEL_CAST = {
  about: [
    { id: 'm-paisley', x: 0.88, y: 0.55, s: 0.13, rot: 16 },
    { id: 'm-marigold', x: 0.8, y: 0.86, s: 0.075, rot: 0 },
    { id: 'm-reel', x: 0.62, y: 0.86, s: 0.07, rot: -8 },
    { id: 'm-jhumka', x: 0.44, y: 0.9, s: 0.07, rot: -12 },
  ],
  blogs: [
    { id: 'm-kalash', x: 0.09, y: 0.86, s: 0.09, rot: -6 },
    { id: 'm-cassette', x: 0.62, y: 0.88, s: 0.085, rot: 5 },
    { id: 'm-jhumka', x: 0.92, y: 0.6, s: 0.09, rot: 12 },
  ],
  projects: [
    { id: 'm-parrot', x: 0.87, y: 0.1, s: 0.085, rot: 8 },
    { id: 'm-marigold', x: 0.72, y: 0.17, s: 0.06, rot: 0 },
  ],
  contact: [
    { id: 'm-diya', x: 0.42, y: 0.9, s: 0.08, rot: 0 },
    { id: 'm-marigold', x: 0.72, y: 0.9, s: 0.08, rot: 0 },
    { id: 'm-paisley', x: 0.56, y: 0.84, s: 0.09, rot: 14 },
    { id: 'm-reel', x: 0.3, y: 0.7, s: 0.07, rot: 10 },
  ],
}

const HANG_SPECS = {
  about: { x: 0.925, s: 0.3, rot: 5 },
  blogs: { x: 0.935, s: 0.24, rot: -4 },
  contact: { x: 0.925, s: 0.3, rot: 5 },
}

export const PanelDecoration: React.FC<PanelDecorationProps> = ({ panel }) => {
  const cast = PANEL_CAST[panel] || []
  const hang = HANG_SPECS[panel as keyof typeof HANG_SPECS]
  const [artRef, { w, h }] = useElementSize<HTMLDivElement>()
  const hangSize = hang && w > 0 ? Math.min(hang.s * h, w * 0.42) : 0
  const hangWidth = hangSize * (180 / 240)
  const hangX =
    hangSize > 0 ? Math.min(hang.x * w, w - 14 - hangWidth / 2) - hangWidth / 2 : 0

  return (
    <>
      {/* Dense Jaali Lattice */}
      <div className="lattice" aria-hidden="true" />

      {/* Riso Screen and Floral Trim Frame */}
      <div className="trim" aria-hidden="true">
        <div className="trim-halftone" />
        <div className="trim-frame" />

        {/* Hanging Nimbu-Mirchi Evil-Eye Ward */}
        {hang && w > 0 && h > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g transform={`rotate(${hang.rot} ${(hangX + hangWidth / 2).toFixed(1)} 0)`}>
              <use
                href="#m-chilli"
                x={hangX.toFixed(1)}
                y={(-hangSize * 0.02).toFixed(1)}
                width={hangWidth.toFixed(1)}
                height={hangSize.toFixed(1)}
              />
            </g>
          </svg>
        )}
      </div>

      {/* Film Grain Texture */}
      <div className="grain" aria-hidden="true" />

      {/* Folklore Vector Motifs */}
      <div
        ref={artRef}
        className="panel-art absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {w > 0 && h > 0 && (
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="xMidYMid slice"
          >
            {cast.map((item, idx) => {
              const size = item.s * Math.min(w, h) * 1.6
              const cx = item.x * w
              const cy = item.y * h
              return (
                <use
                  key={idx}
                  href={`#${item.id}`}
                  x={(cx - size / 2).toFixed(1)}
                  y={(cy - size / 2).toFixed(1)}
                  width={size.toFixed(1)}
                  height={size.toFixed(1)}
                  transform={`rotate(${item.rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
                />
              )
            })}
          </svg>
        )}
      </div>
    </>
  )
}
