import { Users } from 'lucide-react'
import CastleRushDetailHeader from './components/CastleRushDetailHeader'
import CastleRushTeamSet from './components/CastleRushTeamSet'
import styles from './CastleRushDetailView.module.css'

export default function CastleRushDetailView({ boss, sets, heroImageMap }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <CastleRushDetailHeader boss={boss} />

                {/* Teams Section */}
                <div className={styles.teamsSection}>
                    {sets.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Users className={styles.emptyIcon} />
                            <p className={styles.emptyText}>No team recommendations available yet.</p>
                        </div>
                    ) : (
                        <div className={styles.setsList}>
                            {sets.map((set, idx) => (
                                <CastleRushTeamSet 
                                    key={set.id} 
                                    set={set} 
                                    index={idx} 
                                    heroImageMap={heroImageMap} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
