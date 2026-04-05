import { ImageResponse } from 'next/og'
import { getHeroBuilds, getHeroData } from '@/lib/build-db'

export const runtime = 'nodejs'
// Prevent caching to help debugging
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
    const origin = new URL(request.url).origin
    
    try {
        const { searchParams } = new URL(request.url)
        let hero = searchParams.get('hero') || ""
        const bid = parseInt(searchParams.get('bid') || '0', 10)

        if (!hero) {
            return new Response('Missing hero parameter', { status: 400 })
        }

        // Handle cases where '+' might be converted to a space ' '
        hero = hero.replace(/ /g, "+")

        // Try to fetch data
        let builds = []
        let heroData = null
        let dbStatus = "OK"

        try {
            // Check if DB credentials are even there
            if (!process.env.DB_HOST) {
                throw new Error("DB_HOST environment variable is missing on Vercel")
            }

            const [b, h] = await Promise.all([
                getHeroBuilds(hero).catch(e => { throw e }),
                getHeroData(hero).catch(e => { throw e })
            ])
            builds = b || []
            heroData = h
        } catch (e) {
            console.error("OG DB Error:", e)
            dbStatus = `ERROR: ${e.message}`
        }

        const build = builds[bid] || builds[0]
        const heroImageUrl = `${origin}/heroes/${hero}.webp`
        const heroName = (heroData?.name || hero.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/_/g, " ")).toUpperCase()

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
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)',
                        color: 'white',
                        padding: '40px',
                        position: 'relative'
                    }}
                >
                    {/* Background Grid Accent */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }} />

                    <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', zIndex: 1, alignItems: 'center' }}>
                        {/* Portrait Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '35%', marginRight: '40px' }}>
                            <div style={{ 
                                position: 'relative',
                                width: '320px',
                                height: '400px',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                border: '4px solid #FFD700',
                                boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
                                display: 'flex',
                                backgroundColor: '#111'
                            }}>
                                <img
                                    src={heroImageUrl}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <div style={{ 
                                marginTop: '24px', 
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#FFD700' }}>{heroName}</span>
                                <span style={{ fontSize: '18px', color: '#888', marginTop: '5px' }}>7K DB HERO BUILD</span>
                            </div>
                        </div>

                        {/* Build Details Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '60%', justifyContent: 'center' }}>
                            {dbStatus !== "OK" ? (
                                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
                                    <span style={{ color: '#ff4444', fontSize: '24px', fontWeight: 'bold' }}>Database Error</span>
                                    <span style={{ color: '#888', fontSize: '14px', marginTop: '10px' }}>{dbStatus}</span>
                                    <span style={{ color: '#aaa', fontSize: '16px', marginTop: '20px' }}>Please ensure DB environment variables are set on Vercel.</span>
                                </div>
                            ) : !build ? (
                                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 215, 0, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.1)' }}>
                                    <span style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>No Builds Available</span>
                                    <span style={{ color: '#888', fontSize: '18px', marginTop: '10px' }}>Create build for {heroName} now!</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    {/* Category: Equipment */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                            <div style={{ width: '12px', height: '12px', backgroundColor: '#FFD700', transform: 'rotate(45deg)', marginRight: '15px' }} />
                                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#888', letterSpacing: '4px' }}>EQUIPMENT</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {[...build.weapons, ...build.armors].map((item, i) => (
                                                <div key={i} style={{ 
                                                    width: '90px', 
                                                    height: '90px', 
                                                    backgroundColor: '#111', 
                                                    borderRadius: '12px', 
                                                    border: '1px solid #333',
                                                    display: 'flex',
                                                    overflow: 'hidden'
                                                }}>
                                                    {item.image && (
                                                        <img 
                                                            src={`${origin}/items/${i < 2 ? 'weapon' : 'armor'}/${item.image}`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Category: Accessory */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                            <div style={{ width: '12px', height: '12px', backgroundColor: '#FFD700', transform: 'rotate(45deg)', marginRight: '15px' }} />
                                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#888', letterSpacing: '4px' }}>ACCESSORY & REFINING</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {build.accessories.map((acc, i) => (
                                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ 
                                                        width: '80px', 
                                                        height: '80px', 
                                                        backgroundColor: '#111', 
                                                        borderRadius: '12px', 
                                                        border: '1px solid #333',
                                                        display: 'flex',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {acc.image && (
                                                            <img 
                                                                src={`${origin}/items/accessory/${acc.image}`}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    {acc.refined && (
                                                        <div style={{ 
                                                            width: '60px', 
                                                            height: '60px', 
                                                            backgroundColor: '#0a0a0a', 
                                                            borderRadius: '8px', 
                                                            border: '1px solid #555',
                                                            display: 'flex',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <img 
                                                                src={`${origin}/items/accessory/${acc.refined}`}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / Brand */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '40px',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', fontStyle: 'italic', color: 'white' }}>7K <span style={{ color: '#FFD700' }}>DB</span></span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e) {
        console.error("CRITICAL OG ERROR:", e)
        return new ImageResponse(
            (
                <div style={{ height: '100%', width: '100%', display: 'flex', backgroundColor: '#050505', color: 'white', padding: '40px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '40px', color: '#ff4444' }}>7K DB System Error</h1>
                    <p style={{ fontSize: '20px', color: '#888' }}>{e.message}</p>
                </div>
            ),
            { width: 1200, height: 630 }
        )
    }
}
