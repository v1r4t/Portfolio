export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ]
}

export function mixForStop(progress: number, stopsCount: number) {
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
