import { getRaids, getActiveRaidBossKeys } from '@/lib/raid-actions'
import RaidManagerView from './RaidManagerView'
import { requireAdmin } from '@/lib/auth-guard'

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
    await requireAdmin('MANAGE_RAIDS')
    const [raids, activeKeys] = await Promise.all([
        getRaids(),
        getActiveRaidBossKeys()
    ])

    return (
        <main>
            <RaidManagerView raids={raids} initialActiveKeys={activeKeys} />
        </main>
    )
}
