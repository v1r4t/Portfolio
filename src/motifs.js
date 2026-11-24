/* MURAL — a painted poster composition, not a wallpaper.
   Large overlapping colour fields, a few large motifs, no borders.
   Density comes from scale and collision, not from repeating small icons. */

const NS = 'http://www.w3.org/2000/svg'

const SYMBOLS = `
<symbol id="m-lotus" viewBox="0 0 100 100">
  <g stroke="#0a0a0a" stroke-width="2.6" stroke-linejoin="round">
    <path d="M50 92 C18 72 14 40 50 12 C86 40 82 72 50 92Z" fill="#ffd400"/>
    <path d="M50 92 C8 78 2 50 32 26 C42 52 46 74 50 92Z" fill="#00b3b0"/>
    <path d="M50 92 C92 78 98 50 68 26 C58 52 54 74 50 92Z" fill="#00b3b0"/>
    <path d="M50 32 Q57 52 50 70 Q43 52 50 32Z" fill="#e2231a"/>
    <path d="M50 88 Q34 78 30 62" fill="none" stroke-width="2"/>
    <path d="M50 88 Q66 78 70 62" fill="none" stroke-width="2"/>
  </g>
</symbol>

<symbol id="m-flower" viewBox="0 0 100 100">
  <g stroke="#0a0a0a" stroke-width="2.4">
    <g fill="#ffd400">
      <ellipse cx="50" cy="25" rx="11" ry="21"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(45 50 50)"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(90 50 50)"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(135 50 50)"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(180 50 50)"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(225 50 50)"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(270 50 50)"/>
      <ellipse cx="50" cy="25" rx="11" ry="21" transform="rotate(315 50 50)"/>
    </g>
    <circle cx="50" cy="50" r="10" fill="#e2231a"/>
  </g>
</symbol>

<symbol id="m-paisley" viewBox="0 0 100 120">
  <g stroke="#0a0a0a" stroke-width="2.8" stroke-linejoin="round">
    <path d="M62 112 C20 100 6 62 30 30 C50 4 86 14 82 46 C79 68 54 70 48 52 C44 40 58 32 65 42"
          fill="#1b3a8c"/>
    <circle cx="55" cy="52" r="6" fill="#ffd400"/>
    <circle cx="43" cy="74" r="4" fill="#8cc63f"/>
    <circle cx="63" cy="82" r="3" fill="#ffd400"/>
  </g>
</symbol>

<symbol id="m-leaf" viewBox="0 0 60 30">
  <g stroke="#0a0a0a" stroke-width="2.4" stroke-linejoin="round">
    <path d="M4 15 Q30 -4 56 15 Q30 34 4 15Z" fill="#8cc63f"/>
    <path d="M6 15 Q30 15 54 15" fill="none" stroke-width="2"/>
  </g>
</symbol>

<symbol id="m-peacock" viewBox="0 0 200 240">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M100 150 C8 128 8 26 100 8 C192 26 192 128 100 150Z" fill="#00b3b0"/>
    <g fill="none" stroke="#ffd400" stroke-width="3.2">
      <path d="M100 145 Q48 88 38 26"/>
      <path d="M100 145 Q74 72 68 18"/>
      <path d="M100 145 L100 12"/>
      <path d="M100 145 Q126 72 132 18"/>
      <path d="M100 145 Q152 88 162 26"/>
    </g>
    <g fill="#1b3a8c">
      <circle cx="38" cy="26" r="7"/><circle cx="68" cy="18" r="7"/>
      <circle cx="100" cy="12" r="7"/><circle cx="132" cy="18" r="7"/>
      <circle cx="162" cy="26" r="7"/>
    </g>
    <path d="M88 150 Q78 198 90 234 L112 234 Q124 198 112 150Z" fill="#1b3a8c"/>
    <circle cx="118" cy="158" r="12" fill="#1b3a8c"/>
    <path d="M130 158 L148 164 L130 170Z" fill="#ffd400"/>
    <circle cx="121" cy="155" r="2.5" fill="#0a0a0a"/>
  </g>
</symbol>
`

