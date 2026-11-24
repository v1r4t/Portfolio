/**
 * Halftone dot plate renderer: samples image luminance and generates
 * authentic sign-painter halftone dot screening onto canvas.
 */
export function drawHalftonePlate(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  dotColor = '#ffd400',
  gridSpacing = 14
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = (canvas.width = image.naturalWidth || image.width || 400)
  const h = (canvas.height = image.naturalHeight || image.height || 600)

  // Offscreen canvas to read image pixel luminance
  const offscreen = document.createElement('canvas')
  offscreen.width = w
  offscreen.height = h
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return

  offCtx.drawImage(image, 0, 0, w, h)
  let imgData: ImageData
  try {
    imgData = offCtx.getImageData(0, 0, w, h)
  } catch {
    return
  }

  const data = imgData.data
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = dotColor

  const maxRadius = gridSpacing * 0.65

  for (let y = gridSpacing / 2; y < h; y += gridSpacing) {
    for (let x = gridSpacing / 2; x < w; x += gridSpacing) {
      const px = Math.floor(x)
      const py = Math.floor(y)
      const index = (py * w + px) * 4

      const alpha = data[index + 3]
      if (alpha < 40) continue

      // Luminance: standard Rec. 709 weighting
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

      // Inverted luminance so darker/contrasting parts get punchy dots
      const radius = (1 - lum) * maxRadius * (alpha / 255)

      if (radius > 1.2) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}
