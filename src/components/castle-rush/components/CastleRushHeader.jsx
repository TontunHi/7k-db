import { Crown } from 'lucide-react'
import styles from './CastleRushHeader.module.css'

export default function CastleRushHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>

                <h1 className={styles.title}>
                    <span className={styles.goldText}>CASTLE RUSH</span>
                </h1>
                <div className={styles.underline} />
            </div>

        </div>
    )
}
