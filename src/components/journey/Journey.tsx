'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { NavStop, PostMeta, Project } from '../../types'
import { HeroPoster } from './HeroPoster'
import { NavigationRoad } from './NavigationRoad'
import { AboutPanel } from './panels/AboutPanel'
import { BlogsPanel } from './panels/BlogsPanel'
import { ProjectsPanel } from './panels/ProjectsPanel'
import { ContactPanel } from './panels/ContactPanel'
import { PaintCanvas } from '../motion/PaintCanvas'
import { InkCursor } from '../motion/InkCursor'
import { HornReactive } from '../motion/HornReactive'

gsap.registerPlugin(SplitText)

interface JourneyProps {
  stops: NavStop[]
  projects: Project[]
  posts: PostMeta[]
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export const Journey: React.FC<JourneyProps> = ({ stops, projects, posts }) => {
  const trackRef = useRef<HTMLElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  const drivingTimeoutRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const currentIndexRef = useRef(0)
  const programmaticUntilRef = useRef(0)
  const lastProgressRef = useRef(-1)

  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDriving, setIsDriving] = useState(false)
  const [isRoadReady, setIsRoadReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Reveal road and lorry once the poster entrance finishes
  useEffect(() => {
    const timer = setTimeout(() => setIsRoadReady(true), reducedMotion ? 300 : 2400)
    return () => clearTimeout(timer)
  }, [reducedMotion])

  const applyScroll = useCallback(
    (scrollLeft: number) => {
      const track = trackRef.current
      if (!track) return
      const width = track.clientWidth
      const maxScroll = track.scrollWidth - width
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollLeft / maxScroll)) : 0
      if (Math.abs(progress - lastProgressRef.current) > 0.0004) {
        lastProgressRef.current = progress
        setScrollProgress(progress)
      }

      const activeIndex = Math.max(0, Math.min(stops.length - 1, Math.round(scrollLeft / width)))
      const isProgrammatic = Date.now() < programmaticUntilRef.current
      if (!isProgrammatic) {
        currentIndexRef.current = activeIndex
        setCurrentStopIndex(activeIndex)
      }

      const activeStop = stops[activeIndex]
      if (activeStop) {
        document.documentElement.style.backgroundColor = activeStop.bgTheme
        document.body.style.backgroundColor = activeStop.bgTheme
      }

      setIsDriving(true)
      if (drivingTimeoutRef.current) clearTimeout(drivingTimeoutRef.current)
      drivingTimeoutRef.current = window.setTimeout(() => {
        setIsDriving(false)
        const stop = stops[activeIndex]
        if (stop && window.location.hash !== `#${stop.id}`) {
          history.replaceState(null, '', `#${stop.id}`)
        }
      }, 180)
    },
    [stops]
  )

  const scrollToStop = useCallback(
    (index: number, immediate = false) => {
      const track = trackRef.current
      if (!track) return
      const targetIndex = Math.max(0, Math.min(stops.length - 1, index))
      const target = targetIndex * track.clientWidth
      currentIndexRef.current = targetIndex
      setCurrentStopIndex(targetIndex)
      programmaticUntilRef.current = Date.now() + 1400
      if (immediate) applyScroll(target)

      if (lenisRef.current && !immediate) {
        lenisRef.current.scrollTo(target, { duration: 1.1, easing: easeOutCubic })
      } else if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: true })
      } else {
        track.scrollTo({ left: target, behavior: reducedMotion ? 'auto' : 'smooth' })
      }
    },
    [stops.length, reducedMotion, applyScroll]
  )

  // Lenis smooth-wheel on the journey + magnetic snapping to panels
  useEffect(() => {
    const track = trackRef.current
    const content = innerRef.current
    if (!track || !content || reducedMotion) return

    const lenis = new Lenis({
      wrapper: track,
      content,
      orientation: 'horizontal',
      gestureOrientation: 'vertical',
      lerp: 0.11,
      smoothWheel: false,
      syncTouch: false,
      touchMultiplier: 1.4,
      autoRaf: true,
    })
    lenisRef.current = lenis

    let idleTimer: number | null = null
    let snapping = false

    const onLenisScroll = () => {
      if (snapping) return
      if (Date.now() < programmaticUntilRef.current) return
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        const width = track.clientWidth
        const current = track.scrollLeft
        const index = Math.max(0, Math.min(stops.length - 1, Math.round(current / width)))
        const target = index * width
        if (Math.abs(current - target) > 6) {
          snapping = true
          lenis.scrollTo(target, {
            duration: 1,
            easing: easeOutCubic,
            lock: true,
            onComplete: () => {
              snapping = false
            },
          })
        }
      }, 150)
    }

    lenis.on('scroll', onLenisScroll)

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion, stops.length])

  useEffect(() => {
    return () => {
      if (drivingTimeoutRef.current) clearTimeout(drivingTimeoutRef.current)
    }
  }, [])

  // Vertical wheel always steps the horizontal journey. This is deliberately
  // independent of Lenis's wheel path, which is disabled above, so a stale or
  // reduced-motion session cannot leave the slides stuck. Inner vertical
  // scrollers keep priority.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let accumulated = 0
    let lastStep = 0

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

      const target = event.target instanceof Element ? event.target : null
      const scroller = target?.closest<HTMLElement>('.panel-inner')
      if (scroller) {
        const overflowY = getComputedStyle(scroller).overflowY
        const canScrollVertically =
          (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
          scroller.scrollHeight > scroller.clientHeight
        if (canScrollVertically) {
          const atTop = scroller.scrollTop <= 0
          const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1
          if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return
        }
      }

      event.preventDefault()

      const now = performance.now()
      if (now - lastStep < 320) return
      accumulated += event.deltaY
      if (Math.abs(accumulated) < 40) return

      const direction = accumulated > 0 ? 1 : -1
      accumulated = 0
      lastStep = now

      const width = track.clientWidth
      const current = Math.round(track.scrollLeft / width)
      const next = Math.max(0, Math.min(stops.length - 1, current + direction))
      currentIndexRef.current = next
      setCurrentStopIndex(next)
      programmaticUntilRef.current = Date.now() + 1400
      track.scrollTo({
        left: next * width,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [reducedMotion, stops.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        scrollToStop(currentIndexRef.current + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        scrollToStop(currentIndexRef.current - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollToStop])

  // Deep-link restore: /#projects lands on the projects panel
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace('#', '')
      const index = stops.findIndex((stop) => stop.id === id)
      if (index >= 0) {
        requestAnimationFrame(() => scrollToStop(index, true))
      }
    }
    const timer = setTimeout(applyHash, 80)
    window.addEventListener('hashchange', applyHash)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('hashchange', applyHash)
    }
  }, [stops, scrollToStop])

  // GSAP entrance choreography: split-decal titles + staggered cards
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const panel = panelRefs.current[currentStopIndex]
    if (!panel) return

    const splits: SplitText[] = []
    const titles = Array.from(panel.querySelectorAll<HTMLElement>('.page-title'))
    titles.forEach((title) => {
      const split = new SplitText(title, { type: 'chars,words', charsClass: 'split-char' })
      splits.push(split)
      gsap.fromTo(
        split.chars,
        {
          yPercent: 74,
          opacity: 0,
          rotate: () => gsap.utils.random(-9, 9),
          transformOrigin: '0% 100%',
        },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.55,
          ease: 'back.out(1.7)',
          stagger: 0.035,
          overwrite: true,
        }
      )
    })

    const revealItems = panel.querySelectorAll('[data-reveal]:not(.page-title)')
    const cards = panel.querySelectorAll(
      '.blog-card, .project-card, .facts > div, .contact-meta > *, .about-frame, .marquee'
    )

    const ctx = gsap.context(() => {
      if (revealItems.length) {
        gsap.fromTo(
          revealItems,
          { y: 26, opacity: 0, rotate: 1.5 },
          { y: 0, opacity: 1, rotate: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', overwrite: true }
        )
      }
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out', delay: 0.08, overwrite: true }
        )
      }
      const chevrons = panel.querySelectorAll('.chevron-band path')
      if (chevrons.length) {
        gsap.fromTo(
          chevrons,
          { strokeDasharray: 1400, strokeDashoffset: 1400 },
          { strokeDashoffset: 0, duration: 1, ease: 'power2.out', overwrite: true }
        )
      }
    }, panel)

    return () => {
      ctx.revert()
      splits.forEach((split) => split.revert())
    }
  }, [currentStopIndex])

  const handleExplore = useCallback(() => scrollToStop(1), [scrollToStop])

  return (
    <div className="journey">
      <PaintCanvas progress={scrollProgress} stops={stops} />
      <InkCursor />
      <HornReactive />

      <main
        ref={trackRef}
        onScroll={(event) => applyScroll(event.currentTarget.scrollLeft)}
        className="track"
        tabIndex={0}
        aria-label="Dhruva Vura Portfolio Road"
      >
        <div className="track-inner" ref={innerRef}>
          <div className="panel-slot" ref={(el) => { panelRefs.current[0] = el }}>
            <HeroPoster onExploreClick={handleExplore} />
          </div>
          <div className="panel-slot" ref={(el) => { panelRefs.current[1] = el }}>
            <AboutPanel />
          </div>
          <div className="panel-slot" ref={(el) => { panelRefs.current[2] = el }}>
            <BlogsPanel posts={posts} />
          </div>
          <div className="panel-slot" ref={(el) => { panelRefs.current[3] = el }}>
            <ProjectsPanel projects={projects} />
          </div>
          <div className="panel-slot" ref={(el) => { panelRefs.current[4] = el }}>
            <ContactPanel />
          </div>
        </div>
      </main>

      <NavigationRoad
        currentStopIndex={currentStopIndex}
        scrollProgress={scrollProgress}
        isDriving={isDriving}
        isRoadReady={isRoadReady}
        onSelectStop={scrollToStop}
      />
    </div>
  )
}
