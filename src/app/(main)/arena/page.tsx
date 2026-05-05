import { getArenaTeams } from '@/lib/arena-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { getLastUpdate } from '@/lib/log-actions'
import ArenaView from '@/components/arena/ArenaView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Arena Teams - 7Knights DB',
    description: 'Check out the best Arena teams, formations, and skill rotations.'
}

export default async function ArenaPage() {
    const [sets, heroImageMap, lastUpdated] = await Promise.all([
        getArenaTeams(),
        getHeroImageMap(),
        getLastUpdate('ARENA')
    ])
    
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
        <ArenaView 
            sets={parsedSets} 
            heroImageMap={heroImageMap} 
            lastUpdated={lastUpdated} 
        />
    )
}

