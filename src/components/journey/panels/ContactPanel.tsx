'use client'

import React from 'react'
import confetti from 'canvas-confetti'
import { hornAudio } from '../../../utils/audio'
import { PanelArt } from '../../art/PanelArt'
import { BarcodeStrip, BulbChain } from '../../art/Ornaments'

export const ContactPanel: React.FC = React.memo(function ContactPanel() {
  const handleHornClick = () => {
    hornAudio.playHorn('melody')
    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.75 },
      colors: ['#ffd400', '#ff2e88', '#00b3b0', '#e2231a'],
    })
  }

  return (
    <section className="panel contact" id="contact" aria-labelledby="contact-title">
      <PanelArt variant="contact" />

      <div className="panel-inner" data-lenis-prevent-vertical>
        <header className="page-head">
          <span className="page-kicker">05 / Contact</span>
          <h2 className="page-title" id="contact-title" data-reveal>
            Contact
          </h2>
        </header>

        <div className="contact-body" data-reveal>
          <p className="contact-lede">Have something loud in mind?</p>
          <a className="contact-email" href="mailto:dhruvav0308@gmail.com" title="Send email to Dhruva">
            dhruvav0308@gmail.com
          </a>

          <div className="contact-meta">
            <a className="social" href="https://github.com/v1r4t/" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className="social"
              href="https://www.linkedin.com/in/dhruva-vura/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="social"
              href="https://www.instagram.com/dhruvvv.duh"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>

          <p className="contact-note">
            DIRECT TRANSMISSION // OPEN TO INTERNSHIPS &amp; EARLY-CAREER AI ROLES
          </p>

          <div className="contact-strip">
            <BarcodeStrip className="contact-barcode" />
            <BulbChain className="bulbs-inline" />
          </div>

          <button type="button" className="horn-sign" onClick={handleHornClick} title="Click to blow authentic truck horn!">
            Horn OK Please
          </button>
        </div>
      </div>
    </section>
  )
})


