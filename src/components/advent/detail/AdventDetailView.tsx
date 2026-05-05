import AdventDetailHeader from './components/AdventDetailHeader'
import AdventDetailClient from './AdventDetailClient'
import styles from './AdventDetailView.module.css'

export default function AdventDetailView({ boss, sets, heroImageMap }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <AdventDetailHeader boss={boss} />

                {/* Client Logic (Phases, Teams) */}
                <AdventDetailClient sets={sets} heroImageMap={heroImageMap} />
            </div>
        </div>
    )
}
