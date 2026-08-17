import PublicTierlistView from "@/components/tierlist/PublicTierlistView"

const ogUrl = `/api/og?title=${encodeURIComponent('META TIER LIST')}&badge=${encodeURIComponent('SEVEN KNIGHTS REBIRTH')}&subtitle=${encodeURIComponent('Rankings for PVE, PVP Arena, Raids & Boss Expeditions')}&theme=gold`

export const metadata = {
    title: "Tier List",
    description: "Best heroes for PVE, PVP, and Raid modes in Seven Knights Rebirth.",
    openGraph: {
        title: 'Meta Tier List — Seven Knights Rebirth | 7K-DB',
        description: 'Complete hero rankings and tier list for PVE, PVP Arena, Raids, and Total War.',
        images: [
            {
                url: ogUrl,
                width: 1200,
                height: 630,
                alt: 'Seven Knights Rebirth Tier List'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Meta Tier List — Seven Knights Rebirth | 7K-DB',
        description: 'Complete hero rankings and tier list for PVE, PVP Arena, Raids, and Total War.',
        images: [ogUrl]
    }
}

export default function TierlistPage() {
    return (
        <div className="min-h-screen">
            <PublicTierlistView />
        </div>
    )
}
