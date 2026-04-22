import { Users } from 'lucide-react'
import RaidDetailHeader from './components/RaidDetailHeader'
import RaidTeamSet from './components/RaidTeamSet'
import styles from './RaidDetailView.module.css'

export default function RaidDetailView({ raid, sets, heroImageMap, skillsMap }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <RaidDetailHeader raid={raid} />

                {/* Teams Section */}
                <div className={styles.teamsSection}>
                    {sets.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Users className={styles.emptyIcon} />
                            <p className={styles.emptyText}>Awaiting tactical data deployment...</p>
                        </div>
                    ) : (
                        <div className={styles.setsList}>
                            {sets.map((set, idx) => (
                                <RaidTeamSet 
                                    key={set.id} 
                                    set={set} 
                                    index={idx} 
                                    heroImageMap={heroImageMap} 
                                    skillsMap={skillsMap}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
