'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * InkCursor — a painted ink dab that follows the pointer, with a fading
 * hand-drawn trail. Fine pointers only; never rendered for touch or reduced motion.
 */
export function InkCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const dot = dotRef.current
    const canvas = canvasRef.current
    if (!dot || !canvas) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    document.body.classList.add('has-ink-cursor')

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let revealed = false

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.16, ease: 'power3.out' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.16, ease: 'power3.out' })

    type Point = { x: number; y: number; life: number; size: number }
    const points: Point[] = []
    let raf = 0
    let running = false

    const drawTrail = () => {
      if (points.length === 0) {
        running = false
        ctx.clearRect(0, 0, width, height)
        return
      }
      ctx.clearRect(0, 0, width, height)
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i]
        p.life -= 0.035
        if (p.life <= 0) {
          points.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.fillStyle = `rgba(10, 10, 10, ${(p.life * 0.22).toFixed(3)})`
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(drawTrail)
    }

    const startTrail = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(drawTrail)
    }

    const onMove = (event: PointerEvent) => {
      if (!revealed) {
        revealed = true
        gsap.to(dot, { opacity: 1, duration: 0.2 })
      }
      xTo(event.clientX)
      yTo(event.clientY)
      points.push({ x: event.clientX, y: event.clientY, life: 1, size: 5 + Math.random() * 7 })
      if (points.length > 40) points.shift()
      startTrail()
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null
      const interactive = target?.closest('a, button, [data-magnetic], .blog-card, .project-card')
      gsap.to(dot, {
        scale: interactive ? 1.9 : 1,
        backgroundColor: interactive ? '#ffd400' : '#0a0a0a',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, width, height)
      document.body.classList.remove('has-ink-cursor')
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="ink-trail" aria-hidden="true" />
      <div ref={dotRef} className="ink-cursor" aria-hidden="true" />
    </>
  )
}
