"use client"

import styles from "./AnalyticsDataTable.module.css"
import { clsx } from "clsx"

export default function AnalyticsDataTable({ 
    title, 
    icon: Icon, 
    headers = ["Page Path", "Views"],
    data = [],
    iconBgClass,
    iconColorClass,
    renderRow
}) {
    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={clsx(styles.iconBox, iconBgClass)}>
                        <Icon className={clsx(styles.icon, iconColorClass)} />
                    </div>
                    <h2 className={styles.title}>{title}</h2>
                </div>
            </header>
            
            <div className={styles.tableWrapper}>
                {data.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {headers.map((h, i) => (
                                    <th key={i} className={clsx(styles.th, i === headers.length - 1 && styles.textRight)}>
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
