import { Crown } from 'lucide-react'
import styles from './CastleRushHeader.module.css'

export default function CastleRushHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <div className={styles.iconWrapper}>
                    <Crown className={styles.icon} />
                </div>
                <h1 className={styles.title}>
                    <span className={styles.goldText}>CASTLE RUSH</span>
                </h1>
                <div className={styles.underline} />
            </div>
            <p className={styles.subtitle}>
                Daily boss rotation with recommended team compositions.
            </p>
        </div>
    )
}
