import FeatureCard from '@/components/shared/FeatureCard'
import GlobalCredits from '@/components/shared/GlobalCredits'
import styles from './FeaturesGrid.module.css'

const FEATURES = [
    { title: "Hero Builds", description: "Curated builds for every hero — stats, equipment & skill recommendations", iconName: "Sword", href: "/build" },
    { title: "Tier List", description: "See which heroes dominate the meta and rank up your roster", iconName: "Trophy", href: "/tierlist" },
    { title: "Stage Guide", description: "Detailed stage walkthroughs from Chapter 1 to the latest content", iconName: "Map", href: "/stages" },
    { title: "Dungeons", description: "Team comps and strategies for all dungeon difficulties", iconName: "Landmark", href: "/dungeon" },
    { title: "Raid Strategy", description: "Boss mechanics, phase guides, and best raid team setups", iconName: "Skull", href: "/raid" },
    { title: "Castle Rush", description: "Optimal lineups and timing strategies for Castle Rush stages", iconName: "Crown", href: "/castle-rush" },
    { title: "Advent Expedition", description: "Phase 1 & 2 team strategies for every Advent Expedition boss", iconName: "Compass", href: "/advent/ae_god_of_destruction" },
    { title: "Arena PVP", description: "Top Arena and Celestial PVP teams to climb the ranks", iconName: "Swords", href: "/arena" },
    { title: "Total War", description: "Guild-wide Total War formation guides and counter strategies", iconName: "Trophy", href: "/total-war" },
    { title: "Guild War", description: "Guild War attack and defense team recommendations", iconName: "Skull", href: "/guild-war" },
    { title: "Build Heroes", description: "Simulate your own hero builds with full stat calculations", iconName: "Wand2", href: "/tools/build-simulator" },
    { title: "Hero Stats", description: "Look up base stats, scaling, and growth values for every hero", iconName: "Sparkles", href: "/tools/hero-stats" },
    { title: "Tier List Maker", description: "Create and share your own custom hero tier list", iconName: "Zap", href: "/tools/tierlist-maker" },
]

export default function FeaturesGrid() {
    return (
        <section className={styles.gridContainer}>
            <div className={styles.grid}>
                {FEATURES.map((feature) => (
                    <FeatureCard key={feature.title} {...feature} />
                ))}
            </div>

            <div className={styles.creditsWrapper}>
                <GlobalCredits />
            </div>
        </section>
    )
}
