import { getDungeonInfo, getSetsByDungeon } from '@/lib/dungeon-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { notFound } from 'next/navigation'
import DungeonDetailView from '@/components/dungeons/detail/DungeonDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { key: dungeonKey } = await params
    const dungeon = await getDungeonInfo(dungeonKey)
    if (!dungeon) return { title: 'Dungeon Not Found' }
    
    return {
        title: `${dungeon.name} - Dungeon Guides`,
        description: `Team recommendations for ${dungeon.name}.`
    }
}

export default async function DungeonDetailPage({ params }) {
    const { key: dungeonKey } = await params
    const dungeon = await getDungeonInfo(dungeonKey)
    
    if (!dungeon) {
        notFound()
    }
    
    const sets = await getSetsByDungeon(dungeonKey)
    const heroImageMap = await getHeroImageMap()
    
    // Parse heroes JSON
    const parsedSets = sets.map(set => ({
        ...set,
        heroes: typeof set.heroes_json === 'string' 
            ? JSON.parse(set.heroes_json) 
            : (set.heroes_json || set.heroes || [])
    }))

    return (
        <DungeonDetailView 
            dungeon={dungeon} 
            sets={parsedSets} 
            heroImageMap={heroImageMap} 
        />
    )
}

