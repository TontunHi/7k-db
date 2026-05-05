import Link from 'next/link'
import Image from 'next/image'
import { Crown } from 'lucide-react'
import styles from './CastleRushCard.module.css'

export default function CastleRushCard({ boss }) {
    return (
        <Link href={`/castle-rush/${boss.key}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.glow} />
                <Image
                    src={boss.image}
                    alt={boss.name}
                    fill
                    className={styles.image}
                    sizes="100vw"
                />
                <div className={styles.overlayTop} />
                <div className={styles.overlayRight} />
            </div>

            <div className={styles.content}>

                <h3 className={styles.name}>
                    {boss.name}
                </h3>
                <div className={styles.underline} />
            </div>
        </Link>
    )
}
