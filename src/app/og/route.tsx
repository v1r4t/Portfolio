import { ImageResponse } from 'next/og'

export const alt = 'Dhruva Vura — truck-art poster'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') ?? 'Dhruva Vura').slice(0, 90)
  const sub = (searchParams.get('sub') ?? 'Designer & Creative Engineer').slice(0, 120)
  const bg = searchParams.get('bg') ?? '#45107a'
  const accent = searchParams.get('accent') ?? '#ffd400'

  return new ImageResponse(
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
          HORN OK PLEASE ✦ NH-44
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
              fontSize: title.length > 40 ? 64 : 84,
              fontWeight: 800,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, marginTop: 24, opacity: 0.92 }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, opacity: 0.85 }}>
          DHRUVA VURA ✦ DESIGNER & CREATIVE ENGINEER ✦ 2026
        </div>
      </div>
    ),
    { ...size }
  )
}
