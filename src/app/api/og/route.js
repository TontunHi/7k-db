import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Dynamic title from query params
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'SEVEN KNIGHTS REBIRTH DB'

    const subtitle = hasTitle
      ? 'SEVEN KNIGHTS REBIRTH DATABASE'
      : 'The ultimate database for heroes, builds, and strategies.'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            // Create a subtle gold glow effect from the center bottom
            backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(255, 215, 0, 0.15) 0%, #050505 70%)',
          }}
        >
          {/* Decorative Gold Orbs */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 215, 0, 0.08)',
              filter: 'blur(80px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20%',
              right: '5%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(255, 165, 0, 0.05)',
              filter: 'blur(90px)',
            }}
          />

          {/* Logo / Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 32px',
              borderRadius: '16px',
              background: 'linear-gradient(to right, #FFD700, #FFA500)',
              marginBottom: '32px',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.25)',
              color: '#000000',
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            7K-DB
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              fontSize: hasTitle ? '80px' : '96px',
              fontStyle: 'italic',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              whiteSpace: 'pre-wrap',
              padding: '0 60px',
              letterSpacing: '-0.02em',
              textShadow: '0 10px 30px rgba(0,0,0,0.8)',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: 300,
              color: '#a1a1aa',
              marginTop: '32px',
              letterSpacing: '0.02em',
              textAlign: 'center',
              padding: '0 80px',
            }}
          >
            {subtitle}
          </div>

          {/* Bottom Accent Line */}
          <div
            style={{
              position: 'absolute',
              bottom: '120px',
              width: '120px',
              height: '4px',
              background: 'linear-gradient(to right, #FFD700, #FFA500)',
              boxShadow: '0 0 20px rgba(255,215,0,0.5)',
              borderRadius: '2px',
            }}
          />

          {/* Site URL Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ width: '60px', height: '1px', background: 'rgba(255,215,0,0.3)' }} />
            <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.15em' }}>
              7K-DB.COM
            </div>
            <div style={{ width: '60px', height: '1px', background: 'rgba(255,215,0,0.3)' }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e.message)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
