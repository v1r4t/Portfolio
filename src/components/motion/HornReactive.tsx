'use client'

import { useEffect } from 'react'
import { hornAudio } from '../../utils/audio'

/**
 * Listens for horn playback and feeds the live waveform into a CSS variable,
 * so the bulb chains (and any other themed element) glow with the actual audio.
 */
export function HornReactive() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const root = document.documentElement

    const onHorn = () => {
      cancelAnimationFrame(raf)
      const start = performance.now()

      const tick = (now: number) => {
        const elapsed = now - start
        const decay = Math.max(0, 1 - elapsed / 1500)
        const level = hornAudio.getLevel() * decay
        root.style.setProperty('--horn-level', level.toFixed(3))
        if (elapsed < 1500) {
          raf = requestAnimationFrame(tick)
        } else {
          root.style.setProperty('--horn-level', '0')
        }
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('horn-play', onHorn)
    return () => {
      window.removeEventListener('horn-play', onHorn)
      cancelAnimationFrame(raf)
      root.style.setProperty('--horn-level', '0')
    }
  }, [])

  return null
}
