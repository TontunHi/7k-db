import { Suspense } from 'react'
import FeatureCard from '@/components/shared/FeatureCard'
import GlobalCredits from '@/components/shared/GlobalCredits'
import RecentUpdates from '@/components/shared/RecentUpdates'
import { Zap } from 'lucide-react'
import styles from './FeaturesGrid.module.css'

const ALL_FEATURES = [
    { title: "Hero Builds", description: "Stat & Gear recommendations for every hero", iconName: "Sword", href: "/build" },
    { title: "Meta Tier List", description: "See dominating heroes", iconName: "Trophy", href: "/tierlist" },
    // { title: "Stage Guides", description: "Detailed walkthroughs", iconName: "Map", href: "/stages" },
    { title: "Dungeons", description: "Team comps for all difficulties", iconName: "Landmark", href: "/dungeon" },
    { title: "Raid", description: "Boss mechanics & strategies", iconName: "Skull", href: "/raid" },
    { title: "Advent", description: "Advent Expedition guides", iconName: "Compass", href: "/advent" },
    { title: "Arena", description: "Top PVP teams", iconName: "Swords", href: "/arena" },
    { title: "Total War", description: "Total War formations", iconName: "Trophy", href: "/total-war" },
    { title: "Guild War", description: "Guild War teams", iconName: "Skull", href: "/guild-war" },
    { title: "Castle Rush", description: "Castle Rush lineups", iconName: "Crown", href: "/castle-rush" },
    { title: "Build Simulator", description: "Simulate your own hero builds", iconName: "Wand2", href: "/tools/build-simulator" },
    { title: "Hero Stats", description: "Look up base stats", iconName: "Sparkles", href: "/tools/hero-stats" },
    { title: "Tier Maker", description: "Create your own tier list", iconName: "Zap", href: "/tools/tierlist-maker" },
]

export default function FeaturesGrid() {
    return (
        <section className={styles.gridContainer}>
            
            <div className={styles.equalGrid}>
                {ALL_FEATURES.map((feature) => (
                    <FeatureCard 
                        key={feature.title} 
                        title={feature.title} 
                        iconName={feature.iconName} 
                        href={feature.href} 
                        size="default" 
                    />
                ))}
            </div>

            {/* BOTTOM SECTION: UPDATES & CREDITS */}
            <div className={styles.bottomSection}>
                {/* RECENT UPDATES */}
                <div className={styles.updatesSection}>
                    <div className={styles.updatesContent}>
                        <Suspense fallback={<div className={styles.skeleton} />}>
                            <RecentUpdates />
                        </Suspense>
                    </div>
                </div>

                <div className={styles.creditsWrapper}>
                    <GlobalCredits />
                </div>
            </div>
        </section>
    )
}
