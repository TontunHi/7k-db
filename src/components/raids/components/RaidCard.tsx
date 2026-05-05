import Link from 'next/link'
import Image from 'next/image'
import styles from './RaidCard.module.css'

export default function RaidCard({ raid }) {
    return (
        <Link href={`/raid/${raid.key}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.glow} />
                <Image
                    src={raid.image}
                    alt={raid.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            
            <div className={styles.nameWrapper}>
                <h3 className={styles.name}>
                    {raid.name}
                </h3>
                <div className={styles.underline} />
            </div>
        </Link>
    )
}
