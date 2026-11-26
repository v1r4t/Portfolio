'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  effect,
  frame,
  init,
  sampler,
  surface,
  texture,
  type Effect,
  type Gpu,
  type Surface,
  type Texture,
} from 'vgpu'
import { hornAudio } from '../../utils/audio'
import { paintPortraitHalftone } from '../../utils/portraitHalftone'
import portraitShader from '../../shaders/portrait.wgsl'

const MAX_DPR = 2
const HORN_DURATION = 1.5
const HALFTONE_ALPHA = 0.72
const DOT_CSS_SIZE = 4.5

interface PortraitParams {
  resolution: [number, number]
  pointer: [number, number]
  dotSize: number
  horn: number
  strength: number
  alpha: number
  _pad: [number, number, number, number]
}

interface PortraitState {
  dotSize: number
  horn: number
  pointer: [number, number]
  strength: number
}

interface PortraitRuntime {
  gpu: Gpu
  surface: Surface
  effect: Effect
  photo: Texture
}

interface PortraitHalftoneProps {
  src: string
  alt: string
  imageClassName: string
  canvasClassName: string
}

function buildParams(state: PortraitState, resolution: readonly [number, number]): PortraitParams {
  return {
    resolution: [resolution[0], resolution[1]],
    pointer: state.pointer,
    dotSize: state.dotSize,
    horn: state.horn,
    strength: state.strength,
    alpha: HALFTONE_ALPHA,
    _pad: [0, 0, 0, 0],
  }
}

/**
 * GPU portrait halftone: reads the portrait texture and paints ink dots that
 * swell under the pointer and pulse with the horn. The CPU painter in
 * `utils/portraitHalftone` is the fallback when WebGPU is unavailable.
 */
export function PortraitHalftone({
  src,
  alt,
  imageClassName,
  canvasClassName,
}: PortraitHalftoneProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const gpuCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const cpuCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const runtimeRef = useRef<PortraitRuntime | null>(null)
  const stateRef = useRef<PortraitState>({
    dotSize: DOT_CSS_SIZE,
    horn: 0,
    pointer: [-1000, -1000],
    strength: 0,
  })
  const rafRef = useRef(0)
  const [backend, setBackend] = useState<'pending' | 'webgpu' | 'fallback'>('pending')

  const requestRender = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const runtime = runtimeRef.current
      if (!runtime) return
      runtime.effect.set({ params: buildParams(stateRef.current, runtime.surface.size) })
      frame(runtime.gpu, (currentFrame) => {
        currentFrame.pass({ target: runtime.surface, clear: [0, 0, 0, 0] }, runtime.effect)
      })
    })
  }, [])

  useEffect(() => {
    const canvas = gpuCanvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    if (!('gpu' in navigator)) {
      setBackend('fallback')
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let gpu: Gpu | null = null
    let canvasSurface: Surface | null = null
    let portraitEffect: Effect | null = null
    let photo: Texture | null = null
    let bitmap: ImageBitmap | null = null
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
      stateRef.current.dotSize = DOT_CSS_SIZE * dpr
      requestRender()
    }

    const clearPointer = () => {
      if (stateRef.current.strength === 0) return
      stateRef.current.strength = 0
      requestRender()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      if (!inside) {
        clearPointer()
        return
      }
      stateRef.current.pointer = [
        (event.clientX - rect.left) * (canvas.width / rect.width),
        (event.clientY - rect.top) * (canvas.height / rect.height),
      ]
      stateRef.current.strength = 1
      requestRender()
    }

    void (async () => {
      try {
        await img.decode()
        if (disposed) return

        gpu = await init({ powerPreference: 'high-performance' })
        if (disposed) {
          gpu.dispose()
          return
        }

        canvasSurface = surface(gpu, canvas, {
          autoResize: false,
          dpr: [1, MAX_DPR],
          alphaMode: 'premultiplied',
        })
        bitmap = await createImageBitmap(img)
        if (disposed) {
          bitmap.close()
          canvasSurface.dispose()
          gpu.dispose()
          return
        }

        photo = texture(gpu, {
          kind: '2d',
          size: [bitmap.width, bitmap.height],
          format: 'rgba8unorm',
          // Dawn requires CopyDst + RenderAttachment for copyExternalImageToTexture.
          usage: ['texture_binding', 'copy_dst', 'render_attachment'],
        })
        gpu.gpu.queue.copyExternalImageToTexture(
          { source: bitmap },
          { texture: photo.gpu },
          [bitmap.width, bitmap.height]
        )
        bitmap.close()
        bitmap = null

        const photoSampler = sampler(gpu, { minFilter: 'linear', magFilter: 'linear' })
        portraitEffect = effect(gpu, portraitShader, {
          label: 'portrait-halftone',
          set: {
            params: buildParams(stateRef.current, canvasSurface.size),
            photo,
            photoSampler,
          },
        })
        await portraitEffect.compile(canvasSurface)
        if (disposed) {
          portraitEffect.dispose()
          photo.destroy()
          canvasSurface.dispose()
          gpu.dispose()
          return
        }

        runtimeRef.current = { gpu, surface: canvasSurface, effect: portraitEffect, photo }
        setBackend('webgpu')
        resize()

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        window.addEventListener('resize', resize)
        if (!reduced) {
          window.addEventListener('pointermove', onPointerMove, { passive: true })
          window.addEventListener('blur', clearPointer)
          window.addEventListener('scroll', clearPointer, true)
        }

        void gpu.lost.then(() => {
          if (disposed) return
          runtimeRef.current = null
          setBackend('fallback')
          portraitEffect?.dispose()
          photo?.destroy()
          canvasSurface?.dispose()
          gpu?.dispose()
        })
      } catch (error) {
        console.warn('WebGPU portrait halftone unavailable; using CPU fallback.', error)
        if (!disposed) setBackend('fallback')
        portraitEffect?.dispose()
        photo?.destroy()
        canvasSurface?.dispose()
        gpu?.dispose()
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', clearPointer)
      window.removeEventListener('scroll', clearPointer, true)
      resizeObserver?.disconnect()
      runtimeRef.current = null
      bitmap?.close()
      portraitEffect?.dispose()
      photo?.destroy()
      canvasSurface?.dispose()
      gpu?.dispose()
    }
  }, [requestRender])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let start = 0
    let active = false

    const tick = (now: number) => {
      const age = (now - start) / 1000
      const decay = Math.max(0, 1 - age / HORN_DURATION)
      stateRef.current.horn = Math.min(1, (0.25 + hornAudio.getLevel()) * decay)
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

  useEffect(() => {
    if (backend !== 'fallback') return
    const img = imgRef.current
    const canvas = cpuCanvasRef.current
    if (!img || !canvas) return

    let disposed = false
    void img
      .decode()
      .then(() => {
        if (!disposed) paintPortraitHalftone(img, canvas)
      })
      .catch(() => {
        /* leave the image visible without the dot layer */
      })
    return () => {
      disposed = true
    }
  }, [backend])

  return (
    <>
      <img ref={imgRef} className={imageClassName} src={src} alt={alt} draggable={false} />
      <canvas
        ref={gpuCanvasRef}
        className={canvasClassName}
        aria-hidden="true"
        data-backend={backend === 'webgpu' ? 'webgpu' : 'pending'}
        style={{ opacity: backend === 'webgpu' ? 1 : 0, pointerEvents: 'none' }}
      />
      {backend === 'fallback' && (
        <canvas
          ref={cpuCanvasRef}
          className={canvasClassName}
          aria-hidden="true"
          data-backend="fallback"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </>
  )
}
