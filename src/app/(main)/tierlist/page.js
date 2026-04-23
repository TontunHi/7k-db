import PublicTierlistView from "@/components/tierlist/PublicTierlistView"

export const metadata = {
    title: "Tier List",
    description: "Best heroes for PVE, PVP, and Raid modes."
}

export default function TierlistPage() {
    return (
        <div className="min-h-screen">
            <PublicTierlistView />
        </div>
    )
}
