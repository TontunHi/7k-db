import { Swords } from 'lucide-react'
import styles from './ArenaHeader.module.css'

export default function ArenaHeader({ lastUpdated }) {
    return (
        <div className={styles.header}>
            <div className={styles.headerGlow} />
            <div className={styles.tacticalGrid} />
            <div className={styles.horizontalLines} />
            
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    ARENA
                </h1>
                <div className={styles.titleShadow}>ARENA</div>
            </div>
            
            {lastUpdated && (
                <div className={styles.metaStatus}>
                    <div className={styles.statusPulse} />
                    <span className={styles.statusText}>Last Update :</span>
                    <div className={styles.statusDivider} />
                    <span className={styles.dateText}>{lastUpdated}</span>
                </div>
            )}
        </div>
    )
}
