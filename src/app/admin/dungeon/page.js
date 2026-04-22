import { getDungeons } from '@/lib/dungeon-actions'
import DungeonManagerView from './DungeonManagerView'

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Dungeon Management | Admin',
    description: 'Manage tactical team setups and skill rotations for particle dungeons.'
}

/**
 * AdminDungeonPage - Server Component
 * Fetches the dungeon registry and set counts.
 */
export default async function AdminDungeonPage() {
    const dungeons = await getDungeons()

    return (
        <main>
            <DungeonManagerView dungeons={dungeons} />
        </main>
    )
}
