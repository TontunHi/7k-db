import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'
import TotalWarDetailHeader from './components/TotalWarDetailHeader'
import TotalWarTeamSet from './components/TotalWarTeamSet'
import styles from './TotalWarDetailView.module.css'

export default function TotalWarDetailView({ tier, sets, heroImageMap }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div 
                    className={styles.glow} 
                    style={{ backgroundColor: tier.accent }}
                />
            </div>

            <div className={styles.content}>
                {/* Back Button */}
                <Link href="/total-war" className={styles.backLink}>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Total War</span>
                </Link>

                {/* Header */}
                <TotalWarDetailHeader 
                    tier={tier} 
                    setCounts={sets.length} 
                />

                {/* Sets List */}
                {sets.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Layers className={styles.emptyIcon} />
                        <p className={styles.emptyText}>No team sets available yet.</p>
                        <p className={styles.emptySubtext}>Check back later for updates.</p>
                    </div>
                ) : (
                    <div className={styles.setsList}>
                        {sets.map((set, idx) => (
                            <TotalWarTeamSet 
                                key={set.id} 
                                set={set} 
                                setIdx={idx} 
                                tier={tier} 
                                heroImageMap={heroImageMap} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
