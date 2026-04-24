import { Skull } from 'lucide-react'
import styles from './RaidHeader.module.css'

export default function RaidHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>

                <h1 className={styles.title}>
                    <span className={styles.redText}>RAIDS</span>
                </h1>
                <div className={styles.underline} />
            </div>

        </div>
    )
}
