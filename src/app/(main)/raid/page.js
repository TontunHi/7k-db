import { getRaids } from '@/lib/raid-actions'
import RaidView from '@/components/raids/RaidView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Raids",
    description: "Raid guides, team recommendations and skill rotations for Seven Knights 2 Rebirth."
}

export default async function RaidPage() {
    const raids = await getRaids()

    return <RaidView raids={raids} />
}

