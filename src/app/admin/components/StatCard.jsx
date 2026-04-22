import { Activity } from "lucide-react"
import styles from "../admin-dashboard.module.css"

export default function StatCard({ label, value, icon: Icon, colorClass }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statHeader}>
                <Icon className={colorClass} size={20} />
                <Activity size={12} className={styles.statPulse} />
            </div>
            <div>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
            </div>
        </div>
    )
}
