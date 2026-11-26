import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const OUT = path.join(process.env.TEMP ?? '.', 'opencode', 'verify')
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

// Loader counter
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(450)
const loader = await page.evaluate(() => {
  const percent = document.querySelector('.load-percent')?.textContent
  const curtain = document.querySelector('.load')?.className
  return { percent, curtain }
})
await page.screenshot({ path: path.join(OUT, 'loader.png') })
console.log('loader', loader)
await page.waitForTimeout(3200)

// Ink cursor
await page.mouse.move(720, 460)
await page.waitForTimeout(500)
const cursor = await page.evaluate(() => {
  const dot = document.querySelector('.ink-cursor')
  const style = dot ? getComputedStyle(dot) : null
  return {
    hasClass: document.body.classList.contains('has-ink-cursor'),
    opacity: style?.opacity,
    transform: style?.transform,
  }
})
await page.screenshot({ path: path.join(OUT, 'cursor.png') })
console.log('cursor', cursor)

// Audio-reactive bulbs (contact panel horn)
await page.goto('http://localhost:3000/#contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(2800)
await page.locator('.horn-sign').click()
const levels = await page.evaluate(async () => {
  const samples = []
  for (let i = 0; i < 14; i++) {
    await new Promise((r) => setTimeout(r, 90))
    const v = getComputedStyle(document.documentElement).getPropertyValue('--horn-level').trim()
    samples.push(Number(v || 0))
  }
  return samples
})
console.log('horn levels', levels, 'max', Math.max(...levels))

// Detail page parallax
await page.goto('http://localhost:3000/projects/desi-neon-kinetic-identity', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const before = await page.evaluate(() => getComputedStyle(document.querySelector('.detail-title')).transform)
await page.mouse.wheel(0, 600)
await page.waitForTimeout(900)
const after = await page.evaluate(() => getComputedStyle(document.querySelector('.detail-title')).transform)
console.log('parallax', { before, after, changed: before !== after })
await page.screenshot({ path: path.join(OUT, 'detail-scrolled.png') })

// Mobile shader view
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await mobile.waitForTimeout(3200)
const mobileCanvas = await mobile.evaluate(() => {
  const c = document.querySelector('.paint-canvas')
  return {
    ready: c?.getAttribute('data-ready'),
    backend: c?.getAttribute('data-backend'),
    width: c?.width,
    height: c?.height,
  }
})
await mobile.screenshot({ path: path.join(OUT, 'mobile-motion.png') })
console.log('mobile canvas', mobileCanvas)

console.log('errors', errors)
await browser.close()
