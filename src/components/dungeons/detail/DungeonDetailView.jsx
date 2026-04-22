import { Users } from 'lucide-react'
import DungeonDetailHeader from './components/DungeonDetailHeader'
import DungeonTeamSet from './components/DungeonTeamSet'
import styles from './DungeonDetailView.module.css'

export default function DungeonDetailView({ dungeon, sets, heroImageMap }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <DungeonDetailHeader dungeon={dungeon} />

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
                                <DungeonTeamSet 
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
