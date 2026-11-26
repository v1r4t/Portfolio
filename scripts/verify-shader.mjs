import { readFileSync } from 'node:fs'
import { effect, frame, init, target } from 'vgpu/node'
import { prepareShader } from '@vgpu/wgsl/prepare'

const WIDTH = 64
const HEIGHT = 64
const shaderPath = new URL('../src/shaders/paint.wgsl', import.meta.url)

const shader = prepareShader(readFileSync(shaderPath, 'utf8'))
const gpu = await init()
const colorTarget = target(gpu, { size: [WIDTH, HEIGHT], format: 'rgba8unorm' })

const base = {
  colorA: [0.27, 0.06, 0.48, 1],
  colorB: [1, 0.18, 0.53, 1],
  resolution: [WIDTH, HEIGHT],
  hornOrigin: [WIDTH / 2, HEIGHT / 2],
  mix: 0,
  horn: 0,
  hornAge: 0,
  panel: 0,
}

const paint = effect(gpu, shader, { set: { paint: base } })
await paint.compile(colorTarget)

async function render(patch) {
  paint.set({ paint: { ...base, ...patch } })
  frame(gpu, (current) => current.pass(colorTarget, paint))
  return colorTarget.color.read({ mipLevel: 0, region: 'all' })
}

const toRgb = (pixels, index) => [pixels[index], pixels[index + 1], pixels[index + 2]]
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const diffCount = (a, b) => {
  let changed = 0
  for (let i = 0; i < a.length; i += 4) {
    if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) changed += 1
  }
  return changed
}
const centerIndex = (Math.floor(HEIGHT / 2) * WIDTH + Math.floor(WIDTH / 2)) * 4
const cornerIndex = 0
const targetA = [69, 15, 122]
const targetB = [255, 46, 136]

let failures = 0

function check(name, condition, detail) {
  if (condition) {
    console.log(`✓ ${name}`)
    return
  }
  failures += 1
  console.error(`✗ ${name}: ${detail}`)
}

const mix0 = await render({ mix: 0 })
const mix1 = await render({ mix: 1 })
const mixHalf = await render({ mix: 0.5 })
const mixEnd = await render({ mix: 0.999 })
const stamp = await render({ mix: 0.5, panel: 1 })
const ticket = await render({ mix: 0.5, panel: 2 })
const chevron = await render({ mix: 0.5, panel: 3 })
const inkFlood = await render({ mix: 0.5, panel: 4 })
const hornOn = await render({ mix: 0.5, horn: 1, hornAge: 0.35 })
const hornOff = await render({ mix: 0.5, horn: 0, hornAge: 0.35 })

const centerA = toRgb(mix0, cornerIndex)
const centerB = toRgb(mix1, centerIndex)
check('mix 0 is color A', distance(centerA, targetA) < 20, `${centerA} vs ${targetA}`)
check('mix 1 is color B', distance(centerB, targetB) < 12, `${centerB} vs ${targetB}`)

let aPixels = 0
let bPixels = 0
for (let i = 0; i < mixHalf.length; i += 4) {
  const pixel = toRgb(mixHalf, i)
  if (distance(pixel, targetA) < distance(pixel, targetB)) aPixels += 1
  else bPixels += 1
}
check('mix 0.5 keeps both pigments', aPixels > 100 && bPixels > 100, `A=${aPixels} B=${bPixels}`)

let endA = 0
let endNearB = 0
for (let i = 0; i < mixEnd.length; i += 4) {
  const pixel = toRgb(mixEnd, i)
  if (distance(pixel, targetA) < distance(pixel, targetB)) endA += 1
  if (distance(pixel, targetB) < 20) endNearB += 1
}
check('transition does not end on color A', endA < 50, `${endA} A-like pixels at the end`)
check(
  'transition resolves to the incoming color',
  endNearB > WIDTH * HEIGHT * 0.95,
  `${endNearB} B-like pixels at the end`
)

const nearB = (pixels) => {
  let count = 0
  for (let i = 0; i < pixels.length; i += 4) {
    if (distance(toRgb(pixels, i), targetB) < 20) count += 1
  }
  return count
}
const chevronEnd = await render({ mix: 0.999, panel: 3 })
const inkEnd = await render({ mix: 0.999, panel: 4 })
check(
  'chevron resolves to the incoming color',
  nearB(chevronEnd) > WIDTH * HEIGHT * 0.95,
  `${nearB(chevronEnd)} B-like pixels`
)
check(
  'ink flood resolves to the incoming color',
  nearB(inkEnd) > WIDTH * HEIGHT * 0.95,
  `${nearB(inkEnd)} B-like pixels`
)

check('About uses a distinct stamp transition', diffCount(stamp, mixHalf) > 200, diffCount(stamp, mixHalf))
check('Blogs uses a distinct ticket transition', diffCount(ticket, stamp) > 200, diffCount(ticket, stamp))
check('Projects uses a distinct chevron transition', diffCount(chevron, ticket) > 200, diffCount(chevron, ticket))
check('Contact uses a distinct ink-flood transition', diffCount(inkFlood, chevron) > 200, diffCount(inkFlood, chevron))

let hornDiff = 0
for (let i = 0; i < hornOn.length; i += 4) {
  if (
    hornOn[i] !== hornOff[i] ||
    hornOn[i + 1] !== hornOff[i + 1] ||
    hornOn[i + 2] !== hornOff[i + 2]
  ) {
    hornDiff += 1
  }
}
check('horn ripple changes the ground', hornDiff > 100, `${hornDiff} pixels changed`)

if (failures > 0) {
  console.error(`\n${failures} shader check(s) failed`)
  gpu.dispose()
  process.exit(1)
}

console.log('\npaint shader checks passed')
gpu.dispose()
