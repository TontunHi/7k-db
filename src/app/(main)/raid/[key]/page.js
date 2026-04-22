import { getRaidInfo, getSetsByRaid } from '@/lib/raid-actions'
import { getHeroSkillsMap } from '@/lib/stage-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { notFound } from 'next/navigation'
import RaidDetailView from '@/components/raids/detail/RaidDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { key: raidKey } = await params
    const raid = await getRaidInfo(raidKey)
    if (!raid) return { title: 'Raid Not Found' }
    
    return {
        title: `${raid.name} - Raid Guide`,
        description: `Team recommendations and skill rotations for ${raid.name}.`
    }
}

export default async function RaidDetailPage({ params }) {
    const { key: raidKey } = await params
    const raid = await getRaidInfo(raidKey)
    
    if (!raid) {
        notFound()
    }
    
    const sets = await getSetsByRaid(raidKey)
    const heroImageMap = await getHeroImageMap()
    const skillsMap = await getHeroSkillsMap()
    
    // Parse JSON data
    const parsedSets = sets.map(set => {
        if (!set) return null
        return {
            ...set,
            heroes: typeof set.heroes_json === 'string' 
                ? JSON.parse(set.heroes_json) 
                : (set.heroes_json || set.heroes || []),
            skill_rotation: typeof set.skill_rotation === 'string'
                ? JSON.parse(set.skill_rotation)
                : (set.skill_rotation || [])
        }
    }).filter(Boolean)

    return (
        <RaidDetailView 
            raid={raid} 
            sets={parsedSets} 
            heroImageMap={heroImageMap} 
            skillsMap={skillsMap}
        />
    )
}


