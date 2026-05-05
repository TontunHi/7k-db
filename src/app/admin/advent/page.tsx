import { getBosses } from '@/lib/advent-actions'
import AdventManagerView from './AdventManagerView'

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Advent Expedition Management | Admin',
    description: 'Configure tactical team strategies and phase-specific rotations for Advent Expedition bosses.'
}

/**
 * AdminAdventPage - Server Component
 * Fetches advent boss registry and set counts.
 */
export default async function AdminAdventPage() {
    const bosses = await getBosses()

    return (
        <main>
            <AdventManagerView bosses={bosses} />
        </main>
    )
}
