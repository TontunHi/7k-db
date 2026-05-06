"use client"

import * as React from "react"
import styles from "../admin-dashboard.module.css"
import { Marker } from "./AdminEditorial"

export default function StatCard({ label, value, colorClass = "bg-primary" }) {
    return (
        <div className={styles.statCard}>
            <div className="flex items-start justify-between">
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>{label}</div>
                    <div className={styles.statValue}>{value}</div>
                </div>
                <Marker color={colorClass} className="h-8 w-1" />
            </div>
            <div className={styles.statGlow} style={{ background: `var(--${colorClass.replace('bg-', '')})`, opacity: 0.03 }} />
        </div>
    )
}
