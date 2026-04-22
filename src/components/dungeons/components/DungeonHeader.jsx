import { Landmark } from 'lucide-react'
import styles from './DungeonHeader.module.css'

export default function DungeonHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <div className={styles.iconWrapper}>
                    <Landmark className={styles.icon} />
                </div>
                <h1 className={styles.title}>
                    <span className={styles.goldText}>DUNGEONS</span>
                </h1>
                <div className={styles.underline} />
            </div>
            <p className={styles.subtitle}>
                Guides and team compositions for resource dungeons.
            </p>
        </div>
    )
}
