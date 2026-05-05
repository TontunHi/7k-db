"use client"

import { 
    BarChart3, 
    Users, 
    MousePointerClick, 
    TrendingUp, 
    Hand, 
    MousePointer2 
} from "lucide-react"
import AnalyticsStatCard from "./AnalyticsStatCard"
import AnalyticsDataTable from "./AnalyticsDataTable"
import AnalyticsFilterTable from "./AnalyticsFilterTable/AnalyticsFilterTable"
import AnalyticsTrendChart from "./AnalyticsTrendChart"
import styles from "../analytics.module.css"
import { clsx } from "clsx"

import { useRouter } from "next/navigation"

/**
 * AnalyticsDashboardView - Main orchestrator for Analytics Dashboard
 */
export default function AnalyticsDashboardView({ data }) {
    const { reach, growth, conversion, exits } = data
    const router = useRouter()

    return (
        <div className={styles.page}>
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={styles.bottomGlow} />
            </div>

            <div className={styles.content}>
                {/* Header Section */}
                <header className={styles.header}>
                    <div className={styles.headerFlex}>
                        <div className={styles.headerContent}>
                            <div className={styles.iconBox}>
                                <BarChart3 className={styles.icon} />
                            </div>
                            <div>
                                <h1 className={styles.title}>
                                    Internal <span className={styles.titleAccent}>Analytics</span>
                                </h1>
                                <p className={styles.subtitle}>
                                    Privacy-first internal metrics to measure your success.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-muted-foreground opacity-50">Operational Status</span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Telemetry Synchronized
                                </span>
                            </div>
                            <button 
                                onClick={() => router.refresh()}
                                className="flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all shadow-xl active:scale-95"
                            >
                                <TrendingUp size={14} className="text-primary" />
                                Synchronize Intel
                            </button>
                        </div>
                    </div>
                </header>

                {/* KPI Stat Cards */}
                <div className={styles.kpiGrid}>
                    <AnalyticsStatCard 
                        label="Total Page Views" 
                        value={reach.pv.toLocaleString()} 
                        icon={BarChart3} 
                        variant="blue" 
                        description="Global engagement volume"
                    />
                    <AnalyticsStatCard 
                        label="Unique Visitors" 
                        value={reach.uv.toLocaleString()} 
                        icon={Users} 
                        variant="purple" 
                        description="Distinct tactical operatives"
                    />
                </div>

                {/* Main Insight Section */}
                <div className={styles.dashboardGrid}>
                    <div className={styles.gridMain}>
                        {/* Trend Visualization */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Traffic Analysis</h3>
                            </div>
                            <AnalyticsTrendChart data={data.trend} />
                        </section>

                        {/* Custom Filter Log */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">In-Depth Event Logging</h3>
                            </div>
                            <AnalyticsFilterTable />
                        </section>
                    </div>

                    <div className={styles.gridSide}>
                        {/* Ranking Tables */}
                        <section className="space-y-6">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-2 mb-4">Strategic Rankings</h3>
                                <div className="space-y-6">
                                    <AnalyticsDataTable 
                                        title="Top 10 Hero Builds"
                                        icon={Users}
                                        iconBgClass="bg-pink-500/20"
                                        iconColorClass="text-pink-400"
                                        data={growth}
                                        renderRow={(item, s) => {
                                            const maxViews = growth[0]?.views || 1
                                            const percent = (item.views / maxViews) * 100
                                            return (
                                                <>
                                                    <td className={clsx(s.td, s.pathCell)}>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="font-bold text-foreground">{item.page_path.split('/').pop().replace(/_/g, ' ')}</span>
                                                            <span className="text-[10px] opacity-50">{item.page_path}</span>
                                                            <div className="w-full h-1 bg-background rounded-full overflow-hidden mt-1">
                                                                <div 
                                                                    className="h-full bg-pink-500 transition-all duration-1000" 
                                                                    style={{ width: `${percent}%` }} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={s.valueCell}>
                                                        <span className="text-pink-400">{item.views.toLocaleString()}</span>
                                                    </td>
                                                </>
                                            )
                                        }}
                                    />

                                    <AnalyticsDataTable 
                                        title="Top Exit Pages"
                                        icon={Hand}
                                        iconBgClass="bg-red-500/20"
                                        iconColorClass="text-red-400"
                                        data={exits}
                                        headers={["Page Path", "Exits"]}
                                        renderRow={(item, s) => {
                                            const maxExits = exits[0]?.exits || 1
                                            const percent = (item.exits / maxExits) * 100
                                            return (
                                                <>
                                                    <td className={clsx(s.td, s.pathCell)}>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-medium text-foreground">{item.page_path}</span>
                                                            <div className="w-full h-1 bg-background rounded-full overflow-hidden mt-1">
                                                                <div 
                                                                    className="h-full bg-red-500 transition-all duration-1000" 
                                                                    style={{ width: `${percent}%` }} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={s.valueCell}>
                                                        <span className="text-red-400">{item.exits.toLocaleString()}</span>
                                                    </td>
                                                </>
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
