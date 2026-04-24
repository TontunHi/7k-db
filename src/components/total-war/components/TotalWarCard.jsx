import Link from 'next/link'
import Image from 'next/image'
import { clsx } from 'clsx'
import styles from './TotalWarCard.module.css'

export default function TotalWarCard({ tier, count }) {
    const borderClass = `border${tier.label}`
    const bgClass = `bg${tier.label}`

    return (
        <Link href={`/total-war/${tier.key}`} className={styles.card}>
            {/* Background Effects */}
            <div className={styles.scanline} />
            <div className={styles.sweep} />
            <div 
                className={styles.glow} 
                style={{ background: `radial-gradient(ellipse at center, ${tier.glow} 0%, transparent 70%)` }}
            />
            <div className={clsx(styles.borderGlow, styles[borderClass])} />

            {/* Logo Wrapper */}
            <div className={styles.logoWrapper}>
                <div className={styles.logoGlow} style={{ backgroundColor: tier.accent }} />
                <Image
                    src={tier.logo}
                    alt={tier.label}
                    fill
                    className={styles.logo}
                    sizes="(max-width: 768px) 45vw, 20vw"
                />
            </div>

            {/* Info Section */}
            <div className={styles.info}>
                <div className={styles.labelGroup}>
                    <span className={styles.tagline} style={{ color: tier.accent }}>Tactical Tier</span>
                    <h2 className={styles.title} style={{ color: tier.accent }}>
                        {tier.label}
                    </h2>
                </div>
                
                <div className={styles.metaBox}>
                    <p className={styles.meta}>
                        {tier.maxTeams} Teams per Set
                    </p>
                    {count > 0 && (
                        <div className={styles.countBadge} style={{ backgroundColor: tier.accent }}>
                            {count} Set{count > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* Accent Line */}
            <div className={clsx(styles.bottomLine, styles[bgClass])} />
        </Link>
    )
}
