'use client'

import React, { useRef } from 'react'
import { PanelArt } from '../../art/PanelArt'
import { PermitStamp } from '../../art/Ornaments'

export const AboutPanel: React.FC = React.memo(function AboutPanel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const paintDots = () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !img.naturalWidth) return

    const displayed = img.getBoundingClientRect().width || 400
    const cols = Math.max(48, Math.min(180, Math.round(displayed / 4.5)))
    const off = document.createElement('canvas')
    off.width = cols
    off.height = Math.max(1, Math.round((cols * img.naturalHeight) / img.naturalWidth))
    const rows = off.height
    const cell = img.naturalWidth / cols
    const octx = off.getContext('2d')
    if (!octx) return

    octx.drawImage(img, 0, 0, cols, rows)
    let data: Uint8ClampedArray
    try {
      data = octx.getImageData(0, 0, cols, rows).data
    } catch {
      return
    }

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(10, 10, 10, 0.72)'

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4
        if (data[i + 3] < 110) continue
        const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
        const dark = 1 - lum
        if (dark < 0.15) continue
        const r = (cell / 2) * 1.05 * ((dark - 0.15) / 0.85)
        ctx.beginPath()
        ctx.arc((x + 0.5) * cell, (y + 0.5) * cell, Math.max(0.7, r), 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  return (
    <section className="panel about" id="about" aria-labelledby="about-title">
      <PanelArt variant="about" />
      <div className="painted-band band-left" aria-hidden="true" />
      <div className="painted-band band-right" aria-hidden="true" />

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">02 / About</span>
          <h2 className="page-title" id="about-title" data-reveal>
            About
          </h2>
        </header>

        <div className="about-grid">
          <figure className="about-figure">
            <div className="about-frame">
              <span className="about-plate">
                <img
                  ref={imgRef}
                  className="about-img"
                  src="/potrait.png"
                  alt="Portrait of Dhruva Vura"
                  onLoad={paintDots}
                />
                <canvas ref={canvasRef} className="about-dots" aria-hidden="true" />
              </span>
            </div>
            <figcaption>
              <span className="name-yellow">Dhruva Vura</span> / Designer &amp; developer
            </figcaption>
          </figure>

          <div className="about-copy" data-reveal>
            <p className="about-lede">
              I make noisy signals legible.
              <span className="deva-accent" lang="hi">
                {' '}
                मेहनत
              </span>
            </p>
            <p className="about-bio">
              I am a designer and creative engineer working across identity systems, high-speed web platforms,
              and generative motion. Drawing conviction from Indian highway sign-painting, I build digital
              experiences with high tactile contrast, deep cultural character, and sub-millisecond execution.
            </p>
            <dl className="facts">
              <div>
                <dt>Based in</dt>
                <dd>Hyderabad &amp; Bengaluru</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Brand, Web, Motion</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>React 19, TypeScript, GLSL, Figma</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="status-hot">Open for Commissions</dd>
              </div>
            </dl>
            <p className="about-note">DOSSIER REF // ARCHIVE 2026 // DHRUVA VURA</p>
          </div>
        </div>

        <PermitStamp label="VERIFIED" sub="NH-44 // 2026" className="stamp-inline" />
      </div>
    </section>
  )
})


