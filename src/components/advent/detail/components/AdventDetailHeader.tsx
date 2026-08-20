import Link from 'next/link'
import Image from 'next/image'
import { Compass, ArrowLeft } from 'lucide-react'
import ModeQuickSwitchNav from '@/components/shared/ModeQuickSwitchNav'
import { ADVENT_BOSSES } from '@/lib/advent-config'
import styles from './AdventDetailHeader.module.css'

export default function AdventDetailHeader({ boss }) {
    const hasImage = boss.image && !boss.image.includes('undefined');

    const switchItems = ADVENT_BOSSES.map(b => ({
        key: b.key,
        name: b.name,
        href: `/advent/${b.key}`
    }))

    return (
        <div className={styles.container}>
            {/* Quick Switch Nav & Breadcrumbs */}
            <ModeQuickSwitchNav
                modeTitle="Advent Expedition"
                modeHref="/advent"
                currentKey={boss.key}
                currentName={boss.name}
                items={switchItems}
                theme="gold"
            />
            
            <div className={styles.content}>
                {/* Boss Image */}
                <div className={styles.imageWrapper}>
                    {hasImage ? (
                        <Image 
                            src={boss.image} 
                            alt={boss.name} 
                            fill 
                            className={styles.image} 
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className={styles.emptyIconWrapper}>
                            <Compass className={styles.emptyIcon} />
                        </div>
                    )}
                </div>
                
                {/* Boss Info */}
                <div className={styles.info}>
                    <div className={styles.badge}>
                        <Compass className={styles.badgeIcon} />
                        <span className={styles.badgeText}>Advent Expedition Boss</span>
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
