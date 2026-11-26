import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const OUT = path.join(process.env.TEMP ?? '.', 'opencode', 'verify-vgpu')
fs.mkdirSync(OUT, { recursive: true })

const args = ['--enable-unsafe-webgpu']
let browser
try {
  browser = await chromium.launch({ channel: 'msedge', args })
} catch {
  browser = await chromium.launch({ args })
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

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const home = await page.evaluate(() => {
  const canvas = document.querySelector('.paint-canvas')
  return {
    ready: canvas?.getAttribute('data-ready'),
    backend: canvas?.getAttribute('data-backend'),
    size: canvas ? [canvas.width, canvas.height] : null,
    stop: canvas?.getAttribute('data-stop'),
    mix: canvas?.getAttribute('data-mix'),
  }
})
console.log('home', home)
check('WebGPU backend is active', home.backend === 'webgpu', home.backend)
check('canvas is ready', home.ready === 'true', home.ready)
check('canvas is sized to the viewport', home.size?.[0] === 1440 && home.size?.[1] === 900, JSON.stringify(home.size))
check('ground starts on the home stop', home.stop === '0', home.stop)
await page.screenshot({ path: path.join(OUT, 'home.png') })

await page.goto('http://localhost:3000/#contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
await page.locator('.horn-sign').click()

const hornSamples = []
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(80)
  hornSamples.push(Number(await page.evaluate(() => document.querySelector('.paint-canvas')?.getAttribute('data-horn') ?? 0)))
  if (i === 4) await page.screenshot({ path: path.join(OUT, 'horn.png') })
}
const hornMax = Math.max(...hornSamples)
console.log('horn max', hornMax)
check('horn drives the ripple', hornMax > 0.05, hornMax)

await page.waitForTimeout(600)
const hornAfter = Number(await page.evaluate(() => document.querySelector('.paint-canvas')?.getAttribute('data-horn') ?? 0))
check('ripple settles back to zero', hornAfter === 0, hornAfter)

const reduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const reducedPage = await reduced.newPage()
await reducedPage.goto('http://localhost:3000/#contact', { waitUntil: 'networkidle' })
await reducedPage.waitForTimeout(2500)
await reducedPage.locator('.horn-sign').click()
await reducedPage.waitForTimeout(300)
const reducedHorn = Number(await reducedPage.evaluate(() => document.querySelector('.paint-canvas')?.getAttribute('data-horn') ?? 0))
check('reduced motion skips the ripple', reducedHorn === 0, reducedHorn)

await reducedPage.evaluate(() => {
  const track = document.querySelector('.track')
  track.style.scrollSnapType = 'none'
  track.scrollLeft = track.clientWidth * 1.5
})
await reducedPage.waitForTimeout(250)
const transitionPanel = await reducedPage.evaluate(() => document.querySelector('.paint-canvas')?.getAttribute('data-panel'))
check('mid-transition selects the destination panel', transitionPanel === '2', transitionPanel)
await reduced.close()

const fallback = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await fallback.addInitScript(() => {
  try {
    delete Navigator.prototype.gpu
  } catch {
    /* ignore */
  }
})
const fallbackPage = await fallback.newPage()
const fallbackErrors = []
fallbackPage.on('pageerror', (error) => fallbackErrors.push(error.message))
await fallbackPage.goto('http://localhost:3000/#projects', { waitUntil: 'networkidle' })
await fallbackPage.waitForTimeout(2500)

const fallbackState = await fallbackPage.evaluate(() => {
  const canvas = document.querySelector('.paint-canvas')
  return {
    ready: canvas?.getAttribute('data-ready'),
    backend: canvas?.getAttribute('data-backend'),
    body: getComputedStyle(document.body).backgroundColor,
    stop: canvas?.getAttribute('data-stop'),
  }
})
console.log('fallback', fallbackState)
check('no-WebGPU browser reports fallback', fallbackState.backend === 'fallback', fallbackState.backend)
check('fallback canvas is not marked ready', fallbackState.ready === 'false', fallbackState.ready)
check('fallback keeps the projects pigment', fallbackState.body === 'rgb(255, 46, 136)', fallbackState.body)
await fallbackPage.screenshot({ path: path.join(OUT, 'fallback-projects.png') })

check('WebGPU page has no page errors', errors.length === 0, errors.join('; '))
check('fallback page has no page errors', fallbackErrors.length === 0, fallbackErrors.join('; '))

await fallback.close()
await browser.close()

if (failures > 0) {
  console.error(`\n${failures} vgpu check(s) failed`)
  process.exit(1)
}
console.log('\nvgpu checks passed')
