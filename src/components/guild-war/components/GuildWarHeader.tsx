import styles from './GuildWarHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function GuildWarHeader({ lastUpdated }) {
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className={styles.bannerWrapper}>
            {/* Cyber Corner Brackets */}
            <div className={`${styles.corner} ${styles.cornerTL}`} />
            <div className={`${styles.corner} ${styles.cornerTR}`} />
            <div className={`${styles.corner} ${styles.cornerBL}`} />
            <div className={`${styles.corner} ${styles.cornerBR}`} />

            {/* Background Effects */}
            <div className={styles.bannerGlow} />
            <div className={styles.tacticalGrid} />
            <div className={styles.scanline} />
            <div className={styles.movingScan} />

            {/* Floating Particles */}
            <div className={styles.particles}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={styles.particle} />
                ))}
            </div>

            <div className={styles.bannerContent}>
                {/* Left Side: Animated War HUD Graphic */}
                <div className={styles.hudGraphic}>
                    <svg viewBox="0 0 120 120" className={styles.hudSvg}>
                        {/* Outer dashed ring */}
                        <circle cx="60" cy="60" r="54" className={styles.hudOuterCircle} />
                        {/* Mid ring */}
                        <circle cx="60" cy="60" r="42" className={styles.hudMidCircle} />
                        {/* Inner solid ring */}
                        <circle cx="60" cy="60" r="28" className={styles.hudInnerCircle} />
                        {/* Crosshair */}
                        <line x1="60" y1="12" x2="60" y2="48" className={styles.hudLine} />
                        <line x1="60" y1="72" x2="60" y2="108" className={styles.hudLine} />
                        <line x1="12" y1="60" x2="48" y2="60" className={styles.hudLine} />
                        <line x1="72" y1="60" x2="108" y2="60" className={styles.hudLine} />
                        {/* Shield / War emblem in center */}
                        <path
                            d="M60 38 L72 44 L72 58 Q72 68 60 74 Q48 68 48 58 L48 44 Z"
                            className={styles.hudShield}
                        />
                        {/* Sword cross inside shield */}
                        <line x1="60" y1="46" x2="60" y2="66" className={styles.hudSword} />
                        <line x1="53" y1="52" x2="67" y2="52" className={styles.hudSword} />
                        {/* Corner tick marks */}
                        <line x1="22" y1="22" x2="32" y2="32" className={styles.hudTick} />
                        <line x1="98" y1="22" x2="88" y2="32" className={styles.hudTick} />
                        <line x1="22" y1="98" x2="32" y2="88" className={styles.hudTick} />
                        <line x1="98" y1="98" x2="88" y2="88" className={styles.hudTick} />
                    </svg>
                </div>

                {/* Center: Title Group */}
                <div className={styles.titleGroup}>
                    {/* Sub-label */}
                    <div className={styles.subLabel}>
                        <span className={styles.subLabelDot} />
                        <span className={styles.subLabelText}>Guild Battle Formation</span>
                    </div>

                    <h1 className={styles.title}>
                        {t("guild_war.title", "GUILD WAR").toUpperCase()}
                    </h1>

                </div>

                {/* Right Side: Update Badge */}
                {lastUpdated && (
                    <div className={styles.rightPanel}>
                        <div className={styles.updateBadge}>
                            <div className={styles.pulse} />
                            <span className={styles.updateText}>{t("arena.last_update", "Last Update")}</span>
                            <div className={styles.divider} />
                            <span className={styles.updateDate}>{lastUpdated}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
