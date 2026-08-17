'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swords, Compass, ArrowRight, Sparkles, Shield, Trophy, Check, Layers } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import styles from './MetaSnapshot.module.css'

interface ArenaTeamItem {
    id: number
    team_name: string | null
    formation: string
    heroes: string[]
    pet_file?: string | null
}

interface AdventTeamItem {
    id: number
    phase?: string
    team_name: string
    formation: string
    heroes: string[]
    note?: string
    video_url?: string
}

interface AdventBossItem {
    key: string
    name: string
    image: string
    setCount: number
    teams?: AdventTeamItem[]
    primarySet?: AdventTeamItem | null
}

interface MetaSnapshotProps {
    arenaTeams: ArenaTeamItem[]
    adventBosses: AdventBossItem[]
    heroImageMap: Record<string, string>
}

const PHASES = ['Phase 1', 'Phase 2']

export default function MetaSnapshot({
    arenaTeams = [],
    adventBosses = [],
    heroImageMap = {}
}: MetaSnapshotProps) {
    const [activeTab, setActiveTab] = useState<'arena' | 'advent'>('arena')
    const [selectedBossKey, setSelectedBossKey] = useState<string>(
        adventBosses[0]?.key || 'ae_teo'
    )
    const [selectedPhase, setSelectedPhase] = useState<string>('Phase 1')
    const [selectedTeamIndex, setSelectedTeamIndex] = useState<number>(0)

    const currentAdventBoss = adventBosses.find(b => b.key === selectedBossKey) || adventBosses[0]
    const allBossTeams = currentAdventBoss?.teams && currentAdventBoss.teams.length > 0
        ? currentAdventBoss.teams
        : (currentAdventBoss?.primarySet ? [currentAdventBoss.primarySet] : [])

    // Filter teams by currently selected phase
    const phaseTeams = allBossTeams.filter(t => (t.phase || 'Phase 1') === selectedPhase)
    // If no teams found in this phase, fallback to all teams if only 1 exists
    const displayTeams = phaseTeams.length > 0 ? phaseTeams : allBossTeams
    const activeTeam = displayTeams[selectedTeamIndex] || displayTeams[0]

    const handleSelectBoss = (key: string) => {
        setSelectedBossKey(key)
        setSelectedPhase('Phase 1')
        setSelectedTeamIndex(0)
    }

    const handleSelectPhase = (phase: string) => {
        setSelectedPhase(phase)
        setSelectedTeamIndex(0)
    }

    return (
        <section className={styles.container}>
            {/* Header & Mode Switcher */}
            <div className={styles.sectionHeader}>
                <div className={styles.headerLeft}>
                    <div className={`${styles.iconBox} ${activeTab === 'advent' ? styles.iconBoxAdvent : ''}`}>
                        {activeTab === 'arena' ? <Swords size={20} /> : <Compass size={20} />}
                    </div>
                    <div>
                        <h2 className={styles.title}>Meta Command Center</h2>
                        <p className={styles.subtitle}>
                            {activeTab === 'arena'
                                ? 'Top PVP Arena squads, formations, and lineup compositions'
                                : 'High-difficulty Advent Expedition boss strategies & best team comps'}
                        </p>
                    </div>
                </div>

                {/* Tab Switcher Buttons */}
                <div className={styles.tabSwitch}>
                    <button
                        type="button"
                        onClick={() => setActiveTab('arena')}
                        className={`${styles.tabButton} ${activeTab === 'arena' ? styles.tabButtonActiveArena : ''}`}
                    >
                        <Trophy size={14} />
                        <span>PVP Arena</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('advent')}
                        className={`${styles.tabButton} ${activeTab === 'advent' ? styles.tabButtonActiveAdvent : ''}`}
                    >
                        <Compass size={14} />
                        <span>Advent Expedition</span>
                    </button>
                </div>
            </div>

            {/* ========================================= */}
            {/* TAB 1: PVP ARENA META                     */}
            {/* ========================================= */}
            {activeTab === 'arena' && (
                <div>
                    <div className={styles.arenaGrid}>
                        {arenaTeams.slice(0, 3).map((team, idx) => (
                            <div key={team.id || idx} className={styles.arenaCard}>
                                <div className={styles.arenaCardGlow} />

                                <div>
                                    <div className={styles.arenaCardHeader}>
                                        <h3 className={styles.arenaTeamName}>
                                            {team.team_name || `Squad #${idx + 1}`}
                                        </h3>
                                        <span className={styles.formationBadge}>
                                            Formation {team.formation}
                                        </span>
                                    </div>

                                    {/* 5-Hero Formation Preview */}
                                    <div className={styles.arenaFormationBox}>
                                        <FormationGrid
                                            formation={team.formation}
                                            heroes={team.heroes}
                                            heroImageMap={heroImageMap}
                                            customClasses={{
                                                container: "grid grid-cols-5 gap-2 w-full max-w-[320px]",
                                                cardString: "bg-slate-900/60 border-slate-700/50 aspect-[3/4] rounded-lg shadow-md"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.viewMoreRow}>
                        <span className="text-xs text-slate-400">
                            Viewing top Arena squads. Explore full team counters, speed tiers, and item builds.
                        </span>
                        <Link href="/arena" className={`${styles.viewMoreBtn} ${styles.viewMoreBtnArena}`}>
                            <span>View All Arena Teams</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* TAB 2: ADVENT EXPEDITION                  */}
            {/* ========================================= */}
            {activeTab === 'advent' && currentAdventBoss && (
                <div className={styles.adventBox}>
                    {/* Horizontal Boss Nav Strip */}
                    <div className={styles.bossNavStrip}>
                        {adventBosses.map((boss) => {
                            const isActive = boss.key === currentAdventBoss.key
                            return (
                                <button
                                    key={boss.key}
                                    type="button"
                                    onClick={() => handleSelectBoss(boss.key)}
                                    className={`${styles.bossNavBtn} ${isActive ? styles.bossNavBtnActive : ''}`}
                                >
                                    <Sparkles size={12} className={isActive ? 'text-amber-400' : 'text-zinc-500'} />
                                    <span>{boss.name}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Showcase Card with Vertical Character Poster Frame */}
                    <div className={styles.adventShowcaseCard}>
                        {/* 1. Character Portrait Poster Frame */}
                        <div className={styles.portraitFrame}>
                            <Image
                                src={currentAdventBoss.image}
                                alt={currentAdventBoss.name}
                                fill
                                className={styles.portraitImage}
                                sizes="240px"
                                priority
                            />
                            <div className={styles.portraitGradient} />
                            <div className={styles.portraitNameBadge}>
                                <h4 className={styles.portraitBossName}>{currentAdventBoss.name}</h4>
                            </div>
                        </div>

                        {/* 2. Details & Team Lineups */}
                        <div className={styles.adventDetailsSection}>
                            <div>
                                <div className={styles.adventDetailsHeader}>
                                    <div className={styles.adventTopRow}>
                                        <div className="flex items-center gap-2">
                                            <span className={styles.adventBadge}>
                                                Advent Boss Guide
                                            </span>

                                            {/* Phase Selector Pills */}
                                            <div className={styles.phaseSelectorRow}>
                                                {PHASES.map((p) => {
                                                    const isPhaseActive = selectedPhase === p
                                                    return (
                                                        <button
                                                            key={p}
                                                            type="button"
                                                            onClick={() => handleSelectPhase(p)}
                                                            className={`${styles.phasePill} ${isPhaseActive ? styles.phasePillActive : ''}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <span className={styles.adventCountText}>
                                            {allBossTeams.length} Total {allBossTeams.length === 1 ? 'Team' : 'Teams'}
                                        </span>
                                    </div>

                                    <h3 className={styles.adventMainTitle}>
                                        {currentAdventBoss.name} Tactics • {selectedPhase}
                                    </h3>
                                </div>

                                {/* Team Variations Switcher Pills for this Phase */}
                                {displayTeams.length > 1 && (
                                    <div className="mt-3 mb-2">
                                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                                            <Layers size={12} className="text-amber-400" /> Select Team Variation:
                                        </span>
                                        <div className={styles.teamSelectorRow}>
                                            {displayTeams.map((t, tIdx) => {
                                                const isTeamActive = tIdx === (selectedTeamIndex || 0)
                                                return (
                                                    <button
                                                        key={t.id || tIdx}
                                                        type="button"
                                                        onClick={() => setSelectedTeamIndex(tIdx)}
                                                        className={`${styles.teamPill} ${isTeamActive ? styles.teamPillActive : ''}`}
                                                    >
                                                        {isTeamActive && <Check size={12} className="text-amber-400" />}
                                                        <span>{t.team_name}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Formation Row for Active Team */}
                                {activeTeam?.heroes && activeTeam.heroes.length > 0 ? (
                                    <div className={styles.adventFormationContainer}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-amber-400">
                                                {activeTeam.team_name} {activeTeam.formation ? `(Formation ${activeTeam.formation})` : ''}
                                            </span>
                                        </div>
                                        <FormationGrid
                                            formation={activeTeam.formation || '4-1'}
                                            heroes={activeTeam.heroes}
                                            heroImageMap={heroImageMap}
                                            customClasses={{
                                                container: "grid grid-cols-5 gap-2 w-full max-w-[340px]",
                                                cardString: "bg-slate-900/60 border-slate-700/50 aspect-[3/4] rounded-lg shadow-md"
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="py-6 text-sm text-zinc-400">
                                        No team registered for {selectedPhase} yet. Full strategy available in the guide.
                                    </div>
                                )}
                            </div>

                            {/* View Full Strategy Link */}
                            <div className={styles.viewMoreRow}>
                                <span className="text-xs text-slate-400">
                                    Full breakdown: speed tuning, gear stats, and skill priority.
                                </span>
                                <Link
                                    href={`/advent/${currentAdventBoss.key}`}
                                    className={`${styles.viewMoreBtn} ${styles.viewMoreBtnAdvent}`}
                                >
                                    <span>View {currentAdventBoss.name} Full Guide</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
