'use client'
import { Users } from 'lucide-react'
import GuildWarHeader from './components/GuildWarHeader'
import GuildWarTeamCard from './components/GuildWarTeamCard'
import styles from './GuildWarView.module.css'

export default function GuildWarView({ teams, heroImageMap, lastUpdated }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.glowTop} />
                <div className={styles.glowBottom} />
                <div className={styles.gridPattern} />
                <div className={styles.overlay} />
            </div>

            <div className={styles.content}>
                {/* Tactical Header */}
                <GuildWarHeader lastUpdated={lastUpdated} />

                {/* Teams List */}
                <div className={styles.teamsGrid}>
                    {teams.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyGlow} />
                            <div className={styles.emptyIconWrapper}>
                                <Users className={styles.emptyIcon} />
                            </div>
                            <h2 className={styles.emptyTitle}>Tactical Database Offline</h2>
                            <p className={styles.emptyText}>
                                The strategic analysts are currently compiling new data. 
                                Please check back shortly for updated formations.
                            </p>
                        </div>
                    ) : (
                        teams.map((team, idx) => (
                            <GuildWarTeamCard 
                                key={team.id} 
                                team={team} 
                                index={idx} 
                                heroImageMap={heroImageMap} 
                            />
                        ))
                    )}
                </div>
            </div>
            
            {/* Interactive Footer Gradient */}
            <div className={styles.footerGradient} />
        </div>
    )
}
