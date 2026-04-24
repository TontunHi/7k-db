"use client"

import { useMemo } from "react"
import styles from "../analytics.module.css"

export default function AnalyticsTrendChart({ data = [], title = "Page View Trend (Last 30 Days)" }) {
    const maxViews = useMemo(() => {
        if (data.length === 0) return 1
        return Math.max(...data.map(d => d.views))
    }, [data])

    // Fill missing days to ensure a continuous line
    const chartData = useMemo(() => {
        if (data.length === 0) return []
        
        // Simple visualization: take the last 30 entries
        return data.slice(-30)
    }, [data])

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>{title}</h3>
                <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} />
                        <span>Daily Views</span>
                    </div>
                </div>
            </div>

            <div className={styles.chartBody}>
                <div className={styles.yAxis}>
                    <span>{maxViews}</span>
                    <span>{Math.round(maxViews / 2)}</span>
                    <span>0</span>
                </div>

                <div className={styles.chartContainer}>
                    <div className={styles.gridLines}>
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                    </div>

                    <div className={styles.bars}>
                        {chartData.map((d, i) => {
                            const height = (d.views / maxViews) * 100
                            return (
                                <div key={i} className={styles.barWrapper} title={`${d.date}: ${d.views} views`}>
                                    <div 
                                        className={styles.bar} 
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className={styles.barGlow} />
                                    </div>
                                    <span className={styles.barLabel}>
                                        {d.date.split('-')[2]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            <div className={styles.chartFooter}>
                <p>Metrics aggregated from internal server logs.</p>
            </div>
        </div>
    )
}
