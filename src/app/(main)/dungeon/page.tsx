import { getDungeons } from '@/lib/dungeon-actions'
import DungeonView from '@/components/dungeons/DungeonView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Dungeons",
    description: "Dungeon guides and team recommendations for Seven Knights 2 Rebirth."
}

export default async function DungeonPage() {
    const dungeons = await getDungeons()

    return <DungeonView dungeons={dungeons} />
}

