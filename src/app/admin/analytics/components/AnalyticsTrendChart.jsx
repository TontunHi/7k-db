"use client"

import { useMemo, useState } from "react"
import styles from "../analytics.module.css"
import { clsx } from "clsx"

export default function AnalyticsTrendChart({ data = [], title = "Tactical Engagement Trend" }) {
    const [hoverIndex, setHoverIndex] = useState(null)
    
    // Process data to ensure we have a good view
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return []
        // Last 30 days of data
        return data.slice(-30)
    }, [data])

    const stats = useMemo(() => {
        if (chartData.length === 0) return { maxViews: 1, maxVisitors: 1 }
        return {
            maxViews: Math.max(...chartData.map(d => d.views || 0)),
            maxVisitors: Math.max(...chartData.map(d => d.visitors || 0))
        }
    }, [chartData])

    const maxVal = Math.max(stats.maxViews, stats.maxVisitors) || 1
    const padMax = maxVal * 1.1

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>{title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mt-1">Live Operational Metrics · Last 30 Cycles</p>
                </div>
                <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: 'var(--primary)' }} />
                        <span>Total Views</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#ec4899', boxShadow: '0 0 10px rgba(236, 72, 153, 0.4)' }} />
                        <span>Unique Visitors</span>
                    </div>
                </div>
            </div>

            <div className={styles.chartBody}>
                {/* Y-Axis Labels */}
                <div className={styles.yAxis}>
                    <span>{Math.round(padMax)}</span>
                    <span>{Math.round(padMax / 2)}</span>
                    <span>0</span>
                </div>

                <div className={styles.chartContainer}>
                    <div className={styles.gridLines}>
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                    </div>

                    <div className="flex items-end h-full w-full gap-[2px] px-2 relative z-10">
                        {chartData.map((d, i) => {
                            const viewsHeight = (d.views / padMax) * 100
                            const visitorsHeight = (d.visitors / padMax) * 100
                            
                            return (
                                <div 
                                    key={i} 
                                    className="flex-1 h-full flex items-end justify-center gap-[1px] group relative"
                                    onMouseEnter={() => setHoverIndex(i)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                >
                                    {/* Views Bar */}
                                    <div 
                                        className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300 rounded-t-[2px]"
                                        style={{ height: `${viewsHeight}%` }}
                                    >
                                        <div className="absolute inset-0 bg-primary opacity-20 blur-[4px] -z-10 group-hover:opacity-40 transition-opacity" />
                                    </div>

                                    {/* Visitors Bar */}
                                    <div 
                                        className="w-full bg-pink-500/80 group-hover:bg-pink-500 transition-all duration-300 rounded-t-[2px]"
                                        style={{ height: `${visitorsHeight}%` }}
                                    >
                                        <div className="absolute inset-0 bg-pink-500 opacity-20 blur-[4px] -z-10 group-hover:opacity-40 transition-opacity" />
                                    </div>

                                    {/* Tooltip */}
                                    {hoverIndex === i && (
                                        <div className={styles.tooltip}>
                                            <div className="text-[10px] font-black uppercase text-muted-foreground mb-2 pb-1 border-b border-border/50">
                                                {d.date}
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        <span className="text-[10px] font-bold text-foreground/70">Views</span>
                                                    </div>
                                                    <span className="font-mono text-xs font-black">{d.views.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                                        <span className="text-[10px] font-bold text-foreground/70">Visitors</span>
                                                    </div>
                                                    <span className="font-mono text-xs font-black text-pink-500">{d.visitors.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
                        {chartData.filter((_, i) => i % 5 === 0).map((d, i) => (
                            <span key={i} className="text-[8px] font-black uppercase text-muted-foreground opacity-50">
                                {d.date.split('-').slice(1).join('/')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className={styles.chartFooter}>
                <p>Telemetry protocols active · Encrypted log processing · Zero PII exposure</p>
            </div>
        </div>
    )
}

