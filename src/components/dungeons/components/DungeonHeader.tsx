import { Landmark } from 'lucide-react'
import styles from './DungeonHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function DungeonHeader() {
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    <span className={styles.goldText}>{t("dungeon.title", "DUNGEONS").toUpperCase()}</span>
                </h1>
                <div className={styles.underline} />
            </div>
        </div>
    )
}
