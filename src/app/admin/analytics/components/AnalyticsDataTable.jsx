"use client"

import styles from "./AnalyticsDataTable.module.css"
import { clsx } from "clsx"

/**
 * AnalyticsDataTable - Reusable table component for analytics rankings.
 */
export default function AnalyticsDataTable({ 
    title, 
    icon: Icon, 
    iconBgClass = "bg-blue-500/20", 
    iconColorClass = "text-blue-400",
    headers = ["Page Path", "Views"],
    data = [],
    renderRow
}) {
    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <div className={clsx(styles.iconBox, iconBgClass)}>
                    <Icon className={clsx("w-4 h-4", iconColorClass)} />
                </div>
                <h2 className={styles.title}>{title}</h2>
            </header>
            
            <div className={styles.tableWrapper}>
                {data.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {headers.map((h, i) => (
                                    <th key={i} className={clsx(styles.th, i === headers.length - 1 && "text-right")}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <tr key={idx} className={styles.tr}>
                                    {renderRow(item, styles)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>No data available yet.</div>
                )}
            </div>
        </div>
    )
}
