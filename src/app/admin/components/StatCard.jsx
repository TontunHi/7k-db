"use client"

import styles from "../admin-dashboard.module.css"
import { Activity } from "lucide-react"

export default function StatCard({ label, value, icon: Icon, colorClass }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statHeader}>
                <div className={`${styles.statIconBox} ${colorClass}`}>
                    <Icon size={18} />
                </div>
                <Activity size={14} className={styles.statPulse} />
            </div>
            <div>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
            </div>
            <div className={styles.statGlow} />
        </div>
    )
}
