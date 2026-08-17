import { getBossInfo, getSetsByBoss } from '@/lib/castle-rush-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { notFound } from 'next/navigation'
import CastleRushDetailView from '@/components/castle-rush/detail/CastleRushDetailView'

export const dynamic = 'force-dynamic'

const CR_HERO_IMAGE_MAP: Record<string, string> = {
    cr_rudy: '/heroes/l+_rudy.webp',
    cr_eileene: '/heroes/l+_eileene.webp',
    cr_rachel: '/heroes/l+_rachel.webp',
    cr_dellons: '/heroes/l+_dellons.webp',
    cr_jave: '/heroes/l+_jave.webp',
    cr_spike: '/heroes/l+_spike.webp',
    cr_kris: '/heroes/l+_kris.webp',
}

export async function generateMetadata({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    if (!boss) return { title: 'Boss Not Found' }
    
    const dayLabel = (boss as any).dayName ? ` • ${(boss as any).dayName.toUpperCase()}` : ''
    const heroImage = CR_HERO_IMAGE_MAP[bossKey] || boss.image
    const ogUrl = `/api/og?title=${encodeURIComponent(boss.name)}&badge=${encodeURIComponent(`CASTLE RUSH${dayLabel}`)}&subtitle=${encodeURIComponent('Optimal Team Comps, Formations & Speed Setup')}&theme=gold&image=${encodeURIComponent(heroImage)}`

    return {
        title: `${boss.name} - Castle Rush`,
        description: `Team recommendations for Castle Rush boss ${boss.name}.`,
        openGraph: {
            title: `${boss.name} — Castle Rush Guide | 7K-DB`,
            description: `Best Castle Rush team setups, formations, and skill priority for ${boss.name}.`,
            images: [
                {
                    url: ogUrl,
                    width: 1200,
                    height: 630,
                    alt: `${boss.name} Castle Rush Guide`
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `${boss.name} — Castle Rush Guide | 7K-DB`,
            description: `Best Castle Rush team setups, formations, and skill priority for ${boss.name}.`,
            images: [ogUrl]
        }
    }
}

export default async function CastleRushBossPage({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    
    if (!boss) {
        notFound()
    }
    
    const sets = await getSetsByBoss(bossKey)
    const heroImageMap = await getHeroImageMap()
    
    // Parse heroes JSON
    const parsedSets = sets.map(set => ({
        ...set,
        heroes: typeof set.heroes_json === 'string' 
            ? JSON.parse(set.heroes_json) 
            : (set.heroes_json || set.heroes || []),
        skill_rotation: typeof set.skill_rotation === 'string'
            ? JSON.parse(set.skill_rotation)
            : (set.skill_rotation || [])
    }))

    return (
        <CastleRushDetailView 
            boss={boss} 
            sets={parsedSets} 
            heroImageMap={heroImageMap} 
        />
    )
}

