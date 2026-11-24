import { ImageResponse } from 'next/og'

const size = { width: 1200, height: 630 }

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const safeColor = (value: string | null, fallback: string) => (value && HEX.test(value) ? value : fallback)

let tekoFont: Promise<ArrayBuffer | null> | null = null

/** Teko 700 as TTF for satori; fails soft to system sans. */
function loadTeko(): Promise<ArrayBuffer | null> {
  if (!tekoFont) {
    tekoFont = (async () => {
      try {
        const css = await fetch('https://fonts.googleapis.com/css2?family=Teko:wght@700&display=swap', {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
          },
          next: { revalidate: 86400 },
        }).then((res) => res.text())
        const url = /url\((https:\/\/[^)]+)\)/.exec(css)?.[1]
        if (!url || url.endsWith('.woff2')) return null
        return await fetch(url).then((res) => res.arrayBuffer())
      } catch {
        return null
      }
    })()
  }
  return tekoFont
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') ?? 'Dhruva Vura').slice(0, 90)
  const sub = (searchParams.get('sub') ?? 'Designer & Creative Engineer').slice(0, 120)
  const bg = safeColor(searchParams.get('bg'), '#45107a')
  const accent = safeColor(searchParams.get('accent'), '#ffd400')

  const teko = await loadTeko()
  const fonts = teko ? [{ name: 'Teko', data: teko, weight: 700 as const, style: 'normal' as const }] : undefined
  const displayFont = teko ? 'Teko' : 'Arial, sans-serif'

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          color: '#fff8e7',
          padding: 56,
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -140,
            top: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: accent,
            opacity: 0.9,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -120,
            bottom: -160,
            width: 420,
            height: 420,
            borderRadius: 9999,
            border: '18px solid #0a0a0a',
            opacity: 0.35,
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 8, fontWeight: 700 }}>
          HORN OK PLEASE // NH-44
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
            paddingLeft: 18,
            borderLeft: '14px solid #0a0a0a',
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: teko ? (title.length > 40 ? 74 : 104) : title.length > 40 ? 62 : 82,
              fontWeight: 700,
              lineHeight: 0.96,
              textTransform: 'uppercase',
              letterSpacing: teko ? 0 : -1.5,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, marginTop: 24, opacity: 0.92 }}>{sub}</div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '6px solid #0a0a0a',
            paddingTop: 18,
            fontSize: 20,
            letterSpacing: 5,
            opacity: 0.9,
          }}
        >
          <span>DHRUVA VURA</span>
          <span>PORTFOLIO // 2026</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  )

  const headers = new Headers(image.headers)
  headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800')
  return new Response(image.body, { status: image.status, headers })
}
