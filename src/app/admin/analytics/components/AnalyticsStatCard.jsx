"use client"

import styles from "./AnalyticsStatCard.module.css"
import { clsx } from "clsx"

/**
 * AnalyticsStatCard - Displays a single KPI metric with an icon and specific color theme.
 */
export default function AnalyticsStatCard({ label, value, icon: Icon, variant = "blue" }) {
    return (
        <div className={clsx(styles.card, styles[variant])}>
            <div className={styles.iconWrapper}>
                <Icon className={styles[`${variant}Icon`]} size={32} />
            </div>
            <h2 className={styles.label}>{label}</h2>
            <p className={styles.value}>{value}</p>
        </div>
    )
}
