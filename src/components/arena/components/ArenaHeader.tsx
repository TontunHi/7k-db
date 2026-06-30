import styles from './ArenaHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function ArenaHeader({ lastUpdated }) {
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
            
            <div className={styles.bannerGlow} />
            <div className={styles.tacticalGrid} />
            <div className={styles.scanline} />
            
            <div className={styles.bannerContent}>
                {/* Left Side: Animated SVG HUD */}
                <div className={styles.hudGraphic}>
                    <svg viewBox="0 0 100 100" className={styles.hudSvg}>
                        <circle cx="50" cy="50" r="45" className={styles.hudOuterCircle} />
                        <circle cx="50" cy="50" r="35" className={styles.hudInnerCircle} />
                        <path d="M 30,50 L 70,50 M 50,30 L 50,70" className={styles.hudCrosshair} />
                        <path d="M25,75 L45,55 L50,60 L30,80 Z M75,75 L55,55 L50,60 L70,80 Z M40,40 L65,15 L70,20 L45,45 Z M60,40 L35,15 L30,20 L55,45 Z" fill="#60a5fa" className={styles.hudSwords} />
                    </svg>
                </div>

                {/* Center: Title Group */}
                <div className={styles.titleGroup}>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">PVP Team Comp</span>
                    </div>
                    
                    <h1 className={styles.title}>
                        {t("arena.title", "ARENA").toUpperCase()}
                    </h1>
                </div>

                {/* Right Side: Meta Status */}
                {lastUpdated && (
                    <div className={styles.metaStatus}>
                        <span className={styles.statusText}>{t("arena.last_update", "LAST SYNC")}</span>
                        <div className={styles.statusDivider} />
                        <span className={styles.dateText}>{lastUpdated}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
