import Link from 'next/link'
import Image from 'next/image'
import { Landmark, ArrowLeft } from 'lucide-react'
import styles from './DungeonDetailHeader.module.css'

export default function DungeonDetailHeader({ dungeon }) {
    return (
        <div className={styles.container}>
            <Link href="/dungeon" className={styles.backLink}>
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dungeons</span>
            </Link>
            
            <div className={styles.content}>
                {/* Dungeon Image */}
                <div className={styles.imageWrapper}>
                    <Image 
                        src={dungeon.image} 
                        alt={dungeon.name} 
                        fill 
                        className={styles.image} 
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    />
                </div>
                
                {/* Dungeon Info */}
                <div className={styles.info}>
                    <div className={styles.badge}>
                        <Landmark className={styles.badgeIcon} />
                        <span className={styles.badgeText}>Dungeon Guide</span>
                    </div>
                    <h1 className={styles.title}>
                        {dungeon.name}
                    </h1>
                    <div className={styles.underline}></div>
                </div>
            </div>
        </div>
    )
}
