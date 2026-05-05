import { Users } from 'lucide-react'
import ArenaHeader from './components/ArenaHeader'
import ArenaTeamCard from './components/ArenaTeamCard'
import styles from './ArenaView.module.css'

export default function ArenaView({ sets, heroImageMap, lastUpdated }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={styles.rightGlow} />
                <div className={styles.noise} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <ArenaHeader lastUpdated={lastUpdated} />

                {/* Grid */}
                {sets.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Users className={styles.emptyIcon} />
                        <h2 className={styles.emptyTitle}>No Arena Teams Available</h2>
                        <p className={styles.emptyText}>
                            The administrator hasn&apos;t configured any team recommendations yet. Check back soon for the latest meta setups.
                        </p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {sets.map((set, idx) => (
                            <ArenaTeamCard 
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
    )
}
