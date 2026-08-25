import HeroSection from '@/components/home/HeroSection'
import FeaturesGridPremium from '@/components/home/FeaturesGridPremium'
import BackgroundEffects from '@/components/home/BackgroundEffects'
import DailyBossHub from '@/components/home/DailyBossHub'
import MetaSnapshot from '@/components/home/MetaSnapshot'
import { getTodayCastleRushBoss } from '@/lib/castle-rush-actions'
import { getActiveRaids } from '@/lib/raid-actions'
import { getArenaTeams } from '@/lib/arena-actions'
import { getAdventBossesWithPrimarySet } from '@/lib/advent-actions'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { getLocale, getTranslations } from "@/lib/i18n"
import styles from './page.module.css'

import UpdateAnnouncementModal from '@/components/home/UpdateAnnouncementModal'

export const revalidate = 60;

export const metadata = {
    title: 'Home',
    description: 'Welcome to the ultimate Seven Knights Rebirth database. Find hero builds, tier lists, and complete stage guides.',
};

export default async function HomePage() {
    const lang = await getLocale()
    const [translations, todayCastleRush, activeRaids, rawArenaTeams, adventBosses, heroImageMap] = await Promise.all([
        getTranslations(lang),
        getTodayCastleRushBoss(),
        getActiveRaids(),
        getArenaTeams(),
        getAdventBossesWithPrimarySet(),
        getHeroImageMap(),
    ])

    // Parse arena teams heroes JSON
    const arenaTeams = rawArenaTeams.map(t => ({
        id: t.id,
        team_name: t.team_name,
        formation: t.formation,
        heroes: typeof t.heroes_json === 'string'
            ? JSON.parse(t.heroes_json)
            : (t.heroes_json || t.heroes || []),
        pet_file: t.pet_file,
    }))

    return (
        <div className={styles.page}>
            {/* Daily Update Announcement Popup (Once per day) */}
            <UpdateAnnouncementModal />

            {/* Background Layer */}
            <BackgroundEffects />

            <div className={styles.container}>
                {/* Hero Header */}
                <HeroSection />

                <div className={styles.contentWrapper}>
                    {/* Daily Boss & Active Encounters Tracker */}
                    <DailyBossHub castleRush={todayCastleRush} activeRaids={activeRaids} />

                    {/* Meta Snapshot: PVP Arena & Advent Expedition */}
                    <MetaSnapshot
                        arenaTeams={arenaTeams}
                        adventBosses={adventBosses}
                        heroImageMap={heroImageMap}
                    />

                    {/* Features Navigation */}
                    <FeaturesGridPremium translations={translations} />
                </div>
            </div>
        </div>
    )
}
