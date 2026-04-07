import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Dynamic title from query params (e.g., ?title=Teo Build)
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Seven Knights Rebirth Database'

    const subtitle = hasTitle
      ? 'Seven Knights Rebirth Database'
      : 'Builds, Guides, Tier Lists & Tools'

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
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #050505 100%)',
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(79, 70, 229, 0.1)',
              filter: 'blur(100px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.1)',
              filter: 'blur(100px)',
            }}
          />

          {/* Logo / Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              marginBottom: '40px',
              boxShadow: '0 0 40px rgba(79, 70, 229, 0.4)',
              color: 'white',
              fontSize: '40px',
              fontWeight: 900,
            }}
          >
            7K
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontStyle: 'normal',
              fontWeight: 900,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              whiteSpace: 'pre-wrap',
              padding: '0 80px',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: 400,
              color: '#94a3b8',
              marginTop: '24px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </div>

          {/* Site URL Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em' }}>
              7K-DB.COM
            </div>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
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
