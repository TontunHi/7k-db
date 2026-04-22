import styles from './BackgroundEffects.module.css'

export default function BackgroundEffects() {
    return (
        <div className={styles.container}>
            <div className={styles.grid} />
            <div className={styles.topGlow} />
            <div className={styles.bottomGlow} />
        </div>
    )
}
