import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Link-preview card for texts, email, and social shares. Generated at build
// time at the exact size platforms expect. It deliberately leaves out sale
// pricing: platforms cache previews for weeks, well past any promo deadline.
export const alt = 'LuxWeb Studio — custom websites that bring you customers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/android-chrome-512x512.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#010409',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(124, 58, 237, 0.35), transparent 55%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: -28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={150} height={100} alt="" />
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>LuxWeb Studio</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            A website that actually brings you customers.
          </div>
          <div style={{ fontSize: 32, color: '#c4b5fd' }}>
            Custom sites for local service businesses · Live in 2–3 weeks
          </div>
        </div>

        <div style={{ fontSize: 26, color: '#9ca3af' }}>luxwebstudio.dev</div>
      </div>
    ),
    size,
  )
}
