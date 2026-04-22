import Link from 'next/link'
import Image from 'next/image'
import styles from './DungeonCard.module.css'

export default function DungeonCard({ dungeon }) {
    return (
        <Link href={`/dungeon/${dungeon.key}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.glow} />
                <Image
                    src={dungeon.image}
                    alt={dungeon.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
            </div>
            
            <div className={styles.nameWrapper}>
                <h3 className={styles.name}>
                    {dungeon.name}
                </h3>
                <div className={styles.underline} />
            </div>
        </Link>
    )
}
