import Image from 'next/image'
import Link from 'next/link'
import { Swords } from 'lucide-react'
import { clsx } from 'clsx'
import { TIER_CONFIG } from '@/lib/total-war-config'
import styles from './TotalWarDetailHeader.module.css'

export default function TotalWarDetailHeader({ tier, setCounts }) {
    const activeTier = tier.key

    return (
        <div className={styles.banner}>
            {/* Logo */}
            <div className={styles.logoWrapper}>
                <Image
                    src={tier.logo}
                    alt={tier.label}
                    fill
                    className={styles.logo}
                    priority
                    sizes="144px"
                />
            </div>

            {/* Title Info */}
            <div className={styles.info}>
                <div className={styles.badge}>
                    <Swords className={styles.icon} style={{ color: tier.accent }} />
                    <span className={styles.tag} style={{ color: tier.accent }}>
                        Total War
                    </span>
                </div>
                <h1 className={styles.title} style={{ color: tier.accent }}>
                    {tier.label}
                </h1>
                <div 
                    className={styles.bar} 
                    style={{ 
                        background: `linear-gradient(to right, ${tier.accent}, transparent)`,
                        boxShadow: `0 0 12px ${tier.accent}60`
                    }} 
                />
                <p className={styles.meta}>
                    {tier.maxTeams} Teams per Set • {setCounts} available
                </p>
            </div>

            {/* Mini Nav */}
            <div className={styles.nav}>
                {TIER_CONFIG.map(t => (
                    <Link
                        key={t.key}
                        href={`/total-war/${t.key}`}
                        className={clsx(
                            styles.navLink,
                            t.key === activeTier && styles.navActive
                        )}
                        style={t.key === activeTier ? { borderColor: t.accent } : {}}
                    >
                        <Image 
                            src={t.logo} 
                            alt={t.label} 
                            fill 
                            className={styles.navLogo} 
                            sizes="44px" 
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}
