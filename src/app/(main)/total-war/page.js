import { getAllSetCounts } from '@/lib/total-war-actions'
import TotalWarView from '@/components/total-war/TotalWarView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Total War - 7Knights DB',
    description: 'Total War tier team recommendations — Legendary, Superb, Elite, and Normal tier team compositions with skill rotations.',
}

export default async function TotalWarPage() {
    const setCounts = await getAllSetCounts()

    return <TotalWarView setCounts={setCounts} />
}

