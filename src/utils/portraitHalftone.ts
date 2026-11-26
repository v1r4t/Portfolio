/**
 * CPU halftone fallback for the portrait plates. Used when WebGPU is absent
 * or the device is lost; the GPU path draws the same dot field in
 * `src/shaders/portrait.wgsl`.
 */
export function paintPortraitHalftone(img: HTMLImageElement, canvas: HTMLCanvasElement): void {
  if (!img.naturalWidth) return

  const displayed = img.getBoundingClientRect().width || 600
  const cols = Math.max(48, Math.min(190, Math.round(displayed / 4.5)))
  const off = document.createElement('canvas')
  off.width = cols
  off.height = Math.max(1, Math.round((cols * img.naturalHeight) / img.naturalWidth))
  const rows = off.height
  const cell = img.naturalWidth / cols
  const octx = off.getContext('2d')
  if (!octx) return

  octx.drawImage(img, 0, 0, cols, rows)
  let data: Uint8ClampedArray
  try {
    data = octx.getImageData(0, 0, cols, rows).data
  } catch {
    return
  }

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(10, 10, 10, 0.72)'

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      if (data[i + 3] < 110) continue
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
      const dark = 1 - lum
      if (dark < 0.15) continue
      const r = (cell / 2) * 1.05 * ((dark - 0.15) / 0.85)
      ctx.beginPath()
      ctx.arc((x + 0.5) * cell, (y + 0.5) * cell, Math.max(0.7, r), 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
