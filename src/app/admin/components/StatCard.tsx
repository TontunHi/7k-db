"use client"

import * as React from "react"
import styles from "../admin-dashboard.module.css"
import { Marker } from "./AdminEditorial"

export default function StatCard({ label, value, colorClass }) {
    const [decorId, setDecorId] = React.useState(0)
    
    React.useEffect(() => {
        setDecorId(Math.floor(Math.random() * 9) + 1)
    }, [])

    return (
        <div className={styles.statCard}>
            <div className={styles.statHeader}>
                <Marker color={colorClass?.replace('text-', 'bg-')} />
                <div className={styles.statGlow} />
            </div>
            <div className="relative z-10">
                <div className={styles.statLabel}>{label}</div>
                <div className={styles.statValue}>{value}</div>
            </div>
            <div className={styles.statDecor}>0{decorId || 1}</div>
        </div>
    )
}
