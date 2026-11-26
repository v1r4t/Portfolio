'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { hornAudio } from '../../utils/audio'
import { useElementSize } from '../../utils/useElementSize'
import { PanelArt } from '../art/PanelArt'
import { PortraitHalftone } from '../motion/PortraitHalftone'

interface HeroPosterProps {
  onExploreClick?: () => void
}

function seeded(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function archPath(cx: number, top: number, bottom: number, hw: number) {
  const mid = top + (bottom - top) * 0.52
  return (
    `M ${cx - hw} ${bottom} L ${cx - hw} ${mid} ` +
    `C ${cx - hw} ${top + (bottom - top) * 0.18} ${cx - hw * 0.45} ${top + (bottom - top) * 0.04} ${cx} ${top} ` +
    `C ${cx + hw * 0.45} ${top + (bottom - top) * 0.04} ${cx + hw} ${top + (bottom - top) * 0.18} ${cx + hw} ${mid} ` +
    `L ${cx + hw} ${bottom} Z`
  )
}

/* The mural cast, placed by centre as fractions of the panel. */
const MURAL_CAST = [
  { id: 'm-lotus', x: 0.055, y: 0.095, s: 0.12, rot: -12 },
  { id: 'm-parrot', x: 0.795, y: 0.105, s: 0.1, rot: 10 },
  { id: 'm-reel', x: 0.3, y: 0.1, s: 0.085, rot: -8 },
  { id: 'm-cassette', x: 0.72, y: 0.075, s: 0.11, rot: 7 },
  { id: 'm-elephant', x: 0.1, y: 0.31, s: 0.2, rot: -4 },
  { id: 'm-jhumka', x: 0.045, y: 0.67, s: 0.1, rot: -14 },
  { id: 'm-paisley', x: 0.3, y: 0.58, s: 0.09, rot: 18 },
  { id: 'm-kalash', x: 0.7, y: 0.84, s: 0.085, rot: 0 },
  { id: 'm-peacock', x: 0.9, y: 0.33, s: 0.26, rot: 0 },
  { id: 'm-auto', x: 0.87, y: 0.66, s: 0.19, rot: -3 },
  { id: 'm-reel', x: 0.955, y: 0.86, s: 0.075, rot: 14 },
  { id: 'm-marigold', x: 0.78, y: 0.9, s: 0.085, rot: 0 },
  { id: 'm-marigold', x: 0.33, y: 0.9, s: 0.06, rot: 0 },
  { id: 'm-diya', x: 0.3, y: 0.8, s: 0.07, rot: 0 },
  { id: 'm-flower', x: 0.62, y: 0.06, s: 0.055, rot: 0 },
  { id: 'm-paisley', x: 0.66, y: 0.19, s: 0.045, rot: -22 },
  { id: 'm-star', x: 0.16, y: 0.52, s: 0.05, rot: 0 },
  { id: 'm-kite', x: 0.52, y: 0.12, s: 0.05, rot: 12 },
]

export const HeroPoster: React.FC<HeroPosterProps> = ({ onExploreClick }) => {
  const [curtainReady, setCurtainReady] = useState(false)
  const [curtainGone, setCurtainGone] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLanded, setIsLanded] = useState(false)

  const loadMarkRef = useRef<HTMLDivElement | null>(null)
  const loadPercentRef = useRef<HTMLSpanElement | null>(null)
  const topWordRef = useRef<HTMLDivElement | null>(null)
  const [posterRef, { w, h }] = useElementSize<HTMLElement>()

  // Entrance choreography: the flying Telugu mark lands on the poster word.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const alreadyPasted = (() => {
      try {
        return sessionStorage.getItem('poster-pasted') === '1'
      } catch {
        return false
      }
    })()
    const hashTarget = window.location.hash
    const landingElsewhere = hashTarget.length > 1 && hashTarget !== '#home'

    if (reduced || alreadyPasted || landingElsewhere) {
      setCurtainReady(true)
      setCurtainGone(true)
      setIsRevealed(true)
      setIsLanded(true)
      try {
        sessionStorage.setItem('poster-pasted', '1')
      } catch {
        /* private mode */
      }
      return
    }

    let flightTween: gsap.core.Tween | null = null
    let revealTimer: ReturnType<typeof setTimeout> | null = null

    const counter = { value: 0 }
    const counterTween = gsap.to(counter, {
      value: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (loadPercentRef.current) {
          loadPercentRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
        }
      },
    })

    const timer = setTimeout(() => {
      setCurtainReady(true)

      revealTimer = setTimeout(() => {
        setCurtainGone(true)
        setIsRevealed(true)

        const mark = loadMarkRef.current
        const topWord = topWordRef.current

        if (mark && topWord) {
          const from = mark.getBoundingClientRect()
          const to = topWord.getBoundingClientRect()
          const dx = to.left + to.width / 2 - (from.left + from.width / 2)
          const dy = to.top + to.height / 2 - (from.top + from.height / 2)

          gsap.set(mark, { xPercent: -50, yPercent: -50, rotation: -6 })
          flightTween = gsap.to(mark, {
            x: dx,
            y: dy,
            duration: 0.9,
            ease: 'power3.inOut',
            onComplete: () => {
              setIsLanded(true)
              try {
                sessionStorage.setItem('poster-pasted', '1')
              } catch {
                /* private mode */
              }
            },
          })
        } else {
          setIsLanded(true)
        }
      }, 140)
    }, 1200)

    return () => {
      clearTimeout(timer)
      if (revealTimer) clearTimeout(revealTimer)
      counterTween.kill()
      flightTween?.kill()
    }
  }, [])

  const handleHornClick = (type: 'brass' | 'melody') => {
    hornAudio.playHorn(type)
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ffd400', '#ff2e88', '#00b3b0', '#e2231a'],
    })
  }

  const renderSunburstRays = (width: number, height: number) => {
    const N = 22
    const cx = width * 0.5
    const oy = height * 0.43
    const reach = Math.hypot(width, height)
    const rays: string[] = []

    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2
      const a1 = ((i + 1) / N) * Math.PI * 2
      const pad = (a1 - a0) * 0.3
      const p0 = `${(cx + Math.cos(a0 + pad) * reach).toFixed(1)} ${(oy + Math.sin(a0 + pad) * reach).toFixed(1)}`
      const p1 = `${(cx + Math.cos(a1 - pad) * reach).toFixed(1)} ${(oy + Math.sin(a1 - pad) * reach).toFixed(1)}`
      rays.push(`M ${cx.toFixed(1)} ${oy.toFixed(1)} L ${p0} L ${p1} Z`)
    }
    return rays.join(' ')
  }

  const renderBandhaniDots = (width: number, height: number) => {
    const clusters = [
      [0.12, 0.24],
      [0.36, 0.14],
      [0.74, 0.88],
      [0.94, 0.52],
      [0.24, 0.78],
    ]
    const dots: React.ReactNode[] = []
    const colors = ['#ffd400', '#00b3b0', '#1b3a8c', '#e2231a']

    clusters.forEach(([cx0, cy0], ci) => {
      for (let i = 0; i < 12; i++) {
        const x = (cx0 + (seeded(ci * 20 + i) - 0.5) * 0.12) * width
        const y = (cy0 + (seeded(ci * 20 + i + 7) - 0.5) * 0.14) * height
        const r = 3 + seeded(ci * 20 + i + 3) * 8
        const fill = colors[Math.floor(seeded(ci * 20 + i + 11) * 4)]
        dots.push(
          <circle key={`dot-${ci}-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r.toFixed(1)} fill={fill} stroke="#0a0a0a" strokeWidth="2" />
        )
      }
    })
    return dots
  }

  return (
    <section ref={posterRef} className="poster" id="home" aria-label="Home">
      <h1 className="sr-only">Dhruva Vura — designer and developer</h1>

      <PanelArt variant="poster" />

      {!isLanded && (
        <div className={`load ${curtainReady ? 'is-ready' : ''} ${curtainGone ? 'is-gone' : ''}`} aria-hidden="true">
          <div className="load-meta">
            <div className="load-meter" aria-hidden="true">
              <i />
            </div>
            <div className="load-label">
              Pasting the poster <span ref={loadPercentRef} className="load-percent">000</span>
            </div>
          </div>
        </div>
      )}

      {!isLanded && (
        <div ref={loadMarkRef} className="load-mark" lang="te" aria-hidden="true">
          ధ్రువ
        </div>
      )}

      {isRevealed && w > 0 && h > 0 && (
        <div className="mural-wrap" aria-hidden="true">
          <svg className="mural-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="arch-niche-clip">
                <path d={archPath(w * 0.5, h * 0.14, h * 1.02, Math.min(w * 0.17, h * 0.3))} />
              </clipPath>
            </defs>

            <path
              d={archPath(w * 0.5, h * 0.14, h * 1.02, Math.min(w * 0.17, h * 0.3))}
              fill="#1b3a8c"
              stroke="#0a0a0a"
              strokeWidth={Math.max(8, h * 0.014)}
            />

            <g clipPath="url(#arch-niche-clip)">
              <circle cx={w * 0.5} cy={h * 0.43} r={h * 0.13} fill="#ffd400" opacity="0.18" />
              <path d={renderSunburstRays(w, h)} fill="#ffd400" opacity="0.3" />
            </g>

            {MURAL_CAST.map((m, idx) => {
              const size = m.s * Math.min(w, h) * 1.6
              const cx = m.x * w
              const cy = m.y * h
              return (
                <use
                  key={`${m.id}-${idx}`}
                  href={`#${m.id}`}
                  x={(cx - size / 2).toFixed(1)}
                  y={(cy - size / 2).toFixed(1)}
                  width={size.toFixed(1)}
                  height={size.toFixed(1)}
                  transform={`rotate(${m.rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
                />
              )
            })}

            {renderBandhaniDots(w, h)}
          </svg>
        </div>
      )}

      <div ref={topWordRef} className="top-word" lang="te" style={{ opacity: isLanded ? 0.95 : 0 }}>
        ధ్రువ
      </div>

      <div className="wordmark" aria-hidden="true" style={{ opacity: isLanded ? 1 : 0 }}>
        Dhruva Vura
      </div>

      <div className="role" data-reveal>
        I make noisy signals legible
      </div>

      <div className="name-side left">
        <span>DHRUVA</span>
      </div>

      <div className="portrait-wrap">
        <PortraitHalftone
          src="/potrait.png"
          alt="Illustrated portrait of Dhruva Vura"
          imageClassName="portrait"
          canvasClassName="portrait-dots"
        />
      </div>

      <div className="name-side right">
        <span>VURA</span>
      </div>

      <button
        type="button"
        className="block lotus"
        title="Tap for Brass Horn!"
        aria-label="Play the brass horn"
        onClick={() => handleHornClick('brass')}
      >
        ✿
      </button>

      <button
        type="button"
        className="block slogan"
        title="Tap for Melodic Horn!"
        onClick={() => {
          handleHornClick('melody')
          if (onExploreClick) onExploreClick()
        }}
      >
        Horn OK Please
      </button>
    </section>
  )
}
