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
              <span className="name-yellow">Dhruva Vura</span> / CS undergrad &amp; builder
            </figcaption>
          </figure>

          <div className="about-copy" data-reveal>
            <p className="about-lede">
              I build loud ideas into clear systems.
              <span className="deva-accent" lang="hi">
                {' '}
                मेहनत
              </span>
            </p>
            <p className="about-bio">
              I’m a Computer Science undergrad, builder at heart, and curious mind who loves exploring the
              intersection of AI, technology, and creativity. I enjoy turning random ideas into real-world
              projects, experimenting with emerging tech, and figuring out how things work (sometimes by breaking
              them first).
            </p>
            <p className="about-bio">
              From building intelligent systems to participating in hackathons and exploring new ideas, I’m always
              looking for something interesting to create. I believe in learning by building, questioning the
              ordinary, and staying curious.
            </p>
            <p className="about-bio about-signoff">
              Still figuring things out, one project, one bug, and one crazy idea at a time.
            </p>
            <dl className="facts">
              <div>
                <dt>Based in</dt>
                <dd>Bengaluru, Karnataka, India</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Agentic AI</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Python, Java, JavaScript, React, FastAPI, PostgreSQL</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="status-hot">Looking For Opportunities</dd>
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


