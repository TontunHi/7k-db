import { notFound } from 'next/navigation'
import { TIER_CONFIG } from '@/lib/total-war-config'
import { getSetsByTier } from '@/lib/total-war-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import TotalWarDetailView from '@/components/total-war/detail/TotalWarDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { tier: tierKey } = await params
    const tierCfg = TIER_CONFIG.find(t => t.key === tierKey)
    if (!tierCfg) return { title: 'Tier Not Found' }
    return {
        title: `Total War — ${tierCfg.label}`,
        description: `Team sets for Total War ${tierCfg.label} tier.`,
    }
}

export default async function TotalWarTierPage({ params }) {
    const { tier: tierKey } = await params
    const tierCfg = TIER_CONFIG.find(t => t.key === tierKey)

    if (!tierCfg) notFound()

    const sets = await getSetsByTier(tierKey)
    const heroImageMap = await getHeroImageMap()
    
    // Process heroes JSON if needed (though getSetsByTier might already do it)
    const parsedSets = sets.map(set => ({
        ...set,
        teams: (set.teams || []).map(team => ({
            ...team,
            heroes: typeof team.heroes_json === 'string'
                ? JSON.parse(team.heroes_json)
                : (team.heroes_json || team.heroes || []),
            skill_rotation: typeof team.skill_rotation === 'string'
                ? JSON.parse(team.skill_rotation)
                : (team.skill_rotation || [])
        }))
    }))

    return (
        <TotalWarDetailView 
            tier={tierCfg} 
            sets={parsedSets} 
            heroImageMap={heroImageMap} 
        />
    )
}

