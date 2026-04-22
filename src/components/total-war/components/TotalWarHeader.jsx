import { Swords } from 'lucide-react'
import styles from './TotalWarHeader.module.css'

export default function TotalWarHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.badge}>
                <Swords className={styles.icon} />
            </div>
            
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    <span className={styles.gradientText}>TOTAL WAR</span>
                </h1>
                <div className={styles.bar} />
            </div>
            
            <p className={styles.subtitle}>
                Select a tier to view recommended teams and skill rotations
            </p>
        </div>
    )
}
