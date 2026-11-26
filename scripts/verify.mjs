import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.join(process.env.TEMP ?? '.', 'opencode', 'verify')
fs.mkdirSync(OUT, { recursive: true })

const BASE = 'http://localhost:3000'
const results = {}
const consoleErrors = []

async function openPage(browser, { url, viewport, reducedMotion = false }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' })
  const page = await context.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`${url}: ${msg.text()}`)
  })
  page.on('pageerror', (err) => consoleErrors.push(`${url}: ${err.message}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3200)
  return { context, page }
}

const browser = await chromium.launch()

// —— Desktop journey ——
{
  const { context, page } = await openPage(browser, { url: `${BASE}/`, viewport: { width: 1440, height: 900 } })
  const vw = await page.evaluate(() => window.innerWidth)

  results.panelCount = await page.locator('.panel-slot').count()
  results.trackScrollWidth = await page.evaluate(() => document.querySelector('.track')?.scrollWidth)
  results.expectedScrollWidth = vw * 5

  // ornament overlay discipline: every art layer is pointer-events: none
  results.pointerLeaks = await page.evaluate(() => {
    const bad = []
    document.querySelectorAll('.panel-art, .corner-cluster, .ornament-frame, .bulb-chain, .hazard-tape, .chevron-band, .permit-stamp, .lattice, .grain, .trim-halftone').forEach((el) => {
      if (getComputedStyle(el).pointerEvents !== 'none') bad.push(el.className)
    })
    return bad
  })

  // clicks land on cards, not art
  await page.locator('#projects').scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(500)
  results.projectCardHit = await page.evaluate(() => {
    const card = document.querySelector('.project-card')
    if (!card) return 'no card'
    const r = card.getBoundingClientRect()
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return el?.closest('.project-card') ? 'ok' : `blocked by ${el?.className}`
  })

  // keyboard: ArrowRight twice from home (Lenis animates, so allow the full tween)
  await page.evaluate(() => document.querySelector('.track')?.scrollTo({ left: 0, behavior: 'auto' }))
  await page.waitForTimeout(600)
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(1600)
  results.keyboardScrollLeft = await page.evaluate(() => document.querySelector('.track')?.scrollLeft)
  results.keyboardExpected = vw * 2

  results.paintCanvas = await page.evaluate(() => {
    const canvas = document.querySelector('.paint-canvas')
    return {
      exists: !!canvas,
      ready: canvas?.getAttribute('data-ready') ?? null,
      backend: canvas?.getAttribute('data-backend') ?? null,
    }
  })

  // mid-dissolve: park between panels to capture the halftone paint wipe
  await page.evaluate(() => {
    const track = document.querySelector('.track')
    if (track) track.scrollLeft = track.clientWidth * 1.5
  })
  await page.waitForTimeout(120)
  await page.screenshot({ path: path.join(OUT, 'mid-dissolve.png') })
  await page.waitForTimeout(1400)

  await page.screenshot({ path: path.join(OUT, 'desktop-projects.png') })
  await context.close()
}

// —— Hash restore ——
{
  const { context, page } = await openPage(browser, { url: `${BASE}/#projects`, viewport: { width: 1440, height: 900 } })
  const vw = await page.evaluate(() => window.innerWidth)
  await page.waitForTimeout(1600)
  results.hashScrollLeft = await page.evaluate(() => document.querySelector('.track')?.scrollLeft)
  results.hashExpected = vw * 3
  await context.close()
}

// —— Reduced motion ——
{
  const { context, page } = await openPage(browser, { url: `${BASE}/`, viewport: { width: 1440, height: 900 }, reducedMotion: true })
  results.reducedCurtainGone = await page.evaluate(() => !document.querySelector('.load'))
  results.reducedPosterVisible = await page.evaluate(() => {
    const el = document.querySelector('.top-word')
    return el ? getComputedStyle(el).opacity : null
  })
  await page.screenshot({ path: path.join(OUT, 'reduced-motion.png') })
  await context.close()
}

// —— Mobile ——
{
  const { context, page } = await openPage(browser, {
    url: `${BASE}/`,
    viewport: { width: 390, height: 844 },
  })
  results.mobilePanelCount = await page.locator('.panel-slot').count()
  results.mobileBodyOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  results.mobileCurtainGone = await page.evaluate(() => !document.querySelector('.load'))
  await page.screenshot({ path: path.join(OUT, 'mobile-home.png') })

  await page.evaluate(() => document.querySelector('.track')?.scrollTo({ left: document.querySelector('.track').clientWidth * 3, behavior: 'auto' }))
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(OUT, 'mobile-projects.png') })
  await context.close()
}

// —— Detail pages ——
{
  const { context, page } = await openPage(browser, { url: `${BASE}/projects/desi-neon-kinetic-identity`, viewport: { width: 1440, height: 900 } })
  results.projectDetailTitle = await page.locator('h1').first().innerText()
  results.projectDetailHasMetrics = (await page.locator('.metric-tile').count()) > 0
  await page.screenshot({ path: path.join(OUT, 'project-detail.png'), fullPage: false })
  await context.close()

  const blog = await openPage(browser, { url: `${BASE}/blog/sign-painters-eye-highway-lettering`, viewport: { width: 1440, height: 900 } })
  results.blogParagraphs = await blog.page.locator('.prose p').count()
  results.blogTitle = await blog.page.locator('h1').first().innerText()
  await blog.page.screenshot({ path: path.join(OUT, 'blog-detail.png'), fullPage: false })
  await blog.context.close()
}

// —— OG image ——
{
  const { context, page } = await openPage(browser, { url: `${BASE}/og?title=Horn%20OK%20Please`, viewport: { width: 1200, height: 630 } })
  await page.screenshot({ path: path.join(OUT, 'og.png') })
  await context.close()
}

results.consoleErrors = consoleErrors
await browser.close()
console.log(JSON.stringify(results, null, 2))
