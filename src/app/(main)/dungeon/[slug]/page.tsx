import { getDungeonInfo, getSetsByDungeon } from '@/lib/dungeon-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { notFound } from 'next/navigation'
import DungeonDetailView from '@/components/dungeons/detail/DungeonDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const dungeon = await getDungeonInfo(slug)
    if (!dungeon) return { title: 'Dungeon Not Found' }
    
    return {
        title: `${dungeon.name} - Dungeon Guides`,
        description: `Team recommendations for ${dungeon.name}.`
    }
}

export default async function DungeonDetailPage({ params }) {
    const { slug } = await params
    const dungeon = await getDungeonInfo(slug)
    
    if (!dungeon) {
        notFound()
    }
    
    const sets = await getSetsByDungeon(slug)
    const heroImageMap = await getHeroImageMap()
    
    return (
        <DungeonDetailView 
            dungeon={dungeon} 
            sets={sets} 
            heroImageMap={heroImageMap} 
        />
    )
}

