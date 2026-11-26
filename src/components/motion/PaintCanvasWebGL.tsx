'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { NavStop } from '../../types'
import { hornAudio } from '../../utils/audio'
import { hexToRgb, mixForStop } from '../../utils/paintGround'
import { PAINT_WEBGL_FRAGMENT, PAINT_WEBGL_VERTEX } from './paintWebGLShader'

const MAX_DPR = 1.5
const HORN_DURATION = 1.5

interface PaintCanvasWebGLProps {
  progress: number
  stops: NavStop[]
}

interface GLState {
  progress: number
  horn: number
  hornAge: number
  origin: [number, number]
}

interface Uniforms {
  colorA: WebGLUniformLocation | null
  colorB: WebGLUniformLocation | null
  resolution: WebGLUniformLocation | null
  hornOrigin: WebGLUniformLocation | null
  mix: WebGLUniformLocation | null
  horn: WebGLUniformLocation | null
  hornAge: WebGLUniformLocation | null
  panel: WebGLUniformLocation | null
}

/**
 * WebGL2 fallback for browsers without a usable WebGPU adapter. It renders the
 * same painted ground as `paint.wgsl`; if WebGL2 is also unavailable the canvas
 * stays flat and the body pigment shows through.
 */
export function PaintCanvasWebGL({ progress, stops }: PaintCanvasWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stopsRef = useRef(stops)
  const stateRef = useRef<GLState>({ progress, horn: 0, hornAge: 0, origin: [0, 0] })
  const renderRef = useRef<(() => void) | null>(null)
  const rafRef = useRef(0)
  const [backend, setBackend] = useState<'pending' | 'webgl' | 'flat'>('pending')
  const [ready, setReady] = useState(false)

  const requestRender = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      renderRef.current?.()
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      setBackend('flat')
      return
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vert = compile(gl.VERTEX_SHADER, PAINT_WEBGL_VERTEX)
    const frag = compile(gl.FRAGMENT_SHADER, PAINT_WEBGL_FRAGMENT)
    if (!vert || !frag) {
      if (vert) gl.deleteShader(vert)
      if (frag) gl.deleteShader(frag)
      setBackend('flat')
      return
    }

    const program = gl.createProgram()
    if (!program) {
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      setBackend('flat')
      return
    }
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.deleteShader(vert)
    gl.deleteShader(frag)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      setBackend('flat')
      return
    }

    const position = gl.getAttribLocation(program, 'aPosition')
    const uniforms: Uniforms = {
      colorA: gl.getUniformLocation(program, 'uColorA'),
      colorB: gl.getUniformLocation(program, 'uColorB'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      hornOrigin: gl.getUniformLocation(program, 'uHornOrigin'),
      mix: gl.getUniformLocation(program, 'uMix'),
      horn: gl.getUniformLocation(program, 'uHorn'),
      hornAge: gl.getUniformLocation(program, 'uHornAge'),
      panel: gl.getUniformLocation(program, 'uPanel'),
    }

    const vao = gl.createVertexArray()
    const buffer = gl.createBuffer()
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    gl.useProgram(program)
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.BLEND)
    gl.clearColor(0, 0, 0, 1)

    let announced = false

    const draw = () => {
      if (gl.isContextLost()) return
      const state = stateRef.current
      const list = stopsRef.current
      const { index, next, mix } = mixForStop(state.progress, list.length)
      const from = hexToRgb(list[index]?.bgTheme ?? '#45107a')
      const to = hexToRgb(list[next]?.bgTheme ?? '#45107a')

      canvas.dataset.mix = mix.toFixed(3)
      canvas.dataset.progress = state.progress.toFixed(3)
      canvas.dataset.stop = String(index)
      canvas.dataset.panel = String(next)
      canvas.dataset.horn = state.horn.toFixed(3)

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.uniform4f(uniforms.colorA, from[0], from[1], from[2], 1)
      gl.uniform4f(uniforms.colorB, to[0], to[1], to[2], 1)
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform2f(uniforms.hornOrigin, state.origin[0], state.origin[1])
      gl.uniform1f(uniforms.mix, mix)
      gl.uniform1f(uniforms.horn, state.horn)
      gl.uniform1f(uniforms.hornAge, state.hornAge)
      gl.uniform1f(uniforms.panel, next)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      gl.bindVertexArray(null)

      if (!announced) {
        announced = true
        setReady(true)
        setBackend('webgl')
      }
    }

    const resize = () => {
      if (gl.isContextLost()) return
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      if (stateRef.current.origin[0] === 0 && stateRef.current.origin[1] === 0) {
        stateRef.current.origin = [width / 2, height / 2]
      }
      requestRender()
    }

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      stateRef.current.origin = [
        (event.clientX - rect.left) * (canvas.width / rect.width),
        (event.clientY - rect.top) * (canvas.height / rect.height),
      ]
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      setBackend('flat')
    }

    renderRef.current = draw
    resize()
    draw()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      renderRef.current = null
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
    }
  }, [requestRender])

  useEffect(() => {
    stopsRef.current = stops
    requestRender()
  }, [stops, requestRender])

  useEffect(() => {
    stateRef.current.progress = progress
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
      data-ready={ready ? 'true' : 'false'}
      data-backend={backend}
      style={{ opacity: backend === 'webgl' ? 1 : 0 }}
    />
  )
}
