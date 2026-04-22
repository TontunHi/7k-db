import { Swords } from 'lucide-react'
import styles from './GuildWarHeader.module.css'

export default function GuildWarHeader({ lastUpdated }) {
    return (
        <div className={styles.header}>
            <div className={styles.glow} />
            
            <div className={styles.content}>
                <div className={styles.accentTop} />
                <div className={styles.accentBottom} />
                <div className={styles.orb} />

                <div className={styles.info}>
                    <div className={styles.iconWrapper}>
                        <div className={styles.iconGlow} />
                        <div className={styles.iconBox}>
                            <Swords className={styles.icon} />
                        </div>
                    </div>
                    
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>
                            <span>Guild War</span>
                            <span className={styles.database}>Database</span>
                        </h1>
                    </div>
                </div>

                {lastUpdated && (
                    <div className={styles.updateBadge}>
                        <div className={styles.pulseWrapper}>
                            <div className={styles.pulsePing} />
                            <div className={styles.pulseCore} />
                        </div>
                        <div className={styles.updateInfo}>
                            <span className={styles.updateLabel}>Last Updated</span>
                            <span className={styles.updateDate}>{lastUpdated}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
