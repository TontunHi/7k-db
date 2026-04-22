import { Skull } from 'lucide-react'
import styles from './RaidHeader.module.css'

export default function RaidHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <div className={styles.iconWrapper}>
                    <Skull className={styles.icon} />
                </div>
                <h1 className={styles.title}>
                    <span className={styles.redText}>RAIDS</span>
                </h1>
                <div className={styles.underline} />
            </div>
            <p className={styles.subtitle}>
                Team compositions and skill rotations for raid bosses.
            </p>
        </div>
    )
}
