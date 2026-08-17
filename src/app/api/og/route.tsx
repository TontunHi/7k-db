import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Dynamic params
    const title = searchParams.get('title')?.slice(0, 80) || 'SEVEN KNIGHTS REBIRTH'
    const badge = searchParams.get('badge')?.slice(0, 50) || 'STRATEGY DATABASE'
    const subtitle = searchParams.get('subtitle')?.slice(0, 120) || 'The ultimate database for hero builds, tier lists, and boss guides.'
    const theme = searchParams.get('theme') || 'gold'
    const imageParam = searchParams.get('image')

    // Theme color presets
    let primaryColor = '#FFD700'
    let secondaryColor = '#FFA500'
    let glowColor = 'rgba(255, 215, 0, 0.22)'
    let badgeBg = 'rgba(255, 215, 0, 0.15)'
    let badgeBorder = 'rgba(255, 215, 0, 0.45)'
    let badgeText = '#FFD700'

    if (theme === 'cyan' || theme === 'blue') {
      primaryColor = '#00F2FE'
      secondaryColor = '#3B82F6'
      glowColor = 'rgba(0, 242, 254, 0.25)'
      badgeBg = 'rgba(0, 242, 254, 0.15)'
      badgeBorder = 'rgba(0, 242, 254, 0.45)'
      badgeText = '#00F2FE'
    } else if (theme === 'red' || theme === 'crimson') {
      primaryColor = '#FF4B2B'
      secondaryColor = '#FF416C'
      glowColor = 'rgba(255, 75, 43, 0.25)'
      badgeBg = 'rgba(255, 75, 43, 0.15)'
      badgeBorder = 'rgba(255, 75, 43, 0.45)'
      badgeText = '#FF6B4A'
    } else if (theme === 'purple') {
      primaryColor = '#A855F7'
      secondaryColor = '#EC4899'
      glowColor = 'rgba(168, 85, 247, 0.25)'
      badgeBg = 'rgba(168, 85, 247, 0.15)'
      badgeBorder = 'rgba(168, 85, 247, 0.45)'
      badgeText = '#C084FC'
    }

    // Load local image converted to PNG using sharp for Satori compatibility
    let base64Image: string | null = null
    let isWideBanner = false

    if (imageParam) {
      try {
        const cleanPath = imageParam.startsWith('/') ? imageParam.slice(1) : imageParam
        const fullPath = path.join(process.cwd(), 'public', cleanPath)
        if (fs.existsSync(fullPath)) {
          isWideBanner = cleanPath.includes('castle_rush') || cleanPath.includes('raid')
          const targetWidth = isWideBanner ? 700 : 450
          const pngBuffer = await sharp(fullPath)
            .resize({ width: targetWidth, withoutEnlargement: true })
            .png({ quality: 85 })
            .toBuffer()
          base64Image = `data:image/png;base64,${pngBuffer.toString('base64')}`
        }
      } catch (err) {
        console.warn('Could not load local OG image:', err)
      }
    }

    // SCENARIO 1: Character / Boss Artwork Showcase Layout
    if (base64Image) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#05070D',
              backgroundImage: `radial-gradient(circle at 10% 20%, ${glowColor} 0%, transparent 60%), radial-gradient(circle at 90% 80%, ${glowColor} 0%, transparent 60%)`,
              position: 'relative',
              padding: '50px 60px',
              fontFamily: 'sans-serif',
              gap: '45px',
            }}
          >
            {/* Left Content Column */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 10,
              }}
            >
              {/* Top Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      padding: '8px 20px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      color: '#000000',
                      fontSize: '20px',
                      fontWeight: 900,
                      letterSpacing: '0.1em',
                    }}
                  >
                    7K-DB
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', opacity: 0.85 }}>
                    SEVEN KNIGHTS REBIRTH
                  </div>
                </div>

                <div
                  style={{
                    padding: '6px 18px',
                    borderRadius: '999px',
                    background: badgeBg,
                    border: `1.5px solid ${badgeBorder}`,
                    color: badgeText,
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {badge}
                </div>
              </div>

              {/* Center Main Text */}
              <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto 0' }}>
                <div
                  style={{
                    fontSize: title.length > 20 ? '56px' : '72px',
                    fontStyle: 'italic',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    textShadow: '0 8px 30px rgba(0,0,0,0.95)',
                    marginBottom: '16px',
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    fontSize: '23px',
                    color: '#CBD5E1',
                    lineHeight: 1.4,
                    fontWeight: 400,
                    maxWidth: '580px',
                  }}
                >
                  {subtitle}
                </div>
              </div>

              {/* Bottom Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>
                  TACTICAL LINEUPS • FORMATIONS • SKILL ROTATIONS
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: primaryColor, letterSpacing: '0.1em' }}>
                  7K-DB.COM
                </div>
              </div>
            </div>

            {/* Right Column: Character / Boss Artwork Frame */}
            <div
              style={{
                width: '420px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Outer Glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: '5px',
                  borderRadius: '24px',
                  background: glowColor,
                  filter: 'blur(30px)',
                }}
              />

              {/* Image Frame */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: `2px solid ${badgeBorder}`,
                  background: '#09090B',
                  display: 'flex',
                  position: 'relative',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                }}
              >
                <img
                  src={base64Image}
                  alt={title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: isWideBanner ? 'right center' : 'center top',
                  }}
                />

                {/* Bottom Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
                  }}
                />
              </div>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      )
    }

    // SCENARIO 3: Default Layout (No image provided)
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#05070D',
            backgroundImage: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 60%), radial-gradient(circle at 50% 120%, ${glowColor} 0%, #05070D 70%)`,
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '8px 22px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: '#000000',
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                }}
              >
                7K-DB
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', opacity: 0.85 }}>
                SEVEN KNIGHTS REBIRTH
              </div>
            </div>

            <div
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                background: badgeBg,
                border: `1.5px solid ${badgeBorder}`,
                color: badgeText,
                fontSize: '16px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </div>
          </div>

          {/* Center Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
              maxWidth: '1050px',
              margin: 'auto 0',
            }}
          >
            <div
              style={{
                fontSize: title.length > 25 ? '64px' : '82px',
                fontStyle: 'italic',
                fontWeight: 900,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                textShadow: '0 8px 30px rgba(0,0,0,0.9)',
                marginBottom: '20px',
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: 400,
                color: '#CBD5E1',
                textAlign: 'center',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>
              TACTICAL LINEUPS • FORMATIONS • SKILL ROTATIONS
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900, color: primaryColor, letterSpacing: '0.1em' }}>
              7K-DB.COM
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error(e.message)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
