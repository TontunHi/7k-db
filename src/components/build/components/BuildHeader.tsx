import styles from './BuildHeader.module.css'

export default function BuildHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    HERO <span className={styles.goldText}>BUILDS</span>
                </h1>
                <div className={styles.underline} />
            </div>

        </div>
    )
}
