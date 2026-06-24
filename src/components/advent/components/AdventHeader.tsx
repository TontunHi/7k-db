import { Compass } from 'lucide-react'
import styles from './AdventHeader.module.css'
import { getLocale, getTranslations } from '@/lib/i18n'

export default async function AdventHeader() {
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    <span className={styles.violetText}>{lang === 'th' ? "บุกรุกท้าทาย" : "ADVENT"}</span>
                </h1>
                {lang !== 'th' && (
                    <h2 className={styles.subtitle}>
                        <span className={styles.purpleText}>EXPEDITION</span>
                    </h2>
                )}
                <div className={styles.underline} />
            </div>
        </div>
    )
}
