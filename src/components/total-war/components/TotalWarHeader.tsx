import styles from './TotalWarHeader.module.css'
import { Swords } from 'lucide-react'

export default function TotalWarHeader({ lastUpdated }) {
    return (
        <div className={styles.header}>
            {/* Corner Borders */}
            <div className={`${styles.corner} ${styles.topLeft}`} />
            <div className={`${styles.corner} ${styles.topRight}`} />
            <div className={`${styles.corner} ${styles.bottomLeft}`} />
            <div className={`${styles.corner} ${styles.bottomRight}`} />
            
            <div className={styles.headerGlow} />
            <div className={styles.tacticalGrid} />

            <div className={styles.mainInfo}>
                <div className={styles.titleGroup}>
                    <div className={styles.categoryTag}>
                        <Swords className="w-3.5 h-3.5 animate-pulse" />
                        <span>PVE Combat Matrix</span>
                    </div>
                    <h1 className={styles.title}>TOTAL WAR</h1>
                    <p className={styles.subtitle}>7K GLOBAL CAMPAIGN DIRECTIVES</p>
                </div>
                
                {lastUpdated && (
                    <div className={styles.syncBadge}>
                        <span className={styles.pulseDot} />
                        <span className={styles.syncLabel}>LAST SYNC</span>
                        <div className={styles.syncDivider} />
                        <span className={styles.syncTime}>{lastUpdated}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
