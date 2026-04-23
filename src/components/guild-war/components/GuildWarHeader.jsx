import { Swords } from 'lucide-react'
import styles from './GuildWarHeader.module.css'

export default function GuildWarHeader({ lastUpdated }) {
    return (
        <div className={styles.header}>
            <div className={styles.badge}>
                <Swords className={styles.badgeIcon} />
                <span className={styles.badgeText}>Tactical Intelligence</span>
            </div>
            
            <h1 className={styles.title}>
                GUILD WAR
            </h1>
            
            <p className={styles.subtitle}>
                Elite strategic database for defensive setups and counter-offensive operations.
            </p>

            {lastUpdated && (
                <div className={styles.lastUpdated}>
                    LAST UPDATE: {lastUpdated}
                </div>
            )}
        </div>
    )
}
