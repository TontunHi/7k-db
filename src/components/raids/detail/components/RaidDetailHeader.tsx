import Link from 'next/link'
import Image from 'next/image'
import { Skull, ArrowLeft } from 'lucide-react'
import ModeQuickSwitchNav from '@/components/shared/ModeQuickSwitchNav'
import { RAID_BOSSES } from '@/lib/raid-config'
import styles from './RaidDetailHeader.module.css'

export default function RaidDetailHeader({ raid }) {
    const switchItems = RAID_BOSSES.map(r => ({
        key: r.key,
        name: r.name,
        href: `/raid/${r.key}`
    }))

    return (
        <div className={styles.container}>
            {/* Quick Switch Nav & Breadcrumbs */}
            <ModeQuickSwitchNav
                modeTitle="Raids"
                modeHref="/raid"
                currentKey={raid.key}
                currentName={raid.name}
                items={switchItems}
                theme="red"
            />
            
            <div className={styles.content}>
                {/* Raid Boss Banner */}
                <div className={styles.imageWrapper}>
                    <Image 
                        src={raid.image} 
                        alt="" 
                        fill 
                        className={styles.ambientBg} 
                    />
                    <Image 
                        src={raid.image} 
                        alt={raid.name} 
                        fill 
                        className={styles.mainImage} 
                        priority
                        sizes="(max-width: 1024px) 100vw, 288px"
                    />
                    <div className={styles.overlay} />
                </div>
                
                {/* Raid Info Section */}
                <div className={styles.info}>
                    <h1 className={styles.title}>
                        {raid.name}
                    </h1>
                    <p className={styles.subtitle}>
                        Optimized team configurations and strategic rotation sequences.
                    </p>
                </div>
            </div>
        </div>
    )
}
