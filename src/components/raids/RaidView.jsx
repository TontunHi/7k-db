import RaidHeader from './components/RaidHeader'
import RaidCard from './components/RaidCard'
import styles from './RaidView.module.css'

export default function RaidView({ raids }) {
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
                <RaidHeader />

                {/* Raid Grid */}
                <div className={styles.grid}>
                    {raids.map((raid) => (
                        <RaidCard key={raid.key} raid={raid} />
                    ))}
                </div>
            </div>
        </div>
    )
}
