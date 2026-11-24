'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { NavStop } from '../../types'

const VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uMix;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    float dotSize = max(6.0, uResolution.y / 120.0);
    vec2 cell = floor(frag / dotSize);
    vec2 center = (cell + 0.5) * dotSize;
    float dist = length(frag - center) / dotSize;
    float aa = 1.4 / dotSize;

    // halftone dots grow from the A ground into the B ground
    float radius = sqrt(clamp(uMix, 0.0, 1.0)) * 0.72;
    float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, dist);

    vec3 ink = vec3(0.039, 0.039, 0.039);
    vec3 col = mix(uColorA, uColorB, dotMask);

    // wet ink ring at the dot edge — the painted front line
    float ring = 1.0 - smoothstep(0.0, aa * 3.0, abs(dist - radius));
    ring *= step(0.003, uMix) * step(uMix, 0.997);
    col = mix(col, ink, ring * 0.28);

    // paper grain
    float grain = hash(floor(frag * 1.63));
    col += (grain - 0.5) * 0.03;

    // vignette so the poster edges sit down
    vec2 uv = frag / uResolution;
    float v = smoothstep(1.15, 0.25, distance(uv, vec2(0.5)));
    col *= mix(0.9, 1.0, v);

    gl_FragColor = vec4(col, 1.0);
  }
`

function hexToRgb(hex: string): THREE.Vector3 {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return new THREE.Vector3(r, g, b)
}

interface PaintCanvasProps {
  progress: number // 0..1 across the journey
  stops: NavStop[]
}

/**
 * WebGL paint engine: a single fullscreen quad that renders the journey's ground
 * as a halftone dissolve between panel pigments, with a wet ink line at the front.
 * Renders only when progress or size changes (cheap, no idle rAF).
 */
export function PaintCanvas({ progress, stops }: PaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const uniformsRef = useRef<{
    uColorA: THREE.IUniform<THREE.Vector3>
    uColorB: THREE.IUniform<THREE.Vector3>
    uMix: THREE.IUniform<number>
    uResolution: THREE.IUniform<THREE.Vector2>
  } | null>(null)
  const renderRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const colors = stops.map((stop) => hexToRgb(stop.bgTheme))
    const uniforms = {
      uColorA: { value: colors[0].clone() },
      uColorB: { value: colors[1].clone() },
      uMix: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }
    uniformsRef.current = uniforms

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      depthTest: false,
      depthWrite: false,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, false)
      const buffer = renderer.getDrawingBufferSize(new THREE.Vector2())
      uniforms.uResolution.value.set(buffer.x, buffer.y)
    }

    const render = () => {
      renderer.render(scene, camera)
    }

    renderRef.current = render
    resize()
    render()
    setReady(true)

    const onResize = () => {
      resize()
      render()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      renderRef.current = null
      uniformsRef.current = null
      quad.geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [stops])

  // Progress → uniforms: pick the two neighbouring pigments and the dissolve mix.
  useEffect(() => {
    const uniforms = uniformsRef.current
    const render = renderRef.current
    if (!uniforms || !render) return

    const stopsCount = stops.length
    const t = Math.max(0, Math.min(stopsCount - 1, progress * (stopsCount - 1)))
    const index = Math.floor(t)
    const next = Math.min(index + 1, stopsCount - 1)
    const raw = t - index
    // hold the solid ground near each stop; dissolve only mid-transition
    const windowed = Math.min(1, Math.max(0, (raw - 0.12) / 0.76))
    const easedMix = windowed * windowed * (3 - 2 * windowed)

    const from = stops[index]
    const to = stops[next]

    uniforms.uColorA.value.copy(hexToRgb(from.bgTheme))
    uniforms.uColorB.value.copy(hexToRgb(to.bgTheme))
    uniforms.uMix.value = index === next ? 0 : easedMix

    const canvas = canvasRef.current
    if (canvas) {
      canvas.dataset.mix = uniforms.uMix.value.toFixed(3)
      canvas.dataset.progress = progress.toFixed(3)
      canvas.dataset.stop = String(index)
    }

    render()
  }, [progress, stops])

  return (
    <canvas
      ref={canvasRef}
      className="paint-canvas"
      aria-hidden="true"
      data-ready={ready ? 'true' : 'false'}
    />
  )
}
