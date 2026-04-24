import SafeImage from "../../shared/SafeImage"
import styles from './HeroCard.module.css'

export default function HeroCard({ hero, onClick }) {
    return (
        <div
            onClick={() => onClick(hero)}
            className={styles.cardWrapper}
        >
            <div className={styles.card}>
                {/* Hero Image */}
                <SafeImage
                    src={`/heroes/${hero.filename}${hero.filename?.endsWith('.webp') ? '' : '.webp'}`}
                    alt={hero.name}
                    fill
                    className={styles.heroImage}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                {/* Aesthetic Overlays */}
                <div className={styles.overlay} />
                <div className={styles.shine} />

                {/* NEW Badge */}
                {hero.is_new_hero && (
                    <div className={styles.badgeWrapper}>
                        <div className={styles.newBadge}>
                            NEW
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

