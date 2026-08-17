import BuildView from "@/components/build/BuildView"
import ContributorPopup from "@/components/builds/ContributorPopup"
import { getHeroBuildList } from "@/lib/hero-actions"
import styles from './page.module.css'

const ogUrl = `/api/og?title=${encodeURIComponent('HERO BUILDS')}&badge=${encodeURIComponent('GEAR & STAT GUIDE')}&subtitle=${encodeURIComponent('Optimal Weapons, Armor, Substats & Accessory Sets')}&theme=gold`

export const metadata = {
    title: "Hero Builds",
    description: "Recommended builds, stats, and gear sets for Legendary and Rare heroes.",
    openGraph: {
        title: 'Hero Builds & Optimal Gear | 7K-DB',
        description: 'Comprehensive gear guides, stat recommendations, and accessory setups for all heroes.',
        images: [
            {
                url: ogUrl,
                width: 1200,
                height: 630,
                alt: 'Seven Knights Rebirth Hero Builds'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hero Builds & Optimal Gear | 7K-DB',
        description: 'Comprehensive gear guides, stat recommendations, and accessory setups for all heroes.',
        images: [ogUrl]
    }
}

export const dynamic = 'force-dynamic'

export default async function BuildPage() {
    const heroes = await getHeroBuildList()

    return (
        <main className={styles.main}>
            <BuildView heroes={heroes} />
            <ContributorPopup />
        </main>
    )
}

