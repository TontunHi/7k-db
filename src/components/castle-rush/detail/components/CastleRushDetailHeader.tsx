import Link from 'next/link'
import Image from 'next/image'
import { Crown, ArrowLeft } from 'lucide-react'
import styles from './CastleRushDetailHeader.module.css'

export default function CastleRushDetailHeader({ boss }) {
    return (
        <div className={styles.container}>
            <Link href="/castle-rush" className={styles.backLink}>
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Castle Rush</span>
            </Link>
            
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
