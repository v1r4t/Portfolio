'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { effect, frame, init, surface, type Effect, type Gpu, type Surface } from 'vgpu'
import type { NavStop } from '../../types'
import { hornAudio } from '../../utils/audio'
import paintShader from '../../shaders/paint.wgsl'

const MAX_DPR = 1.5
const HORN_DURATION = 1.5

interface PaintParams {
  colorA: [number, number, number, number]
  colorB: [number, number, number, number]
  resolution: [number, number]
  hornOrigin: [number, number]
  mix: number
  horn: number
  hornAge: number
  _pad: number
}

interface PaintState {
  progress: number
  horn: number
  hornAge: number
  origin: [number, number]
}

interface PaintRuntime {
  gpu: Gpu
  surface: Surface
  effect: Effect
}

interface PaintCanvasProps {
  progress: number // 0..1 across the journey
  stops: NavStop[]
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ]
}

function mixForStop(progress: number, stopsCount: number) {
  const last = Math.max(0, stopsCount - 1)
  const t = Math.max(0, Math.min(last, progress * last))
  const index = Math.floor(t)
  const next = Math.min(index + 1, last)
  const raw = t - index
  // hold the solid ground near each stop; dissolve only mid-transition
  const windowed = Math.min(1, Math.max(0, (raw - 0.12) / 0.76))
  const easedMix = windowed * windowed * (3 - 2 * windowed)
  return { index, next, mix: index === next ? 0 : easedMix }
}

function buildParams(state: PaintState, stops: NavStop[], size: readonly [number, number]) {
  const { index, next, mix } = mixForStop(state.progress, stops.length)
  const from = hexToRgb(stops[index]?.bgTheme ?? '#45107a')
  const to = hexToRgb(stops[next]?.bgTheme ?? '#45107a')
  const params: PaintParams = {
    colorA: [from[0], from[1], from[2], 1],
    colorB: [to[0], to[1], to[2], 1],
    resolution: [size[0], size[1]],
    hornOrigin: state.origin,
    mix,
    horn: state.horn,
    hornAge: state.hornAge,
    _pad: 0,
  }
  return params
}

function syncDataset(canvas: HTMLCanvasElement, state: PaintState, stops: NavStop[]) {
  const { index, mix } = mixForStop(state.progress, stops.length)
  canvas.dataset.mix = mix.toFixed(3)
  canvas.dataset.progress = state.progress.toFixed(3)
  canvas.dataset.stop = String(index)
  canvas.dataset.horn = state.horn.toFixed(3)
}

/**
 * WebGPU paint engine: a single fullscreen effect that renders the journey's
 * ground as a halftone dissolve between panel pigments, with a wet ink line at
 * the front and a short ink ripple when the horn sounds. Renders only when
 * progress, size, or the horn animation changes.
 */
export function PaintCanvas({ progress, stops }: PaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const runtimeRef = useRef<PaintRuntime | null>(null)
  const stopsRef = useRef(stops)
  const stateRef = useRef<PaintState>({ progress, horn: 0, hornAge: 0, origin: [0, 0] })
  const rafRef = useRef(0)
  const [backend, setBackend] = useState<'pending' | 'webgpu' | 'fallback'>('pending')

  const requestRender = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const runtime = runtimeRef.current
      const canvas = canvasRef.current
      if (!runtime || !canvas) return

      const params = buildParams(stateRef.current, stopsRef.current, runtime.surface.size)
      syncDataset(canvas, stateRef.current, stopsRef.current)

      runtime.effect.set({ paint: params })
      frame(runtime.gpu, (currentFrame) => {
        currentFrame.pass(runtime.surface, runtime.effect)
      })
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!('gpu' in navigator)) {
      setBackend('fallback')
      return
    }

    let disposed = false
    let gpu: Gpu | null = null
    let canvasSurface: Surface | null = null
    let paintEffect: Effect | null = null
    let resizeObserver: ResizeObserver | null = null

    const resize = () => {
      if (!canvasSurface) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (canvasSurface.size[0] !== width || canvasSurface.size[1] !== height) {
        canvasSurface.resize([width, height])
      }
      if (stateRef.current.origin[0] === 0 && stateRef.current.origin[1] === 0) {
        stateRef.current.origin = [width / 2, height / 2]
      }
      requestRender()
    }

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const scaleX = (canvasSurface?.size[0] ?? rect.width) / rect.width
      const scaleY = (canvasSurface?.size[1] ?? rect.height) / rect.height
      stateRef.current.origin = [event.clientX * scaleX, event.clientY * scaleY]
    }

    void (async () => {
      try {
        gpu = await init({ powerPreference: 'high-performance' })
        if (disposed) {
          gpu.dispose()
          return
        }

        canvasSurface = surface(gpu, canvas, { autoResize: false, dpr: [1, MAX_DPR] })
        const params = buildParams(stateRef.current, stopsRef.current, canvasSurface.size)
        paintEffect = effect(gpu, paintShader, {
          label: 'paint-ground',
          set: { paint: params },
        })
        await paintEffect.compile(canvasSurface)

        if (disposed) {
          paintEffect.dispose()
          canvasSurface.dispose()
          gpu.dispose()
          return
        }

        runtimeRef.current = { gpu, surface: canvasSurface, effect: paintEffect }
        setBackend('webgpu')
        resize()

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        window.addEventListener('resize', resize)
        window.addEventListener('pointerdown', onPointerDown, { passive: true })

        void gpu.lost.then(() => {
          if (disposed) return
          runtimeRef.current = null
          setBackend('fallback')
          paintEffect?.dispose()
          canvasSurface?.dispose()
          gpu?.dispose()
        })
      } catch (error) {
        console.warn('WebGPU paint engine unavailable; using flat pigment.', error)
        if (!disposed) setBackend('fallback')
        paintEffect?.dispose()
        canvasSurface?.dispose()
        gpu?.dispose()
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
      resizeObserver?.disconnect()
      runtimeRef.current = null
      paintEffect?.dispose()
      canvasSurface?.dispose()
      gpu?.dispose()
    }
  }, [requestRender])

  useEffect(() => {
    stopsRef.current = stops
    requestRender()
  }, [stops, requestRender])

  useEffect(() => {
    const canvas = canvasRef.current
    stateRef.current.progress = progress
    if (canvas) syncDataset(canvas, stateRef.current, stopsRef.current)
    requestRender()
  }, [progress, requestRender])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let start = 0
    let active = false

    const tick = (now: number) => {
      const age = (now - start) / 1000
      const decay = Math.max(0, 1 - age / HORN_DURATION)
      stateRef.current.horn = Math.min(1, (0.25 + hornAudio.getLevel()) * decay)
      stateRef.current.hornAge = age
      requestRender()

      if (age < HORN_DURATION) {
        raf = requestAnimationFrame(tick)
      } else {
        stateRef.current.horn = 0
        active = false
        requestRender()
      }
    }

    const onHorn = () => {
      cancelAnimationFrame(raf)
      start = performance.now()
      active = true
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('horn-play', onHorn)
    return () => {
      window.removeEventListener('horn-play', onHorn)
      cancelAnimationFrame(raf)
      if (active) {
        stateRef.current.horn = 0
        requestRender()
      }
    }
  }, [requestRender])

  return (
    <canvas
      ref={canvasRef}
      className="paint-canvas"
      aria-hidden="true"
      data-ready={backend === 'webgpu' ? 'true' : 'false'}
      data-backend={backend}
      data-horn="0"
      style={{ opacity: backend === 'webgpu' ? 1 : 0 }}
    />
  )
}
