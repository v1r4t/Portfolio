import { readFileSync } from 'node:fs'
import { effect, frame, init, sampler, target, texture } from 'vgpu/node'
import { prepareShader } from '@vgpu/wgsl/prepare'

const WIDTH = 64
const HEIGHT = 64
const SOURCE = 16
const shaderPath = new URL('../src/shaders/portrait.wgsl', import.meta.url)

const shader = prepareShader(readFileSync(shaderPath, 'utf8'))
const gpu = await init()
const colorTarget = target(gpu, { size: [WIDTH, HEIGHT], format: 'rgba8unorm' })

const photo = texture(gpu, {
  kind: '2d',
  size: [SOURCE, SOURCE],
  format: 'rgba8unorm',
  usage: ['texture_binding', 'copy_dst'],
})
const pixels = new Uint8Array(SOURCE * SOURCE * 4)
for (let y = 0; y < SOURCE; y++) {
  for (let x = 0; x < SOURCE; x++) {
    const i = (y * SOURCE + x) * 4
    const dark = x < SOURCE / 2
    pixels[i] = dark ? 40 : 240
    pixels[i + 1] = dark ? 40 : 240
    pixels[i + 2] = dark ? 40 : 240
    pixels[i + 3] = dark ? 255 : 0
  }
}
gpu.gpu.queue.writeTexture(
  { texture: photo.gpu },
  pixels,
  { bytesPerRow: SOURCE * 4, rowsPerImage: SOURCE },
  { width: SOURCE, height: SOURCE, depthOrArrayLayers: 1 }
)

const base = {
  resolution: [WIDTH, HEIGHT],
  pointer: [WIDTH * 2, HEIGHT * 2],
  dotSize: 8,
  horn: 0,
  strength: 0,
  alpha: 0.72,
  _pad: [0, 0, 0, 0],
}

const portrait = effect(gpu, shader, {
  set: { params: base, photo, photoSampler: sampler(gpu, { minFilter: 'linear', magFilter: 'linear' }) },
})
await portrait.compile(colorTarget)

async function render(patch) {
  portrait.set({ params: { ...base, ...patch } })
  frame(gpu, (current) => current.pass(colorTarget, portrait))
  return colorTarget.color.read({ mipLevel: 0, region: 'all' })
}

const countAlpha = (pixels, fromX, toX) => {
  let count = 0
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = fromX; x < toX; x++) {
      if (pixels[(y * WIDTH + x) * 4 + 3] > 8) count += 1
    }
  }
  return count
}

const countAlphaTotal = (pixels) => {
  let count = 0
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 8) count += 1
  }
  return count
}

let failures = 0
function check(name, condition, detail) {
  if (condition) {
    console.log(`✓ ${name}`)
    return
  }
  failures += 1
  console.error(`✗ ${name}: ${detail}`)
}

const still = await render({})
const left = countAlpha(still, 0, WIDTH / 2)
const right = countAlpha(still, WIDTH / 2, WIDTH)
check('opaque dark pixels become halftone dots', left > 200, left)
check('transparent pixels produce no dots', right === 0, right)

const pointer = await render({ pointer: [WIDTH / 4, HEIGHT / 2], strength: 1 })
const pointerCount = countAlphaTotal(pointer)
const stillCount = countAlphaTotal(still)
check('pointer swells the dots', pointerCount > stillCount, `${stillCount} -> ${pointerCount}`)

const horn = await render({ horn: 1 })
const hornCount = countAlphaTotal(horn)
check('horn pulses the dots', hornCount > stillCount, `${stillCount} -> ${hornCount}`)

if (failures > 0) {
  console.error(`\n${failures} portrait shader check(s) failed`)
  photo.destroy()
  gpu.dispose()
  process.exit(1)
}

console.log('\nportrait shader checks passed')
photo.destroy()
gpu.dispose()
