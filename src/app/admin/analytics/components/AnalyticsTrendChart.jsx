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
    const padMax = maxVal * 1.1 // Add some padding on top

    // Generate SVG path for Views
    const viewsPath = useMemo(() => {
        if (chartData.length < 2) return ""
        const points = chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * 100
            const y = 100 - ((d.views || 0) / padMax) * 100
            return `${x},${y}`
        })
        return `M ${points.join(" L ")}`
    }, [chartData, padMax])

    // Generate SVG path for Area (Views)
    const viewsAreaPath = useMemo(() => {
        if (chartData.length < 2) return ""
        const points = chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * 100
            const y = 100 - ((d.views || 0) / padMax) * 100
            return `${x},${y}`
        })
        return `M 0,100 L ${points.join(" L ")} L 100,100 Z`
    }, [chartData, padMax])

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

                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Area Gradient */}
                        <defs>
                            <linearGradient id="viewsGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Views Area */}
                        <path d={viewsAreaPath} fill="url(#viewsGradient)" className="transition-all duration-500" />

                        {/* Views Line */}
                        <path 
                            d={viewsPath} 
                            fill="none" 
                            stroke="var(--primary)" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="transition-all duration-500"
                            style={{ filter: 'drop-shadow(0 0 8px var(--primary-opacity))' }}
                        />

                        {/* Interactive Vertical Line */}
                        {hoverIndex !== null && (
                            <line 
                                x1={(hoverIndex / (chartData.length - 1)) * 100} 
                                x2={(hoverIndex / (chartData.length - 1)) * 100} 
                                y1="0" 
                                y2="100" 
                                stroke="var(--border)" 
                                strokeWidth="0.5" 
                                strokeDasharray="2,2" 
                            />
                        )}

                        {/* Markers for Visitors */}
                        {chartData.map((d, i) => {
                            const x = (i / (chartData.length - 1)) * 100
                            const y = 100 - ((d.visitors || 0) / padMax) * 100
                            return (
                                <circle 
                                    key={`v-${i}`}
                                    cx={x} 
                                    cy={y} 
                                    r="1.2" 
                                    fill="#ec4899" 
                                    className="transition-all duration-500"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.6))' }}
                                />
                            )
                        })}
                    </svg>

                    {/* Interaction Layer */}
                    <div className="absolute inset-0 flex">
                        {chartData.map((d, i) => (
                            <div 
                                key={i} 
                                className="flex-1 h-full cursor-crosshair group relative"
                                onMouseEnter={() => setHoverIndex(i)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                {hoverIndex === i && (
                                    <div className={styles.tooltip}>
                                        <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">{d.date}</div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-primary font-bold">Views:</span>
                                            <span className="font-mono">{d.views.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-pink-500 font-bold">Visitors:</span>
                                            <span className="font-mono">{d.visitors.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
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

