import styles from './TierlistHeader.module.css'

export default function TierlistHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    TIER <span className={styles.goldText}>LIST</span>
                </h1>
                <div className={styles.underline} />
            </div>
        </header>
    )
}
