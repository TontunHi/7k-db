import TierlistManager from "@/components/admin/TierlistManager"
import { getAllHeroesForTierlist } from "@/lib/tierlist-db"

export default async function TierlistPage() {
    const heroes = await getAllHeroesForTierlist()

    return (
        <div>
            <TierlistManager heroes={heroes} />
        </div>
    )
}
