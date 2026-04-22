import Link from 'next/link'
import Image from 'next/image'
import { Skull, ArrowLeft } from 'lucide-react'
import styles from './RaidDetailHeader.module.css'

export default function RaidDetailHeader({ raid }) {
    return (
        <div className={styles.container}>
            <Link href="/raid" className={styles.backLink}>
                <ArrowLeft className={styles.backIcon} />
                <span>Return to Raids</span>
            </Link>
            
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
                    <div className={styles.badge}>
                        <Skull className={styles.badgeIcon} />
                        <span className={styles.badgeText}>Raid Intel</span>
                    </div>
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
