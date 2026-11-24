import React from 'react'
import { hornAudio } from '../utils/audio'
import confetti from 'canvas-confetti'
import { PanelDecoration } from './PanelDecoration'

export const ContactSection: React.FC = () => {
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
      <PanelDecoration panel="contact" />

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">05 / Contact</span>
          <h2 className="page-title" id="contact-title">
            Contact
          </h2>
        </header>

        <div className="contact-body">
          <p className="contact-lede">Have something loud in mind?</p>
          <a
            className="contact-email"
            href="mailto:dhruva.vura@gmail.com"
            title="Send email to Dhruva"
          >
            dhruva.vura@gmail.com
          </a>

          <div className="contact-meta">
            <a
              className="social"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="social"
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="social"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>

          <p className="contact-note">
            DIRECT TRANSMISSION // AVAILABLE FOR IDENTITY, CREATIVE ENGINEERING &amp; SENIOR ROLES
          </p>

          <div
            className="horn-sign"
            onClick={handleHornClick}
            title="Click to blow authentic truck horn!"
            role="button"
            tabIndex={0}
          >
            Horn OK Please
          </div>
        </div>
      </div>
    </section>
  )
}
