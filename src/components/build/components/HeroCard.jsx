import SafeImage from "../../shared/SafeImage"
import styles from './HeroCard.module.css'

export default function HeroCard({ hero, onClick }) {
    return (
        <div
            onClick={() => onClick(hero)}
            className={styles.cardWrapper}
        >
            <div className={styles.card}>
                {/* Image */}
                <SafeImage
                    src={`/heroes/${hero.filename}${hero.filename?.endsWith('.webp') ? '' : '.webp'}`}
                    alt={hero.name}
                    fill
                    className={styles.heroImage}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                {/* Overlay Gradient */}
                <div className={styles.overlay} />

                {/* NEW Badge */}
                {hero.is_new_hero && (
                    <div className={styles.badgeWrapper}>
                        <div className={styles.newBadge}>
                            <div className={styles.badgeGlow} />
                            <div className={styles.badgeText}>
                                NEW HERO
                            </div>
                        </div>
                    </div>
                )}

                {/* Shine Effect */}
                <div className={styles.shine} />
            </div>
        </div>
    )
}
