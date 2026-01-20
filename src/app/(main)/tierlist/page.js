import PublicTierlistView from "@/components/tierlist/PublicTierlistView"

export const metadata = {
    title: "Start Rail - Tier List",
    description: "Best heroes for PVE, PVP, and Raid modes."
}

export default function TierlistPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <PublicTierlistView />
        </div>
    )
}
