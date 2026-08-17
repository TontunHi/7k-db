import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Flame, Shield, ArrowRight, Sparkles } from 'lucide-react'
import { CASTLE_RUSH_BOSSES } from '@/lib/castle-rush-config'
import styles from './DailyBossHub.module.css'

interface CastleRushToday {
    key: string
    name: string
    image: string
    dayName: string
    setCount: number
}

interface ActiveRaid {
    key: string
    name: string
    image: string
    setCount: number
}

interface DailyBossHubProps {
    castleRush: CastleRushToday
    activeRaids?: ActiveRaid[]
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function DailyBossHub({ castleRush, activeRaids = [] }: DailyBossHubProps) {
    const hasActiveRaids = activeRaids && activeRaids.length > 0
    const primaryRaid = hasActiveRaids ? activeRaids[0] : null

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <div className={styles.iconBox}>
                        <Calendar size={18} />
                    </div>
                    <div>
                        <h2 className={styles.title}>Daily Castle Rush & Active Raid</h2>
                        <p className={styles.subtitle}>
                            {hasActiveRaids
                                ? "Today's Castle Rush boss and current active raid rotation"
                                : "Today's featured Castle Rush boss schedule"}
                        </p>
                    </div>
                </div>
            </div>

            <div className={`${styles.grid} ${hasActiveRaids ? styles.gridTwoCols : ''}`}>
                {/* 1. Castle Rush of the Day */}
                <div className={styles.bannerCard}>
                    {/* Panoramic Artwork Background */}
                    <div className={styles.bgImageWrapper}>
                        <Image
                            src={castleRush.image}
                            alt={castleRush.name}
                            fill
                            className={styles.bgImage}
                            sizes="(max-width: 900px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    <div className={styles.gradientOverlay} />

                    <div className={styles.cardContent}>
                        <div>
                            {/* Card Top Badges */}
                            <div className={styles.cardHeader}>
                                <div className={styles.tagGroup}>
                                    <span className={`${styles.badge} ${styles.badgeGold}`}>
                                        <Shield size={12} /> Castle Rush
                                    </span>
                                    <span className={styles.dayTag}>{castleRush.dayName}</span>
                                </div>
                                <span className={styles.todayPill}>TODAY</span>
                            </div>

                            {/* Boss Title */}
                            <div className={styles.bossBody}>
                                <h3 className={styles.bossName}>{castleRush.name}</h3>
                                <p className={styles.bossSubtitle}>
                                    {castleRush.setCount > 0
                                        ? `${castleRush.setCount} Recommended Lineup${castleRush.setCount > 1 ? 's' : ''} & Skill Rotations`
                                        : 'Tactical lineup guides available'}
                                </p>
                            </div>

                            {/* 7-Day Quick Strip */}
                            <div className={styles.weekStrip}>
                                {CASTLE_RUSH_BOSSES.map((boss) => {
                                    const isCurrent = boss.key === castleRush.key
                                    return (
                                        <Link
                                            key={boss.key}
                                            href={`/castle-rush/${boss.key}`}
                                            className={`${styles.dayPill} ${isCurrent ? styles.dayPillActive : ''}`}
                                            title={`${boss.dayName}: ${boss.name}`}
                                        >
                                            <span className={styles.dayPillLabel}>{SHORT_DAYS[boss.dayIndex]}</span>
                                            <span className={styles.dayPillBoss}>{boss.name}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className={styles.cardFooter}>
                            <span className={styles.extraCountBadge}>
                                Rotation: Daily Reset
                            </span>
                            <Link href={`/castle-rush/${castleRush.key}`} className={`${styles.actionButton} ${styles.actionButtonGold}`}>
                                <span>View {castleRush.name} Guide</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Active Raid Encounters (Rendered ONLY if at least 1 raid is active) */}
                {hasActiveRaids && primaryRaid && (
                    <div className={`${styles.bannerCard} ${styles.bannerCardRaid}`}>
                        {/* Panoramic Artwork Background */}
                        <div className={styles.bgImageWrapper}>
                            <Image
                                src={primaryRaid.image}
                                alt={primaryRaid.name}
                                fill
                                className={styles.bgImage}
                                sizes="(max-width: 900px) 100vw, 50vw"
                            />
                        </div>
                        <div className={styles.gradientOverlayRaid} />

                        <div className={styles.cardContent}>
                            <div>
                                {/* Card Top Badges */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.tagGroup}>
                                        <span className={`${styles.badge} ${styles.badgeRed}`}>
                                            <Flame size={12} /> Active Raid
                                        </span>
                                        <span className={styles.dayTag}>Current Encounter</span>
                                    </div>
                                    <span className={styles.activePill}>
                                        <Sparkles size={10} /> ACTIVE
                                    </span>
                                </div>

                                {/* Boss Title */}
                                <div className={styles.bossBody}>
                                    <h3 className={styles.bossName}>{primaryRaid.name}</h3>
                                    <p className={styles.bossSubtitle}>
                                        {primaryRaid.setCount > 0
                                            ? `${primaryRaid.setCount} Tactical Team${primaryRaid.setCount > 1 ? 's' : ''} & Speed Setup`
                                            : 'Raid battle strategy & mechanics'}
                                    </p>
                                </div>

                                {activeRaids.length > 1 && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[11px] text-muted-foreground font-semibold">Also Active:</span>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {activeRaids.slice(1).map(r => (
                                                <Link
                                                    key={r.key}
                                                    href={`/raid/${r.key}`}
                                                    className="px-2 py-0.5 rounded-md bg-neutral-900/80 border border-white/10 text-[11px] font-bold text-white hover:border-red-500/50 transition-colors"
                                                >
                                                    {r.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className={styles.cardFooter}>
                                <span className={styles.extraCountBadge}>
                                    {activeRaids.length} Active {activeRaids.length === 1 ? 'Boss' : 'Bosses'}
                                </span>
                                <Link href={`/raid/${primaryRaid.key}`} className={`${styles.actionButton} ${styles.actionButtonRed}`}>
                                    <span>View {primaryRaid.name} Guide</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
