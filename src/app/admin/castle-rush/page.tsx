import { getBosses } from '@/lib/castle-rush-actions'
import CastleRushManagerView from './CastleRushManagerView'
import { requireAdmin } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Castle Rush Management | Admin',
    description: 'Configure tactical team setups and skill rotations for daily Castle Rush bosses.'
}

/**
 * AdminCastleRushPage - Server Component
 * Fetches boss registry and set counts.
 */
export default async function AdminCastleRushPage() {
    await requireAdmin('MANAGE_CASTLE_RUSH')
    const bosses = await getBosses()

    return (
        <main>
            <CastleRushManagerView bosses={bosses} />
        </main>
    )
}
