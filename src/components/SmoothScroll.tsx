'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Smooth wheel scrolling + scroll-triggered entrances for the reading pages. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 })
    lenis.on('scroll', ScrollTrigger.update)

    const ctx = gsap.context(() => {
      const hero = document.querySelector('.detail-hero')
      if (hero) {
        const title = hero.querySelector('.detail-title')
        if (title) {
          gsap.to(title, {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
        }
        const cluster = hero.querySelector('.corner-cluster')
        if (cluster) {
          gsap.to(cluster, {
            yPercent: 26,
            rotate: 6,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      }

      const blocks = gsap.utils.toArray<HTMLElement>('.case-block, .permit-header')
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: block, start: 'top 90%', once: true },
          }
        )
      })
    })

    return () => {
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  return null
}
