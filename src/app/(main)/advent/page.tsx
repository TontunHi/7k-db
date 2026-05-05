import { getBosses } from '@/lib/advent-actions'
import AdventView from '@/components/advent/AdventView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Advent Expedition",
    description: "Advent Expedition boss team recommendations and strategies."
}

export default async function AdventExpeditionPage() {
    const bosses = await getBosses()

    return <AdventView bosses={bosses} />
}

