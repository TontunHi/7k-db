import React, { Suspense } from 'react'
import styles from './FeaturesGridPremium.module.css'
import Link from 'next/link'
import RecentUpdates from '@/components/shared/RecentUpdates'
import GlobalCredits from '@/components/shared/GlobalCredits'

const ALL_FEATURES = [
    { title: "Hero Builds", description: "Stat & Gear recommendations", color: "#FFD700", href: "/build", id: "01" },
    { title: "Meta Tier List", description: "See Tier List of heroes", color: "#C0C0C0", href: "/tierlist", id: "02" },
    { title: "Dungeons", description: "Team comps for all difficulties", color: "#A18CD1", href: "/dungeon", id: "03" },
    { title: "Raids", description: "Boss mechanics & strategies", color: "#FF4B2B", href: "/raid", id: "04" },
    { title: "Advent Expedition", description: "Advent Expedition guides", color: "#4FACFE", href: "/advent", id: "05" },
    { title: "Arena", description: "Top PVP teams", color: "#00F2FE", href: "/arena", id: "06" },
    { title: "Total War", description: "Total War formations", color: "#F093FB", href: "/total-war", id: "07" },
    { title: "Guild War", description: "Guild War teams", color: "#FF9A9E", href: "/guild-war", id: "08" },
    { title: "Castle Rush", description: "Castle Rush lineups", color: "#FAD0C4", href: "/castle-rush", id: "09" },
    { title: "Build Simulator", description: "Simulate your own hero builds", color: "#667EEA", href: "/tools/build-simulator", id: "10" },
    { title: "Hero Stats", description: "Look up base stats", color: "#F6D365", href: "/tools/hero-stats", id: "11" },
    { title: "Tier Maker", description: "Create your own tier list", color: "#84FAB0", href: "/tools/tierlist-maker", id: "12" },
]

export default function FeaturesGridPremium() {
    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                {ALL_FEATURES.map((feature) => (
                    <Link key={feature.title} href={feature.href} className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.titleWrapper}>
                                <div className={styles.dot} style={{ backgroundColor: feature.color }} />
                                <h3 className={styles.title} style={{ '--accent': feature.color }}>
                                    {feature.title.toUpperCase()}
                                </h3>
                            </div>
                            <p className={styles.description}>{feature.description}</p>

                            <div className={styles.footer}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Interactive Background Elements */}
                        <div className={styles.bgGlow} style={{ backgroundColor: feature.color }} />
                        <div className={styles.border} />
                    </Link>
                ))}
            </div>

            {/* BOTTOM SECTION: UPDATES & CREDITS */}
            <div className={styles.bottomSection}>
                <div className={styles.updatesSection}>
                    <Suspense fallback={<div className={styles.skeleton} />}>
                        <RecentUpdates />
                    </Suspense>
                </div>
                <div className={styles.creditsSection}>
                    <GlobalCredits />
                </div>
            </div>
        </section>
    )
}
