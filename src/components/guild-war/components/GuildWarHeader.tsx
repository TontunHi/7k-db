import styles from './GuildWarHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function GuildWarHeader({ lastUpdated }) {
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className={styles.header}>
            {/* Advanced Decorative Elements */}
            <div className={styles.headerGlow} />
            <div className={styles.tacticalGrid} />
            <div className={styles.horizontalLines} />
            <div className={styles.movingScan} />
            
            {/* Particle Elements */}
            <div className={styles.particles}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.particle} />
                ))}
            </div>
            
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    {t("guild_war.title", "GUILD WAR").toUpperCase()}
                </h1>
            </div>

            {lastUpdated && (
                <div className={styles.updateBadge}>
                    <div className={styles.pulse} />
                    <span className={styles.updateText}>{t("arena.last_update", "Last Update :")}</span>
                    <div className={styles.divider} />
                    <span className={styles.updateDate}>{lastUpdated}</span>
                </div>
            )}
        </div>
    )
}
