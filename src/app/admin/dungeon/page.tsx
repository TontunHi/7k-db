import { getDungeons } from '@/lib/dungeon-actions'
import DungeonManagerView from './DungeonManagerView'
import { requireAdmin } from '@/lib/auth-guard'

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
    await requireAdmin('MANAGE_DUNGEONS')
    const dungeons = await getDungeons()

    return (
        <main>
            <DungeonManagerView dungeons={dungeons} />
        </main>
    )
}
