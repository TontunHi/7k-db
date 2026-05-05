import Image from 'next/image'
import Link from 'next/link'
import { Swords } from 'lucide-react'
import { clsx } from 'clsx'
import { TIER_CONFIG } from '@/lib/total-war-config'
import styles from './TotalWarDetailHeader.module.css'

export default function TotalWarDetailHeader({ tier, setCounts }) {
    const activeTier = tier.key

    return (
        <div className={styles.header}>
            {/* Logo */}
            <div className={styles.logoArea}>
                <Image
                    src={tier.logo}
                    alt={tier.label}
                    fill
                    className={styles.logo}
                    priority
                    sizes="(max-width: 1024px) 160px, 200px"
                />
            </div>

            {/* Title Info */}
            <div className={styles.info}>
                <div className={styles.badge}>
                    <Swords className={styles.badgeIcon} style={{ color: tier.accent }} />
                    <span className={styles.badgeText} style={{ color: tier.accent }}>
                        Total War Operation
                    </span>
                </div>
                
                <h1 className={styles.title} style={{ color: tier.accent }}>
                    {tier.label}
                </h1>
                
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Team Config</span>
                        <span className={styles.statValue}>{tier.maxTeams} SQUADS</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Deployments</span>
                        <span className={styles.statValue}>{setCounts} SETS</span>
                    </div>
                </div>
            </div>

            {/* Tier Navigation */}
            <div className={styles.nav}>
                {TIER_CONFIG.map(t => (
                    <Link
                        key={t.key}
                        href={`/total-war/${t.key}`}
                        className={clsx(
                            styles.navLink,
                            t.key === activeTier && styles.navActive
                        )}
                    >
                        <div className={styles.navLogoWrapper}>
                            <Image 
                                src={t.logo} 
                                alt={t.label} 
                                fill 
                                className={styles.navLogo} 
                                sizes="48px" 
                            />
                        </div>
                        {t.key === activeTier && (
                            <div 
                                className={styles.navIndicator} 
                                style={{ backgroundColor: t.accent }}
                            />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}
