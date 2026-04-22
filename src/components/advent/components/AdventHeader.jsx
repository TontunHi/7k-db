import { Compass } from 'lucide-react'
import styles from './AdventHeader.module.css'

export default function AdventHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <div className={styles.iconWrapper}>
                    <Compass className={styles.icon} />
                </div>
                <h1 className={styles.title}>
                    <span className={styles.violetText}>ADVENT</span>
                </h1>
                <h2 className={styles.subtitle}>
                    <span className={styles.purpleText}>EXPEDITION</span>
                </h2>
                <div className={styles.underline} />
            </div>
        </div>
    )
}
