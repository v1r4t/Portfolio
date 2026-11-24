'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { NavStop, PostMeta, Project } from '../../types'
import { HeroPoster } from './HeroPoster'
import { NavigationRoad } from './NavigationRoad'
import { AboutPanel } from './panels/AboutPanel'
import { BlogsPanel } from './panels/BlogsPanel'
import { ProjectsPanel } from './panels/ProjectsPanel'
import { ContactPanel } from './panels/ContactPanel'

interface JourneyProps {
  stops: NavStop[]
  projects: Project[]
  posts: PostMeta[]
}

export const Journey: React.FC<JourneyProps> = ({ stops, projects, posts }) => {
  const trackRef = useRef<HTMLElement | null>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  const drivingTimeoutRef = useRef<number | null>(null)

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

  const scrollToStop = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current
    if (!track) return
    const targetIndex = Math.max(0, Math.min(stops.length - 1, index))
    track.scrollTo({ left: targetIndex * track.clientWidth, behavior })
    setCurrentStopIndex(targetIndex)
  }, [stops.length])

  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    const maxScroll = scrollWidth - clientWidth

    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollLeft / maxScroll)) : 0
    setScrollProgress(progress)

    const activeIndex = Math.round(scrollLeft / clientWidth)
    setCurrentStopIndex(activeIndex)

    const activeStop = stops[activeIndex]
    if (activeStop) {
      document.documentElement.style.backgroundColor = activeStop.bgTheme
      document.body.style.backgroundColor = activeStop.bgTheme
    }

    setIsDriving(true)
    if (drivingTimeoutRef.current) clearTimeout(drivingTimeoutRef.current)
    drivingTimeoutRef.current = window.setTimeout(() => setIsDriving(false), 180)
  }, [stops])

  useEffect(() => {
    return () => {
      if (drivingTimeoutRef.current) clearTimeout(drivingTimeoutRef.current)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        scrollToStop(currentStopIndex + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        scrollToStop(currentStopIndex - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStopIndex, scrollToStop])

  // Deep-link restore: /#projects lands on the projects panel
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace('#', '')
      const index = stops.findIndex((stop) => stop.id === id)
      if (index >= 0) {
        requestAnimationFrame(() => scrollToStop(index, 'auto'))
      }
    }
    const timer = setTimeout(applyHash, 120)
    window.addEventListener('hashchange', applyHash)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('hashchange', applyHash)
    }
  }, [stops, scrollToStop])

  // GSAP entrance choreography for the active panel
  useEffect(() => {
    if (reducedMotion) return
    const panel = panelRefs.current[currentStopIndex]
    if (!panel) return

    const revealItems = panel.querySelectorAll('[data-reveal]')
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

    return () => ctx.revert()
  }, [currentStopIndex, reducedMotion])

  return (
    <div className="journey">
      <main
        ref={trackRef}
        onScroll={handleScroll}
        className="track"
        tabIndex={0}
        aria-label="Dhruva Vura Portfolio Road"
      >
        <div className="panel-slot" ref={(el) => { panelRefs.current[0] = el }}>
          <HeroPoster onExploreClick={() => scrollToStop(1)} />
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
