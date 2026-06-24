import { Crown } from 'lucide-react'
import styles from './CastleRushHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function CastleRushHeader() {
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    <span className={styles.goldText}>{t("castle_rush.title", "CASTLE RUSH").toUpperCase()}</span>
                </h1>
                <div className={styles.underline} />
            </div>
        </div>
    )
}
