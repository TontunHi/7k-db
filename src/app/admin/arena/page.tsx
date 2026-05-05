import { getArenaTeams } from '@/lib/arena-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import ArenaManagerView from './ArenaManagerView'

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Arena Squad Management | Admin',
    description: 'Configure elite arena squads, formations, and tactical skill rotations.'
}

/**
 * AdminArenaPage - Server Component
 * Orchestrates data fetching for the Arena management dashboard.
 */
export default async function AdminArenaPage() {
    const [teamsData, heroesData, petsData, formationsData, skillsData] = await Promise.all([
        getArenaTeams(),
        getAllHeroes(),
        getPets(),
        getFormations(),
        getHeroSkillsMap()
    ])

    const assets = {
        heroes: heroesData,
        pets: petsData,
        formations: formationsData,
        skills: skillsData
    }

    return (
        <main className="py-8">
            <ArenaManagerView 
                initialTeams={teamsData} 
                assets={assets} 
            />
        </main>
    )
}
