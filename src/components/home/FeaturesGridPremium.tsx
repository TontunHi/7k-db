import React, { Suspense } from 'react'
import styles from './FeaturesGridPremium.module.css'
import Link from 'next/link'
import RecentUpdates from '@/components/shared/RecentUpdates'
import GlobalCredits from '@/components/shared/GlobalCredits'

interface FeaturesGridPremiumProps {
    translations?: Record<string, string>
}

export default function FeaturesGridPremium({ translations = {} }: FeaturesGridPremiumProps) {
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    const features = [
        { title: t("feature.builds.title", "Hero Builds"), description: t("feature.builds.desc", "Stat & Gear recommendations"), color: "#FFD700", href: "/build", id: "01" },
        { title: t("feature.tierlist.title", "Meta Tier List"), description: t("feature.tierlist.desc", "See Tier List of heroes"), color: "#C0C0C0", href: "/tierlist", id: "02" },
        { title: t("feature.dungeons.title", "Dungeons"), description: t("feature.dungeons.desc", "Team comps for all difficulties"), color: "#A18CD1", href: "/dungeon", id: "03" },
        { title: t("feature.raids.title", "Raids"), description: t("feature.raids.desc", "Boss mechanics & strategies"), color: "#FF4B2B", href: "/raid", id: "04" },
        { title: t("feature.advent.title", "Advent Expedition"), description: t("feature.advent.desc", "Advent Expedition guides"), color: "#4FACFE", href: "/advent", id: "05" },
        { title: t("feature.arena.title", "Arena"), description: t("feature.arena.desc", "Top PVP teams"), color: "#00F2FE", href: "/arena", id: "06" },
        { title: t("feature.totalwar.title", "Total War"), description: t("feature.totalwar.desc", "Total War formations"), color: "#F093FB", href: "/total-war", id: "07" },
        { title: t("feature.guildwar.title", "Guild War"), description: t("feature.guildwar.desc", "Guild War teams"), color: "#FF9A9E", href: "/guild-war", id: "08" },
        { title: t("feature.castlerush.title", "Castle Rush"), description: t("feature.castlerush.desc", "Castle Rush lineups"), color: "#FAD0C4", href: "/castle-rush", id: "09" },
        { title: t("feature.buildsim.title", "Build Simulator"), description: t("feature.buildsim.desc", "Simulate your own hero builds"), color: "#667EEA", href: "/tools/build-simulator", id: "10" },
        { title: t("feature.herostats.title", "Hero Stats"), description: t("feature.herostats.desc", "Look up base stats"), color: "#F6D365", href: "/tools/hero-stats", id: "11" },
        { title: t("feature.tiermaker.title", "Tier Maker"), description: t("feature.tiermaker.desc", "Create your own tier list"), color: "#84FAB0", href: "/tools/tierlist-maker", id: "12" },
    ]
    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                {features.map((feature) => (
                    <Link key={feature.title} href={feature.href} className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.titleWrapper}>
                                <div className={styles.dot} style={{ backgroundColor: feature.color }} />
                                <h3 className={styles.title} style={{ '--accent': feature.color } as React.CSSProperties}>
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
