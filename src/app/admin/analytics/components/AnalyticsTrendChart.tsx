"use client"

import { useMemo, useState, useRef } from "react"
import styles from "../analytics.module.css"

const W = 800
const H = 240
const PAD = { top: 16, right: 16, bottom: 32, left: 48 }

function smoothPath(points) {
    if (points.length < 2) return ""
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
        const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.4
        const cp1y = points[i].y
        const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) * 0.4
        const cp2y = points[i + 1].y
        d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${points[i + 1].x} ${points[i + 1].y}`
    }
    return d
}

function areaPath(linePath, points, floorY) {
    if (!points.length) return ""
    return (
        linePath +
        ` L ${points[points.length - 1].x} ${floorY} L ${points[0].x} ${floorY} Z`
    )
}

export default function AnalyticsTrendChart({ data = [], title = "Traffic Trend" }) {
    const [hover, setHover] = useState(null)
    const svgRef = useRef(null)

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return []
        return data.slice(-30)
    }, [data])

    const maxVal = useMemo(() => {
        if (!chartData.length) return 1
        return Math.max(...chartData.map(d => Math.max(d.views || 0, d.visitors || 0))) * 1.15 || 1
    }, [chartData])

    const yTicks = useMemo(() => {
        const step = Math.ceil(maxVal / 4)
        return [0, step, step * 2, step * 3, step * 4]
    }, [maxVal])

    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const toX = (i) => PAD.left + (i / (chartData.length - 1 || 1)) * innerW
    const toY = (v) => PAD.top + innerH - (v / maxVal) * innerH

    const viewPoints = chartData.map((d, i) => ({ x: toX(i), y: toY(d.views || 0) }))
    const visitorPoints = chartData.map((d, i) => ({ x: toX(i), y: toY(d.visitors || 0) }))

    const viewLine = smoothPath(viewPoints)
    const visitorLine = smoothPath(visitorPoints)
    const floorY = PAD.top + innerH
    const viewArea = areaPath(viewLine, viewPoints, floorY)
    const visitorArea = areaPath(visitorLine, visitorPoints, floorY)

    const handleMouseMove = (e) => {
        if (!svgRef.current || !chartData.length) return
        const rect = svgRef.current.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * W - PAD.left
        const idx = Math.round((mx / innerW) * (chartData.length - 1))
        const clamped = Math.max(0, Math.min(chartData.length - 1, idx))
        setHover(clamped)
    }

    return (
        <div className={styles.chartCard} style={{ gap: '1.5rem' }}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        {title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        Last 30 Days · Live Telemetry
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-[2px] rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-[2px] rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Visitors</span>
                    </div>
                </div>
            </div>

            {/* SVG Chart */}
            <div className="relative">
                {chartData.length === 0 ? (
                    <div className="h-[240px] flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
                            NO_TELEMETRY_DATA
                        </span>
                    </div>
                ) : (
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${W} ${H}`}
                        className="w-full"
                        style={{ height: 240, overflow: 'visible' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHover(null)}
                    >
                        <defs>
                            {/* Views gradient */}
                            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                            </linearGradient>
                            {/* Visitors gradient */}
                            <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                            </linearGradient>
                            {/* Glow filter */}
                            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>

                        {/* Y-axis grid lines & labels */}
                        {yTicks.map((tick, i) => {
                            const y = toY(tick)
                            return (
                                <g key={i}>
                                    <line
                                        x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                                        stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
                                    />
                                    <text
                                        x={PAD.left - 8} y={y + 4}
                                        textAnchor="end"
                                        fontSize="9"
                                        fontWeight="700"
                                        fill="currentColor"
                                        opacity="0.35"
                                        fontFamily="monospace"
                                    >
                                        {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                                    </text>
                                </g>
                            )
                        })}

                        {/* X-axis date labels (every 5th) */}
                        {chartData.map((d, i) => {
                            if (i % 5 !== 0) return null
                            return (
                                <text
                                    key={i}
                                    x={toX(i)}
                                    y={H - 4}
                                    textAnchor="middle"
                                    fontSize="8"
                                    fontWeight="700"
                                    fill="currentColor"
                                    opacity="0.3"
                                >
                                    {d.date?.split('-').slice(1).join('/')}
                                </text>
                            )
                        })}

                        {/* Area fills */}
                        <path d={viewArea} fill="url(#viewsGrad)" />
                        <path d={visitorArea} fill="url(#visitorsGrad)" />

                        {/* Lines */}
                        <path d={viewLine} fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" filter="url(#glowGold)" />
                        <path d={visitorLine} fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" filter="url(#glowPink)" />

                        {/* Hover crosshair + dots */}
                        {hover !== null && viewPoints[hover] && (
                            <g>
                                {/* Vertical guide */}
                                <line
                                    x1={viewPoints[hover].x} y1={PAD.top}
                                    x2={viewPoints[hover].x} y2={floorY}
                                    stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 3"
                                />
                                {/* Views dot */}
                                <circle cx={viewPoints[hover].x} cy={viewPoints[hover].y} r="5" fill="#FFD700" opacity="0.9" />
                                <circle cx={viewPoints[hover].x} cy={viewPoints[hover].y} r="9" fill="#FFD700" opacity="0.15" />
                                {/* Visitors dot */}
                                <circle cx={visitorPoints[hover].x} cy={visitorPoints[hover].y} r="5" fill="#ec4899" opacity="0.9" />
                                <circle cx={visitorPoints[hover].x} cy={visitorPoints[hover].y} r="9" fill="#ec4899" opacity="0.15" />
                            </g>
                        )}
                    </svg>
                )}

                {/* Floating tooltip (HTML overlay) */}
                {hover !== null && chartData[hover] && viewPoints[hover] && (() => {
                    const d = chartData[hover]
                    const xPct = ((viewPoints[hover].x - PAD.left) / innerW) * 100
                    const isRight = xPct > 65
                    return (
                        <div
                            className="absolute top-0 pointer-events-none z-50"
                            style={{
                                left: isRight ? 'auto' : `calc(${xPct}% + 16px)`,
                                right: isRight ? `calc(${100 - xPct}% + 16px)` : 'auto',
                                top: '10%',
                            }}
                        >
                            <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl min-w-[140px]">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2.5 border-b border-white/10 pb-2">
                                    {d.date}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />
                                            <span className="text-[10px] font-bold text-white/60">Views</span>
                                        </div>
                                        <span className="font-mono text-xs font-black text-[#FFD700]">
                                            {d.views?.toLocaleString() ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
                                            <span className="text-[10px] font-bold text-white/60">Visitors</span>
                                        </div>
                                        <span className="font-mono text-xs font-black text-pink-400">
                                            {d.visitors?.toLocaleString() ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })()}
            </div>

            {/* Footer */}
            <div className={styles.chartFooter}>
                <p>Telemetry active · Encrypted processing · Zero PII exposure</p>
            </div>
        </div>
    )
}
