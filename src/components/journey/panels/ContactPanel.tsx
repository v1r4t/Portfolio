'use client'

import React from 'react'
import confetti from 'canvas-confetti'
import { hornAudio } from '../../../utils/audio'
import { PanelArt } from '../../art/PanelArt'
import { BarcodeStrip, BulbChain } from '../../art/Ornaments'

export const ContactPanel: React.FC = () => {
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

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">05 / Contact</span>
          <h2 className="page-title" id="contact-title" data-reveal>
            Contact
          </h2>
        </header>

        <div className="contact-body" data-reveal>
          <p className="contact-lede">Have something loud in mind?</p>
          <a className="contact-email" href="mailto:dhruva.vura@gmail.com" title="Send email to Dhruva">
            dhruva.vura@gmail.com
          </a>

          <div className="contact-meta">
            <a className="social" href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="social" href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="social" href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>

          <p className="contact-note">
            DIRECT TRANSMISSION // AVAILABLE FOR IDENTITY, CREATIVE ENGINEERING &amp; SENIOR ROLES
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
}
