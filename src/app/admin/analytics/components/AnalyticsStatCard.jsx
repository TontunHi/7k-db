"use client"

import styles from "./AnalyticsStatCard.module.css"
import { clsx } from "clsx"

export default function AnalyticsStatCard({ label, value, icon: Icon, variant = "blue" }) {
    return (
        <div className={clsx(styles.card, styles[variant])}>
            <div className={styles.glow} />
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                </div>
                <h2 className={styles.label}>{label}</h2>
            </div>
            <div className={styles.content}>
                <p className={styles.value}>{value}</p>
            </div>
        </div>
    )
}
