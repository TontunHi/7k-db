import { Swords } from 'lucide-react'
import styles from './ArenaHeader.module.css'

export default function ArenaHeader({ lastUpdated }) {
    return (
        <div className={styles.header}>
            <div className={styles.badge}>
                <Swords className={styles.badgeIcon} />
                <span className={styles.badgeText}>Competitive Meta</span>
            </div>
            
            <h1 className={styles.title}>
                ARENA EXPEDITION
            </h1>
            
            <p className={styles.subtitle}>
                Discover the most effective formations and rotations for Arena dominance.
            </p>

            {lastUpdated && (
                <div className={styles.lastUpdated}>
                    LAST UPDATE: {lastUpdated}
                </div>
            )}
        </div>
    )
}
