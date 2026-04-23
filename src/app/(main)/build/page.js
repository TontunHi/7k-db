import BuildView from "@/components/build/BuildView"
import ContributorPopup from "@/components/builds/ContributorPopup"
import { getHeroBuildList } from "@/lib/hero-actions"
import styles from './page.module.css'

export const metadata = {
    title: "Hero Builds",
    description: "Recommended builds for Legendary and Rare heroes.",
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

