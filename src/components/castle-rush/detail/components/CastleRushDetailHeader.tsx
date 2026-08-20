import Link from 'next/link'
import Image from 'next/image'
import { Crown, ArrowLeft } from 'lucide-react'
import ModeQuickSwitchNav from '@/components/shared/ModeQuickSwitchNav'
import { CASTLE_RUSH_BOSSES } from '@/lib/castle-rush-config'
import styles from './CastleRushDetailHeader.module.css'

export default function CastleRushDetailHeader({ boss }) {
    const switchItems = CASTLE_RUSH_BOSSES.map(b => ({
        key: b.key,
        name: b.name,
        href: `/castle-rush/${b.key}`,
        subtext: b.dayName.slice(0, 3)
    }))

    return (
        <div className={styles.container}>
            {/* Quick Switch Nav & Breadcrumbs */}
            <ModeQuickSwitchNav
                modeTitle="Castle Rush"
                modeHref="/castle-rush"
                currentKey={boss.key}
                currentName={boss.name}
                items={switchItems}
                theme="gold"
            />
            
            <div className={styles.banner}>
                <Image 
                    src={boss.image} 
                    alt={boss.name} 
                    fill 
                    className={styles.image} 
                    priority
                    sizes="100vw"
                />
                <div className={styles.overlayTop} />
                <div className={styles.overlayRight} />
                
                <div className={styles.infoOverlay}>
                    <div className={styles.badge}>
                        <Crown className={styles.badgeIcon} />
                        <span className={styles.badgeText}>Castle Rush Boss</span>
                    </div>
                    <h1 className={styles.title}>
                        {boss.name}
                    </h1>
                    <div className={styles.underline}></div>
                </div>
            </div>
        </div>
    )
}
