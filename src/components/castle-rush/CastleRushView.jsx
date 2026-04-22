import CastleRushHeader from './components/CastleRushHeader'
import CastleRushCard from './components/CastleRushCard'
import styles from './CastleRushView.module.css'

export default function CastleRushView({ bosses }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={styles.bottomGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <CastleRushHeader />

                {/* Grid */}
                <div className={styles.grid}>
                    {bosses.map((boss) => (
                        <CastleRushCard key={boss.key} boss={boss} />
                    ))}
                </div>
            </div>
        </div>
    )
}
