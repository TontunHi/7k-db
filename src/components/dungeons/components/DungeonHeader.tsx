import { Landmark } from 'lucide-react'
import styles from './DungeonHeader.module.css'

export default function DungeonHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>

                <h1 className={styles.title}>
                    <span className={styles.goldText}>DUNGEONS</span>
                </h1>
                <div className={styles.underline} />
            </div>

        </div>
    )
}
