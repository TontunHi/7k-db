import { clsx } from 'clsx'
import styles from './StageHeader.module.css'

export default function StageHeader({ mode, modeLabel }) {
    const isNightmare = mode === 'nightmare'

    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    STAGE <span className={isNightmare ? styles.redGradient : styles.goldGradient}>STRATEGY</span>
                </h1>
                <div className={clsx(styles.underline, isNightmare ? styles.redUnderline : styles.goldUnderline)} />
            </div>


        </div>
    )
}
