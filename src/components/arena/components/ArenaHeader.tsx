import { Swords } from 'lucide-react'
import styles from './ArenaHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function ArenaHeader({ lastUpdated }) {
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className={styles.header}>
            <div className={styles.headerGlow} />
            <div className={styles.tacticalGrid} />
            <div className={styles.horizontalLines} />
            
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    {t("arena.title", "ARENA").toUpperCase()}
                </h1>
                <div className={styles.titleShadow}>{t("arena.title", "ARENA").toUpperCase()}</div>
            </div>
            
            {lastUpdated && (
                <div className={styles.metaStatus}>
                    <div className={styles.statusPulse} />
                    <span className={styles.statusText}>{t("arena.last_update", "Last Update :")}</span>
                    <div className={styles.statusDivider} />
                    <span className={styles.dateText}>{lastUpdated}</span>
                </div>
            )}
        </div>
    )
}
