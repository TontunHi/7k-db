import { getRaids } from '@/lib/raid-actions'
import RaidManagerView from './RaidManagerView'

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Raid Management | Admin',
    description: 'Configure tactical team setups and skill rotations for boss raids.'
}

/**
 * AdminRaidPage - Server Component
 * Fetches the raid boss registry and set counts.
 */
export default async function AdminRaidPage() {
    const raids = await getRaids()

    return (
        <main>
            <RaidManagerView raids={raids} />
        </main>
    )
}
