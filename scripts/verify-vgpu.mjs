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

// Regression: browser extensions (Bitdefender et al.) inject bis_skin_checked
// into the server HTML. The layout guard must strip it before hydration, or
// the poster loader never lifts.
const extension = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await extension.addInitScript(() => {
  const mark = (node) => {
    if (node.nodeType !== 1) return
    node.setAttribute('bis_skin_checked', '1')
    node.setAttribute('bis_register', 'test')
    node.setAttribute('__processed_test__', 'true')
    node.querySelectorAll('*').forEach((el) => {
      el.setAttribute('bis_skin_checked', '1')
      el.setAttribute('bis_register', 'test')
      el.setAttribute('__processed_test__', 'true')
    })
  }
  const attach = () => {
    if (!document.documentElement) return requestAnimationFrame(attach)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) mutation.addedNodes.forEach(mark)
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })
    mark(document.documentElement)
    window.addEventListener('load', () => observer.disconnect(), { once: true })
  }
  attach()
})
const extensionPage = await extension.newPage()
const extensionErrors = []
extensionPage.on('pageerror', (error) => extensionErrors.push(error.message))
await extensionPage.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await extensionPage.waitForTimeout(4500)
const extensionState = await extensionPage.evaluate(() => ({
  loader: Boolean(document.querySelector('.load')),
  wordmark: document.querySelector('.wordmark')
    ? getComputedStyle(document.querySelector('.wordmark')).opacity
    : null,
  injected: document.querySelectorAll('[bis_skin_checked]').length,
}))
check(
  'extension attributes do not block hydration',
  !extensionState.loader && extensionState.wordmark === '1' && extensionState.injected === 0,
  JSON.stringify(extensionState)
)
check('extension page has no page errors', extensionErrors.length === 0, extensionErrors.join('; '))
await extension.close()

// Regression: a stale/partial cached stylesheet once dropped the .track-inner
// rule, stacking the panels and making the journey unscrollable. The critical
// inline rule must keep the track horizontal even without that CSS rule.
const stale = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const stalePage = await stale.newPage()
await stalePage.route('**/*.css', async (route) => {
  const response = await route.fetch()
  let css = await response.text()
  css = css.replace(/\.track-inner\s*\{[^}]*\}/g, '')
  await route.fulfill({ response, body: css })
})
await stalePage.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await stalePage.waitForTimeout(3500)
const staleLayout = await stalePage.evaluate(() => {
  const inner = document.querySelector('.track-inner')
  const track = document.querySelector('.track')
  return {
    display: inner ? getComputedStyle(inner).display : null,
    width: track?.clientWidth,
    scrollWidth: track?.scrollWidth,
  }
})
check('stale stylesheet keeps the track horizontal', staleLayout.display === 'flex', staleLayout.display)
check(
  'stale stylesheet keeps all five panels',
  staleLayout.scrollWidth === (staleLayout.width ?? 0) * 5,
  JSON.stringify(staleLayout)
)
await stalePage.mouse.move(720, 450)
await stalePage.mouse.wheel(0, 600)
await stalePage.waitForTimeout(1400)
const wheelScrollLeft = await stalePage.evaluate(() => document.querySelector('.track')?.scrollLeft)
check('wheel scroll moves the journey', (wheelScrollLeft ?? 0) > 0, wheelScrollLeft)
await stale.close()

const wheelReduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const wheelReducedPage = await wheelReduced.newPage()
await wheelReducedPage.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await wheelReducedPage.waitForTimeout(3000)
await wheelReducedPage.mouse.move(720, 450)
await wheelReducedPage.mouse.wheel(0, 700)
await wheelReducedPage.waitForTimeout(700)
const reducedScrollLeft = await wheelReducedPage.evaluate(
  () => document.querySelector('.track')?.scrollLeft
)
check(
  'reduced motion maps vertical wheel to the next panel',
  reducedScrollLeft === 1440,
  reducedScrollLeft
)
await wheelReduced.close()

await fallback.close()
await browser.close()

if (failures > 0) {
  console.error(`\n${failures} vgpu check(s) failed`)
  process.exit(1)
}
console.log('\nvgpu checks passed')
