import { getAllSetCounts } from '@/lib/total-war-actions'
import TotalWarManagerView from './TotalWarManagerView'

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Total War Management | Admin',
    description: 'Configure tactical multi-team strategies across all difficulty tiers of Total War.'
}

/**
 * AdminTotalWarPage - Server Component
 * Fetches tier statistics and renders the dashboard.
 */
export default async function AdminTotalWarPage() {
    const setCounts = await getAllSetCounts()

    return (
        <main>
            <TotalWarManagerView setCounts={setCounts} />
        </main>
    )
}
