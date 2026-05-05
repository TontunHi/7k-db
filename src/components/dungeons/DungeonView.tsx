import DungeonHeader from './components/DungeonHeader'
import DungeonCard from './components/DungeonCard'
import styles from './DungeonView.module.css'

export default function DungeonView({ dungeons }) {
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
                <DungeonHeader />

                {/* Dungeon Grid */}
                <div className={styles.grid}>
                    {dungeons.map((dungeon) => (
                        <DungeonCard key={dungeon.key} dungeon={dungeon} />
                    ))}
                </div>
            </div>
        </div>
    )
}
