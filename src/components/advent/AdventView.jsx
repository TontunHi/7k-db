import AdventHeader from './components/AdventHeader'
import AdventCard from './components/AdventCard'
import styles from './AdventView.module.css'

export default function AdventView({ bosses }) {
    // Filter out bosses with invalid images
    const validBosses = bosses.filter(boss => boss.image && !boss.image.includes('undefined'))

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
                <AdventHeader />

                {/* Grid */}
                <div className={styles.grid}>
                    {validBosses.map((boss) => (
                        <AdventCard key={boss.key} boss={boss} />
                    ))}
                </div>
            </div>
        </div>
    )
}
