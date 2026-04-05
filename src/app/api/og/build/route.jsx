import { ImageResponse } from 'next/og'
import { getHeroBuilds, getHeroData } from '@/lib/build-db'

export const runtime = 'nodejs'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        let hero = searchParams.get('hero') || ""
        const bid = parseInt(searchParams.get('bid') || '0', 10)

        if (!hero) {
            return new Response('Missing hero parameter', { status: 400 })
        }

        // Handle cases where '+' might be converted to a space ' '
        hero = hero.replace(/ /g, "+")

        // Try to fetch data, but don't crash if it fails
        let builds = []
        let heroData = null
        let dbError = null

        try {
            const [b, h] = await Promise.all([
                getHeroBuilds(hero),
                getHeroData(hero)
            ])
            builds = b || []
            heroData = h
        } catch (e) {
            console.error("OG DB Error:", e)
            dbError = e.message
        }

        const build = builds[bid] || builds[0]
        const origin = new URL(request.url).origin
        const heroImageUrl = `${origin}/heroes/${hero}.webp`
        const heroName = heroData?.name || hero.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/_/g, " ").toUpperCase()

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
                            <h1 style={{ 
                                marginTop: '24px', 
                                fontSize: '42px', 
                                fontWeight: '900', 
                                textTransform: 'uppercase',
                                color: '#FFD700',
                            }}>
                                {heroName}
                            </h1>
                        </div>

                        {/* Build Details Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '60%', justifyContent: 'center' }}>
                            {dbError ? (
                                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 0, 0, 0.3)' }}>
                                    <span style={{ color: '#ff4444', fontSize: '24px', fontWeight: 'bold' }}>Database Connection Error</span>
                                    <span style={{ color: '#888', fontSize: '16px', marginTop: '10px' }}>{dbError}</span>
                                    <span style={{ color: '#aaa', fontSize: '18px', marginTop: '20px' }}>Please visit the site to view build details.</span>
                                </div>
                            ) : !build ? (
                                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 215, 0, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                                    <span style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>No builds found for this hero</span>
                                    <span style={{ color: '#888', fontSize: '18px', marginTop: '10px' }}>Create one at 7K DB!</span>
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
                        <span style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', color: 'white' }}>7K <span style={{ color: '#FFD700' }}>DB</span></span>
                    </div>
                </div>
            )
        )
    } catch (e) {
        console.error("OG Root Critical Error:", e)
        return new Response(`OG Generator Error: ${e.message}`, { status: 500 })
    }
}
