import { getAllHeroesForTierlist } from "@/lib/tierlist-db"
import TierlistManagerView from "@/components/admin/tierlist/TierlistManagerView"

export const metadata = {
    title: "Tier List Management | Admin",
    description: "Assign heroes to tactical ranks and roles across different game modes."
}

/**
 * TierlistPage - Server Component
 * Fetches the base hero registry for the tierlist management tool.
 */
export default async function TierlistPage() {
    const heroes = await getAllHeroesForTierlist()

    return (
        <main>
            <TierlistManagerView heroes={heroes} />
        </main>
    )
}