function seeded(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function createMural(root, opts = {}) {
  const w = Math.max(320, root.clientWidth || window.innerWidth)
  const h = Math.max(320, root.clientHeight || window.innerHeight)
  const parts = []

  /* 1 — big overlapping fields. Flat paint, no outlines on the fields
     themselves: only the motifs get drawn edges. */
  const fields = [
    { x: -0.06, y: -0.10, w: 0.52, h: 0.62, fill: '#1b3a8c', r: -5 },
    { x: 0.62, y: -0.14, w: 0.52, h: 0.58, fill: '#00b3b0', r: 4 },
    { x: -0.04, y: 0.60, w: 0.44, h: 0.48, fill: '#e2231a', r: -3 },
    { x: 0.70, y: 0.58, w: 0.44, h: 0.50, fill: '#ffd400', r: 3 },
    { x: 0.30, y: 0.06, w: 0.46, h: 0.30, fill: '#8cc63f', r: -2 },
  ]
  for (const f of fields) {
    parts.push(
      `<rect x="${(f.x * w).toFixed(1)}" y="${(f.y * h).toFixed(1)}" ` +
      `width="${(f.w * w).toFixed(1)}" height="${(f.h * h).toFixed(1)}" ` +
      `fill="${f.fill}" transform="rotate(${f.r} ${(w / 2).toFixed(1)} ${(h / 2).toFixed(1)})"/>`
    )
  }

  /* 2 — a single thick vine crossing the lower half. */
  let d = ''
  for (let i = 0; i <= 60; i++) {
    const t = i / 60
    const x = t * w
    const y = h * 0.66 + Math.sin(t * Math.PI * 1.8 + 0.6) * h * 0.11
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `
  }
  parts.push(`<path d="${d}" fill="none" stroke="#0a0a0a" stroke-width="16" opacity="0.9"/>`)
  parts.push(`<path d="${d}" fill="none" stroke="#8cc63f" stroke-width="11"/>`)

  for (let i = 0; i < 22; i++) {
    const t = (i + 0.5) / 22
    const x = t * w
    const y = h * 0.66 + Math.sin(t * Math.PI * 1.8 + 0.6) * h * 0.11
    const ang = (i % 2 ? 1 : -1) * (40 + seeded(i) * 40)
    const size = 34 + seeded(i * 2) * 34
    parts.push(
      `<use href="#m-leaf" x="${(x - 18).toFixed(1)}" y="${(y - 12).toFixed(1)}" ` +
      `width="${(size * 2).toFixed(1)}" height="${size.toFixed(1)}" ` +
      `transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
    )
  }

  /* 3 — a few LARGE motifs, placed compositionally. */
  const motifs = [
    { id: 'm-lotus', x: 0.06, y: 0.10, s: 0.24, rot: -12 },
    { id: 'm-lotus', x: 0.02, y: 0.66, s: 0.26, rot: 8 },
    { id: 'm-flower', x: 0.30, y: 0.78, s: 0.12, rot: 0 },
    { id: 'm-paisley', x: 0.44, y: 0.16, s: 0.14, rot: 18 },
    { id: 'm-flower', x: 0.80, y: 0.30, s: 0.11, rot: -10 },
    { id: 'm-paisley', x: 0.90, y: 0.10, s: 0.12, rot: -20 },
    { id: 'm-lotus', x: 0.84, y: 0.80, s: 0.17, rot: 14 },
  ]
  for (const m of motifs) {
    const size = m.s * Math.min(w, h) * 1.6
    parts.push(
      `<use href="#${m.id}" x="${(m.x * w - size / 2).toFixed(1)}" y="${(m.y * h - size / 2).toFixed(1)}" ` +
      `width="${size.toFixed(1)}" height="${size.toFixed(1)}" ` +
      `transform="rotate(${m.rot} ${(m.x * w).toFixed(1)} ${(m.y * h).toFixed(1)})"/>`
    )
  }

  /* 4 — one peacock, large, lower right. */
  const pw = Math.min(w * 0.16, h * 0.42)
  parts.push(
    `<use href="#m-peacock" x="${(w * 0.86 - pw / 2).toFixed(1)}" y="${(h * 0.34).toFixed(1)}" ` +
    `width="${pw.toFixed(1)}" height="${(pw * 1.2).toFixed(1)}"/>`
  )

  /* 5 — clustered dots, not a uniform scatter. */
  const clusters = [[0.12, 0.42], [0.38, 0.30], [0.68, 0.88], [0.94, 0.62]]
  clusters.forEach(([cx, cy], ci) => {
    for (let i = 0; i < 14; i++) {
      const x = (cx + (seeded(ci * 20 + i) - 0.5) * 0.14) * w
      const y = (cy + (seeded(ci * 20 + i + 7) - 0.5) * 0.16) * h
      const r = 3 + seeded(ci * 20 + i + 3) * 9
      const fill = ['#ffd400', '#00b3b0', '#1b3a8c', '#e2231a'][Math.floor(seeded(ci * 20 + i + 11) * 4)]
      parts.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" ` +
        `fill="${fill}" stroke="#0a0a0a" stroke-width="2"/>`
      )
    }
  })

  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  svg.innerHTML = `<defs>${SYMBOLS}</defs>${parts.join('')}`
  root.appendChild(svg)

  return { destroy() { svg.remove() } }
}
