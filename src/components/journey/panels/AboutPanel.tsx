'use client'

import React from 'react'
import { PanelArt } from '../../art/PanelArt'
import { PermitStamp } from '../../art/Ornaments'
import { PortraitHalftone } from '../../motion/PortraitHalftone'

export const AboutPanel: React.FC = React.memo(function AboutPanel() {
  return (
    <section className="panel about" id="about" aria-labelledby="about-title">
      <PanelArt variant="about" />

      <div className="panel-inner" data-lenis-prevent-vertical>
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
                <PortraitHalftone
                  src="/potrait.png"
                  alt="Portrait of Dhruva Vura"
                  imageClassName="about-img"
                  canvasClassName="about-dots"
                />
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
                <dd>React 19, TypeScript, WGSL, Figma</dd>
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


