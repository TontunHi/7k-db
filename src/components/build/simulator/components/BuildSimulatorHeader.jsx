import styles from './BuildSimulatorHeader.module.css'

export default function BuildSimulatorHeader({ lastUpdated }) {
    return (
        <div className={styles.header}>
            <div className={styles.headerGlow} />
            <div className={styles.tacticalGrid} />
            <div className={styles.horizontalLines} />
            <div className={styles.movingScan} />
            
            <div className={styles.particles}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.particle} />
                ))}
            </div>
            
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    BUILD SIMULATOR
                </h1>
            </div>

            {lastUpdated && (
                <div className={styles.updateBadge}>
                    <div className={styles.pulse} />
                    <span className={styles.updateText}>Last Update :</span>
                    <div className={styles.divider} />
                    <span className={styles.updateDate}>{lastUpdated}</span>
                </div>
            )}
        </div>
    )
}
