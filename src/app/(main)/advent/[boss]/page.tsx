import { getBossInfo, getSetsByBoss } from '@/lib/advent-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { notFound } from 'next/navigation'
import AdventDetailView from '@/components/advent/detail/AdventDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    if (!boss) return { title: 'Boss Not Found' }
    
    const ogUrl = `/api/og?title=${encodeURIComponent(boss.name)}&badge=${encodeURIComponent('ADVENT EXPEDITION')}&subtitle=${encodeURIComponent('Phase 1 & 2 Strategy, Team Formations & Skill Rotations')}&theme=gold&image=${encodeURIComponent(boss.image)}`

    return {
        title: `${boss.name} - Advent Expedition`,
        description: `Team recommendations and strategies for Advent Expedition boss ${boss.name}.`,
        openGraph: {
            title: `${boss.name} — Advent Expedition Guide | 7K-DB`,
            description: `Best team lineups, formations, and skill priority for ${boss.name}.`,
            images: [
                {
                    url: ogUrl,
                    width: 1200,
                    height: 630,
                    alt: `${boss.name} Advent Expedition Guide`
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `${boss.name} — Advent Expedition Guide | 7K-DB`,
            description: `Best team lineups, formations, and skill priority for ${boss.name}.`,
            images: [ogUrl]
        }
    }
}

export default async function AdventBossPage({ params }) {
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
            : (set.skill_rotation || []),
        hero_builds: typeof set.hero_builds_json === 'string'
            ? JSON.parse(set.hero_builds_json)
            : (set.hero_builds_json || set.hero_builds || {})
    }))

    return (
        <AdventDetailView 
            boss={boss} 
            sets={parsedSets} 
            heroImageMap={heroImageMap} 
        />
    )
}

