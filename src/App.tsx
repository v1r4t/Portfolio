import React, { useRef, useState, useEffect, useCallback } from 'react'
import { TruckArtSymbols } from './components/TruckArtSymbols'
import { HeroPoster } from './components/HeroPoster'
import { AboutSection } from './components/AboutSection'
import { BlogsSection } from './components/BlogsSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'
import { NavigationRoad } from './components/NavigationRoad'
import { NAV_STOPS } from './data/portfolioData'

export const App: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDriving, setIsDriving] = useState(false)
  const [isRoadReady, setIsRoadReady] = useState(false)
  const drivingTimeoutRef = useRef<number | null>(null)

  // Reveal road and truck once poster entrance finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRoadReady(true)
    }, 2400)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to designated panel index
  const scrollToPanel = useCallback((index: number) => {
    if (!trackRef.current) return
    const targetIndex = Math.max(0, Math.min(NAV_STOPS.length - 1, index))
    const panelWidth = trackRef.current.clientWidth

    trackRef.current.scrollTo({
      left: targetIndex * panelWidth,
      behavior: 'smooth',
    })
    setCurrentStopIndex(targetIndex)
  }, [])

  // Track scroll position and calculate progress
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
    const maxScroll = scrollWidth - clientWidth

    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollLeft / maxScroll)) : 0
    setScrollProgress(progress)

    const activeIndex = Math.round(scrollLeft / clientWidth)
    setCurrentStopIndex(activeIndex)

    // Sync HTML document background color with current panel theme
    const activeStop = NAV_STOPS[activeIndex]
    if (activeStop) {
      document.documentElement.style.backgroundColor = activeStop.bgTheme
      document.body.style.backgroundColor = activeStop.bgTheme
    }

    // Set driving state for truck bob & exhaust puffs
    setIsDriving(true)
    if (drivingTimeoutRef.current) clearTimeout(drivingTimeoutRef.current)
    drivingTimeoutRef.current = window.setTimeout(() => {
      setIsDriving(false)
    }, 180)
  }, [])

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        scrollToPanel(currentStopIndex + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        scrollToPanel(currentStopIndex - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStopIndex, scrollToPanel])

  return (
    <div className="relative w-full h-[100vh] overflow-hidden flex flex-col bg-[var(--t-violet)] text-[var(--t-ink)]">
      {/* Global SVG Definition Library */}
      <TruckArtSymbols />

      {/* Main Track: Horizontal scroll snap container */}
      <main
        ref={trackRef}
        onScroll={handleScroll}
        className="flex-1 w-full flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        tabIndex={0}
        aria-label="Dhruva Vura Portfolio Road"
      >
        <div className="w-screen min-w-[100vw] h-full snap-start flex-shrink-0">
          <HeroPoster onExploreClick={() => scrollToPanel(1)} />
        </div>

        <div className="w-screen min-w-[100vw] h-full snap-start flex-shrink-0">
          <AboutSection />
        </div>

        <div className="w-screen min-w-[100vw] h-full snap-start flex-shrink-0">
          <BlogsSection />
        </div>

        <div className="w-screen min-w-[100vw] h-full snap-start flex-shrink-0">
          <ProjectsSection />
        </div>

        <div className="w-screen min-w-[100vw] h-full snap-start flex-shrink-0">
          <ContactSection />
        </div>
      </main>

      {/* Highway Road & Animated Indian Truck */}
      <NavigationRoad
        currentStopIndex={currentStopIndex}
        scrollProgress={scrollProgress}
        isDriving={isDriving}
        isRoadReady={isRoadReady}
        onSelectStop={scrollToPanel}
      />
    </div>
  )
}
