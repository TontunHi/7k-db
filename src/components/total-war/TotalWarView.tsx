import TotalWarHeader from './components/TotalWarHeader'
import TotalWarCard from './components/TotalWarCard'
import styles from './TotalWarView.module.css'
import { TIER_CONFIG } from '@/lib/total-war-config'

export default function TotalWarView({ setCounts, lastUpdated }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={styles.bottomGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <TotalWarHeader lastUpdated={lastUpdated} />

                {/* Tier Grid */}
                <div className={styles.grid}>
                    {TIER_CONFIG.map((tier) => (
                        <TotalWarCard 
                            key={tier.key} 
                            tier={tier} 
                            count={setCounts[tier.key] || 0} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
