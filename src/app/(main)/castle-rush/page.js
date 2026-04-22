import { getBosses } from '@/lib/castle-rush-actions'
import CastleRushView from '@/components/castle-rush/CastleRushView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Castle Rush",
    description: "Daily Castle Rush boss team recommendations and strategies."
}

export default async function CastleRushPage() {
    const bosses = await getBosses()

    return <CastleRushView bosses={bosses} />
}

