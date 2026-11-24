/* TRIM — the print margin layer.
   Frame, riso screen, hanging chillies and the sunburst inside the niche.
   Additive and reversible: load any page with ?bg=off to see the site without
   it, or delete this file, /src/trim.css, /public/trim-frame.svg and the two
   tags in index.html. */

const NS = 'http://www.w3.org/2000/svg'

const SYMBOLS = `
<defs>
  <path id="x-pod" d="M0 6 C-12 40 -13 98 0 154 C6 170 17 168 19 150 C23 94 14 38 0 6Z"/>
  <path id="x-cal" d="M-6 4 Q0 -7 6 4 Q0 12 -6 4Z"/>
</defs>

<symbol id="x-chilli" viewBox="0 0 180 240">
  <g stroke="#0a0a0a" stroke-width="3" stroke-linejoin="round">
    <path d="M90 0 L90 26" fill="none" stroke-width="2.4"/>
    <circle cx="90" cy="29" r="4.5" fill="#ffd400"/>
    <path d="M90 33 C76 24 64 28 58 39 C72 42 82 39 90 33Z" fill="#8cc63f"/>
    <path d="M90 33 C104 24 116 28 122 39 C108 42 98 39 90 33Z" fill="#8cc63f"/>
  </g>

  <g transform="translate(90 36)">
    <g transform="rotate(-24)">
      <use href="#x-pod" fill="#fff8e7" stroke="#fff8e7" stroke-width="8"/>
      <use href="#x-cal" fill="#fff8e7" stroke="#fff8e7" stroke-width="8"/>
      <use href="#x-pod" fill="#cf1d15" stroke="#0a0a0a" stroke-width="4" stroke-linejoin="round"/>
      <use href="#x-cal" fill="#8cc63f" stroke="#0a0a0a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M2 24 C-5 58 -5 106 2 136" fill="none" stroke="#fff8e7" stroke-width="2.2" opacity=".35"/>
    </g>
    <g>
      <use href="#x-pod" fill="#fff8e7" stroke="#fff8e7" stroke-width="8"/>
      <use href="#x-cal" fill="#fff8e7" stroke="#fff8e7" stroke-width="8"/>
      <use href="#x-pod" fill="#cf1d15" stroke="#0a0a0a" stroke-width="4" stroke-linejoin="round"/>
      <use href="#x-cal" fill="#8cc63f" stroke="#0a0a0a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M2 24 C-5 60 -6 110 1 142" fill="none" stroke="#fff8e7" stroke-width="2.2" opacity=".35"/>
    </g>
    <g transform="rotate(24)">
      <use href="#x-pod" fill="#fff8e7" stroke="#fff8e7" stroke-width="8"/>
      <use href="#x-cal" fill="#fff8e7" stroke="#fff8e7" stroke-width="8"/>
      <use href="#x-pod" fill="#cf1d15" stroke="#0a0a0a" stroke-width="4" stroke-linejoin="round"/>
      <use href="#x-cal" fill="#8cc63f" stroke="#0a0a0a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M2 24 C-5 58 -5 106 2 136" fill="none" stroke="#fff8e7" stroke-width="2.2" opacity=".35"/>
    </g>
  </g>
</symbol>
`

/* Same niche as createMural, so the burst sits exactly inside the arch. */
function archPath(cx, top, bottom, hw) {
  const mid = top + (bottom - top) * 0.52
  return `M ${cx - hw} ${bottom} L ${cx - hw} ${mid} ` +
    `C ${cx - hw} ${top + (bottom - top) * 0.18} ${cx - hw * 0.45} ${top + (bottom - top) * 0.04} ${cx} ${top} ` +
    `C ${cx + hw * 0.45} ${top + (bottom - top) * 0.04} ${cx + hw} ${top + (bottom - top) * 0.18} ${cx + hw} ${mid} ` +
    `L ${cx + hw} ${bottom} Z`
}

function createSvg(w, h) {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  return svg
}

function addSunburst(mural) {
  if (!mural) return
  const w = Math.max(320, mural.clientWidth || window.innerWidth)
  const h = Math.max(320, mural.clientHeight || window.innerHeight)
  const cx = w * 0.5
  const top = h * 0.14
  const hw = Math.min(w * 0.17, h * 0.30)
  const oy = h * 0.43
  const reach = Math.hypot(w, h)

  const N = 22
  let rays = ''
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2
    const a1 = ((i + 1) / N) * Math.PI * 2
    const pad = (a1 - a0) * 0.30
    const point = (a) =>
      `${(cx + Math.cos(a) * reach).toFixed(1)} ${(oy + Math.sin(a) * reach).toFixed(1)}`
    rays += `<path d="M${cx.toFixed(1)} ${oy.toFixed(1)} L${point(a0 + pad)} L${point(a1 - pad)} Z"/>`
  }

  const svg = createSvg(w, h)
  svg.innerHTML =
    `<defs><clipPath id="x-niche"><path d="${archPath(cx, top, h * 1.02, hw)}"/></clipPath></defs>` +
    `<g clip-path="url(#x-niche)">` +
    `<circle cx="${cx.toFixed(1)}" cy="${oy.toFixed(1)}" r="${(h * 0.13).toFixed(1)}" fill="#ffd400" opacity=".18"/>` +
    `<g fill="#ffd400" opacity=".30">${rays}</g>` +
    `</g>`
  mural.appendChild(svg)
}

/* One chilli string per sparse panel, hung from the top edge. */
const HANG = {
  about: { x: 0.925, s: 0.30, rot: 5 },
  blogs: { x: 0.935, s: 0.24, rot: -4 },
  contact: { x: 0.925, s: 0.30, rot: 5 },
}

function addHang(panel, spec) {
  const w = Math.max(320, panel.clientWidth || window.innerWidth)
  const h = Math.max(320, panel.clientHeight || window.innerHeight)
  const size = Math.min(spec.s * h, w * 0.42)
  const boxW = size * (180 / 240)
  const x = Math.min(spec.x * w, w - 14 - boxW / 2) - boxW / 2
  const svg = createSvg(w, h)
  svg.innerHTML =
    `${SYMBOLS}` +
    `<g transform="rotate(${spec.rot} ${(x + boxW / 2).toFixed(1)} 0)">` +
    `<use href="#x-chilli" x="${x.toFixed(1)}" y="${(-size * 0.02).toFixed(1)}" ` +
    `width="${boxW.toFixed(1)}" height="${size.toFixed(1)}"/>` +
    `</g>`
  panel.querySelector('.trim').appendChild(svg)
}

function build() {
  const panels = [...document.querySelectorAll('.panel')]
  for (const panel of panels) {
    const trim = document.createElement('div')
    trim.className = 'trim'
    trim.setAttribute('aria-hidden', 'true')
    trim.innerHTML = '<div class="trim-halftone"></div><div class="trim-frame"></div>'
    const art = panel.querySelector('.panel-art') || panel.querySelector('#mural')
    panel.insertBefore(trim, art || panel.firstChild)

    if (panel.id === 'home') addSunburst(panel.querySelector('#mural'))
    if (HANG[panel.id]) addHang(panel, HANG[panel.id])
  }
}

if (new URLSearchParams(location.search).get('bg') !== 'off') build()
