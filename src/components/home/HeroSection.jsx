import styles from './HeroSection.module.css'

export default function HeroSection() {
    return (
        <header className={styles.hero}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    SEVEN <span className={styles.goldText}>KNIGHTS</span>
                </h1>
                <h2 className={styles.subtitle}>
                    REBIRTH <span className={styles.dbLabel}>DB</span>
                </h2>
                <div className={styles.underline} />
            </div>


        </header>
    )
}
