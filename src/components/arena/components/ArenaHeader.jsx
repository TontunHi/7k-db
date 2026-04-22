import { Swords } from 'lucide-react'
import styles from './ArenaHeader.module.css'

export default function ArenaHeader({ lastUpdated }) {
    return (
        <div className={styles.banner}>
            <div className={styles.highlight} />
            
            <div className={styles.layout}>
                <div className={styles.info}>
                    <div className={styles.badge}>
                        <div className={styles.iconWrapper}>
                            <Swords className={styles.icon} />
                        </div>
                        <div className={styles.labelWrapper}>
                            <span className={styles.labelText}>Competitive Meta</span>
                            <div className={styles.labelBar} />
                        </div>
                    </div>
                    
                    <h1 className={styles.title}>
                        <span className={styles.whiteText}>ARENA</span>
                        <span className={styles.gradientText}>TEAMS</span>
                    </h1>
                    
                    <p className={styles.subtitle}>
                        Optimal formations and rotations for Arena dominance.
                    </p>
                </div>
                
                <div className={styles.stats}>
                    {lastUpdated && (
                        <div className={`${styles.statBadge} ${styles.primaryStat}`}>
                            Updated {lastUpdated}
                        </div>
                    )}
                    <div className={`${styles.statBadge} ${styles.secondaryStat}`}>
                        Season Update
                    </div>
                </div>
            </div>
        </div>
    )
}
