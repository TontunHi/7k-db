import { getBossInfo, getSetsByBoss } from '@/lib/advent-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { notFound } from 'next/navigation'
import AdventDetailView from '@/components/advent/detail/AdventDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    if (!boss) return { title: 'Boss Not Found' }
    
    return {
        title: `${boss.name} - Advent Expedition`,
        description: `Team recommendations for Advent Expedition boss ${boss.name}.`
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

