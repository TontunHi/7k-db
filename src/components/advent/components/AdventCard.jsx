import Link from 'next/link'
import Image from 'next/image'
import { Compass } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './AdventCard.module.css'

export default function AdventCard({ boss }) {
    const isSpecial = boss.key === 'ae_god_of_destruction';
    
    return (
        <Link 
            href={`/advent/${boss.key}`} 
            className={clsx(styles.card, isSpecial && styles.special)}
        >
            <div className={styles.imageWrapper}>
                <div className={styles.glow} />
                
                <div className={styles.imageContainer}>
                    <Image
                        src={boss.image}
                        alt={boss.name}
                        fill
                        className={clsx(styles.image, isSpecial && styles.objectTop)}
                        sizes={isSpecial 
                            ? "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw" 
                            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        }
                    />
                    <div className={styles.imageOverlay} />
                </div>

                <div className={styles.accentTopLeft} />
                <div className={styles.accentBottomRight} />

                <div className={styles.content}>
                    <h3 className={styles.name}>
                        {boss.name}
                        <div className={styles.nameIconWrapper}>
                            <Compass className={styles.nameIcon} />
                        </div>
                    </h3>
                    <div className={styles.underline} />
                </div>
            </div>
        </Link>
    )
}
