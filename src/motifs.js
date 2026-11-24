/* MURAL — the poster's ground.
   A jharokha niche behind the figure, then truck-art and picture-palace
   motifs scattered to the edges. Flat fills, ink outlines, no gradients.
   The dense field behind all of it is the jaali lattice in style.css. */

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

<symbol id="m-marigold" viewBox="0 0 100 100">
  <g stroke="#0a0a0a" stroke-width="2.2">
    <g fill="#ff9f1c">
      <ellipse cx="50" cy="27" rx="8" ry="16"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(36 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(72 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(108 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(144 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(180 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(216 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(252 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(288 50 50)"/>
      <ellipse cx="50" cy="27" rx="8" ry="16" transform="rotate(324 50 50)"/>
    </g>
    <circle cx="50" cy="50" r="11" fill="#e2231a"/>
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

<symbol id="m-elephant" viewBox="0 0 220 170">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <rect x="52" y="112" width="24" height="52" rx="7" fill="#1b3a8c"/>
    <rect x="86" y="116" width="24" height="48" rx="7" fill="#1b3a8c"/>
    <rect x="120" y="116" width="24" height="48" rx="7" fill="#1b3a8c"/>
    <rect x="150" y="112" width="24" height="52" rx="7" fill="#1b3a8c"/>
    <ellipse cx="100" cy="92" rx="74" ry="44" fill="#00b3b0"/>
    <path d="M44 66 Q100 44 156 66 L150 102 Q100 116 50 102Z" fill="#e2231a"/>
    <path d="M60 60 L66 96 M86 54 L90 100 M114 54 L110 100 M140 58 L134 96"
          fill="none" stroke="#ffd400" stroke-width="3"/>
    <circle cx="178" cy="88" r="34" fill="#00b3b0"/>
    <ellipse cx="152" cy="92" rx="17" ry="27" fill="#ffd400" transform="rotate(-10 152 92)"/>
    <path d="M198 100 Q214 132 196 156" fill="none" stroke="#0a0a0a" stroke-width="20" stroke-linecap="round"/>
    <path d="M198 100 Q214 132 196 156" fill="none" stroke="#00b3b0" stroke-width="13" stroke-linecap="round"/>
    <path d="M198 108 L210 124 L192 120Z" fill="#fff8e7"/>
    <circle cx="186" cy="78" r="4" fill="#0a0a0a"/>
  </g>
</symbol>

<symbol id="m-parrot" viewBox="0 0 120 170">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M60 108 Q76 136 74 166 L56 154 L38 166 Q46 136 52 108Z" fill="#8cc63f"/>
    <ellipse cx="58" cy="92" rx="29" ry="42" fill="#00b3b0"/>
    <path d="M40 74 Q54 86 74 96 Q58 112 44 100 Q34 88 40 74Z" fill="#e2231a"/>
    <circle cx="62" cy="44" r="24" fill="#00b3b0"/>
    <path d="M84 38 Q104 44 84 56Z" fill="#ffd400"/>
    <path d="M56 22 Q60 8 70 12 Q64 18 64 24Z" fill="#e2231a"/>
    <circle cx="70" cy="40" r="4" fill="#0a0a0a"/>
  </g>
</symbol>

<symbol id="m-jhumka" viewBox="0 0 100 150">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M50 8 Q74 8 74 26 Q74 42 52 46" fill="none" stroke-width="4"/>
    <circle cx="50" cy="52" r="9" fill="#ffd400"/>
    <path d="M22 96 Q22 62 50 58 Q78 62 78 96Z" fill="#ffd400"/>
    <path d="M17 96 L83 96" stroke-width="5"/>
    <circle cx="30" cy="108" r="5" fill="#e2231a"/>
    <circle cx="50" cy="114" r="6" fill="#00b3b0"/>
    <circle cx="70" cy="108" r="5" fill="#e2231a"/>
  </g>
</symbol>

<symbol id="m-reel" viewBox="0 0 120 120">
  <g stroke="#0a0a0a" stroke-width="3">
    <circle cx="60" cy="60" r="52" fill="#1b3a8c"/>
    <circle cx="60" cy="60" r="13" fill="#fff8e7"/>
    <circle cx="60" cy="26" r="9" fill="#fff8e7"/>
    <circle cx="60" cy="94" r="9" fill="#fff8e7"/>
    <circle cx="26" cy="60" r="9" fill="#fff8e7"/>
    <circle cx="94" cy="60" r="9" fill="#fff8e7"/>
  </g>
</symbol>

<symbol id="m-cassette" viewBox="0 0 160 100">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <rect x="4" y="6" width="152" height="88" rx="8" fill="#e2231a"/>
    <rect x="18" y="16" width="124" height="36" rx="4" fill="#fff8e7"/>
    <circle cx="52" cy="34" r="12" fill="#ffd400"/>
    <circle cx="108" cy="34" r="12" fill="#ffd400"/>
    <path d="M42 68 L118 68 L106 88 L54 88Z" fill="#1b3a8c"/>
  </g>
</symbol>

<symbol id="m-auto" viewBox="0 0 160 120">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M18 76 L18 50 Q18 24 58 22 L102 22 Q130 24 130 50 L130 76Z" fill="#ffd400"/>
    <path d="M27 70 L27 50 Q27 33 58 31 L94 31 L94 70Z" fill="#fff8e7"/>
    <rect x="8" y="70" width="140" height="26" rx="6" fill="#00b3b0"/>
    <circle cx="44" cy="100" r="15" fill="#0a0a0a"/>
    <circle cx="44" cy="100" r="5" fill="#fff8e7"/>
    <circle cx="118" cy="100" r="15" fill="#0a0a0a"/>
    <circle cx="118" cy="100" r="5" fill="#fff8e7"/>
  </g>
</symbol>

<symbol id="m-diya" viewBox="0 0 120 90">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M60 10 Q74 28 67 40 Q63 50 53 42 Q45 32 60 10Z" fill="#ff9f1c"/>
    <path d="M16 52 Q60 44 104 52 Q102 60 94 64 Q60 76 26 64 Q18 60 16 52Z" fill="#ffd400"/>
    <circle cx="60" cy="40" r="5" fill="#fff8e7"/>
  </g>
</symbol>

<symbol id="m-kalash" viewBox="0 0 110 130">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M30 62 Q8 78 14 104 Q20 126 55 126 Q90 126 96 104 Q102 78 80 62Z" fill="#ffd400"/>
    <path d="M36 104 Q55 96 74 104" fill="none" stroke-width="3"/>
    <rect x="34" y="46" width="42" height="18" rx="5" fill="#e2231a"/>
    <path d="M24 32 Q55 6 86 32 Q55 42 24 32Z" fill="#8cc63f"/>
    <circle cx="55" cy="20" r="11" fill="#1b3a8c"/>
    <path d="M55 9 Q57 2 63 0" fill="none" stroke-width="3"/>
  </g>
</symbol>
`

function seeded(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/* The niche. An ogee arch the figure stands in, so the centre of the
   poster is a place rather than a gap. */
function archPath(cx, top, bottom, hw) {
  const mid = top + (bottom - top) * 0.52
  return `M ${cx - hw} ${bottom} L ${cx - hw} ${mid} ` +
    `C ${cx - hw} ${top + (bottom - top) * 0.18} ${cx - hw * 0.45} ${top + (bottom - top) * 0.04} ${cx} ${top} ` +
    `C ${cx + hw * 0.45} ${top + (bottom - top) * 0.04} ${cx + hw} ${top + (bottom - top) * 0.18} ${cx + hw} ${mid} ` +
    `L ${cx + hw} ${bottom} Z`
}

/* Shared placement: x/y are centres, s scales against the short edge. */
function castMarkup(cast, w, h) {
  return cast.map((m) => {
    const size = m.s * Math.min(w, h) * 1.6
    return `<use href="#${m.id}" x="${(m.x * w - size / 2).toFixed(1)}" y="${(m.y * h - size / 2).toFixed(1)}" ` +
      `width="${size.toFixed(1)}" height="${size.toFixed(1)}" ` +
      `transform="rotate(${m.rot} ${(m.x * w).toFixed(1)} ${(m.y * h).toFixed(1)})"/>`
  }).join('')
}

function mount(root, inner, w, h) {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  svg.innerHTML = `<defs>${SYMBOLS}</defs>${inner}`
  root.appendChild(svg)
  return { destroy() { svg.remove() } }
}

/* Inner panels: the same cast language, thinned out and kept to the edges. */
export function createPanelArt(root, cast) {
  if (!root || !cast || !cast.length) return { destroy() {} }
  const w = Math.max(320, root.clientWidth || window.innerWidth)
  const h = Math.max(320, root.clientHeight || window.innerHeight)
  return mount(root, castMarkup(cast, w, h), w, h)
}

export function createMural(root, opts = {}) {
  const w = Math.max(320, root.clientWidth || window.innerWidth)
  const h = Math.max(320, root.clientHeight || window.innerHeight)
  const parts = []

  /* 1 — the jharokha. */
  const hw = Math.min(w * 0.17, h * 0.30)
  const cx = w * 0.5
  parts.push(`<path d="${archPath(cx, h * 0.14, h * 1.02, hw)}" fill="#33065e" stroke="#0a0a0a" stroke-width="${Math.max(8, h * 0.014)}"/>`)

  /* 2 — the cast, at the edges. x/y are centres, s scales against the
        short edge. Everything is allowed to run off the frame. */
  const cast = [
    { id: 'm-lotus', x: 0.055, y: 0.095, s: 0.12, rot: -12 },
    { id: 'm-parrot', x: 0.795, y: 0.105, s: 0.10, rot: 10 },
    { id: 'm-reel', x: 0.30, y: 0.10, s: 0.085, rot: -8 },
    { id: 'm-cassette', x: 0.72, y: 0.075, s: 0.11, rot: 7 },
    { id: 'm-elephant', x: 0.10, y: 0.31, s: 0.20, rot: -4 },
    { id: 'm-jhumka', x: 0.045, y: 0.67, s: 0.10, rot: -14 },
    { id: 'm-paisley', x: 0.30, y: 0.58, s: 0.09, rot: 18 },
    { id: 'm-kalash', x: 0.70, y: 0.84, s: 0.085, rot: 0 },
    { id: 'm-peacock', x: 0.90, y: 0.33, s: 0.26, rot: 0 },
    { id: 'm-auto', x: 0.87, y: 0.66, s: 0.19, rot: -3 },
    { id: 'm-reel', x: 0.955, y: 0.86, s: 0.075, rot: 14 },
    { id: 'm-marigold', x: 0.78, y: 0.90, s: 0.085, rot: 0 },
    { id: 'm-marigold', x: 0.33, y: 0.90, s: 0.06, rot: 0 },
    { id: 'm-diya', x: 0.30, y: 0.80, s: 0.07, rot: 0 },
    { id: 'm-flower', x: 0.62, y: 0.06, s: 0.055, rot: 0 },
    { id: 'm-paisley', x: 0.66, y: 0.19, s: 0.045, rot: -22 },
  ]
  parts.push(castMarkup(cast, w, h))

  /* 3 — clustered bandhani dots, not a uniform scatter. */
  const clusters = [[0.12, 0.24], [0.36, 0.14], [0.74, 0.88], [0.94, 0.52], [0.24, 0.78]]
  clusters.forEach(([cx0, cy0], ci) => {
    for (let i = 0; i < 12; i++) {
      const x = (cx0 + (seeded(ci * 20 + i) - 0.5) * 0.12) * w
      const y = (cy0 + (seeded(ci * 20 + i + 7) - 0.5) * 0.14) * h
      const r = 3 + seeded(ci * 20 + i + 3) * 8
      const fill = ['#ffd400', '#00b3b0', '#1b3a8c', '#e2231a'][Math.floor(seeded(ci * 20 + i + 11) * 4)]
      parts.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" ` +
        `fill="${fill}" stroke="#0a0a0a" stroke-width="2"/>`
      )
    }
  })

  return mount(root, parts.join(''), w, h)
}
