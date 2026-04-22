import FeatureCard from '@/components/shared/FeatureCard'
import GlobalCredits from '@/components/shared/GlobalCredits'
import styles from './FeaturesGrid.module.css'

const FEATURES = [
    { title: "Hero Builds", description: "Curated builds for every hero — stats, equipment & skill recommendations", iconName: "Sword", href: "/build", color: "from-blue-500 to-cyan-500", glow: "hover:shadow-blue-500/20" },
    { title: "Tier List", description: "See which heroes dominate the meta and rank up your roster", iconName: "Trophy", href: "/tierlist", color: "from-purple-500 to-indigo-500", glow: "hover:shadow-purple-500/20" },
    { title: "Stage Guide", description: "Detailed stage walkthroughs from Chapter 1 to the latest content", iconName: "Map", href: "/stages", color: "from-[#FFD700] to-orange-500", glow: "hover:shadow-[#FFD700]/20" },
    { title: "Dungeons", description: "Team comps and strategies for all dungeon difficulties", iconName: "Landmark", href: "/dungeon", color: "from-emerald-500 to-green-600", glow: "hover:shadow-emerald-500/20" },
    { title: "Raid Strategy", description: "Boss mechanics, phase guides, and best raid team setups", iconName: "Skull", href: "/raid", color: "from-red-500 to-rose-600", glow: "hover:shadow-red-500/20" },
    { title: "Castle Rush", description: "Optimal lineups and timing strategies for Castle Rush stages", iconName: "Crown", href: "/castle-rush", color: "from-amber-500 to-yellow-600", glow: "hover:shadow-amber-500/20" },
    { title: "Advent Expedition", description: "Phase 1 & 2 team strategies for every Advent Expedition boss", iconName: "Compass", href: "/advent/ae_god_of_destruction", color: "from-violet-500 to-purple-600", glow: "hover:shadow-violet-500/20" },
    { title: "Arena PVP", description: "Top Arena and Celestial PVP teams to climb the ranks", iconName: "Swords", href: "/arena", color: "from-rose-500 to-red-600", glow: "hover:shadow-rose-500/20" },
    { title: "Total War", description: "Guild-wide Total War formation guides and counter strategies", iconName: "Trophy", href: "/total-war", color: "from-orange-500 to-pink-500", glow: "hover:shadow-orange-500/20" },
    { title: "Guild War", description: "Guild War attack and defense team recommendations", iconName: "Skull", href: "/guild-war", color: "from-blue-600 to-indigo-700", glow: "hover:shadow-blue-600/20" },
    { title: "Build Heroes", description: "Simulate your own hero builds with full stat calculations", iconName: "Wand2", href: "/tools/build-simulator", color: "from-[#FFD700] via-amber-500 to-orange-600", glow: "hover:shadow-[#FFD700]/40" },
    { title: "Hero Stats", description: "Look up base stats, scaling, and growth values for every hero", iconName: "Sparkles", href: "/tools/hero-stats", color: "from-cyan-500 to-blue-600", glow: "hover:shadow-cyan-500/20" },
    { title: "Tier List Maker", description: "Create and share your own custom hero tier list", iconName: "Zap", href: "/tools/tierlist-maker", color: "from-fuchsia-500 to-pink-600", glow: "hover:shadow-fuchsia-500/20" },
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
