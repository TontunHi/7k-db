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
import styles from "../analytics.module.css"
import { clsx } from "clsx"

/**
 * AnalyticsDashboardView - Main orchestrator for Analytics Dashboard
 */
export default function AnalyticsDashboardView({ data }) {
    const { reach, growth, conversion, exits } = data

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.headerCard}>
                <div className={styles.gridOverlay} />
                <div className={styles.glow} />
                
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
            </header>

            {/* KPI Stat Cards */}
            <div className={styles.kpiGrid}>
                <AnalyticsStatCard 
                    label="Total Page Views" 
                    value={reach.pv.toLocaleString()} 
                    icon={BarChart3} 
                    variant="blue" 
                />
                <AnalyticsStatCard 
                    label="Unique Visitors" 
                    value={reach.uv.toLocaleString()} 
                    icon={Users} 
                    variant="purple" 
                />
                <AnalyticsStatCard 
                    label="Ad / Link Clicks" 
                    value={conversion.totalClicks.toLocaleString()} 
                    icon={MousePointerClick} 
                    variant="amber" 
                />
                <AnalyticsStatCard 
                    label="Estimated CTR" 
                    value={`${conversion.ctr}%`} 
                    icon={TrendingUp} 
                    variant="emerald" 
                />
            </div>

            {/* Ranking Tables */}
            <div className={styles.tablesGrid}>
                <AnalyticsDataTable 
                    title="Top 10 Hero Builds"
                    icon={Users}
                    iconBgClass="bg-pink-500/20"
                    iconColorClass="text-pink-400"
                    data={growth}
                    renderRow={(item, s) => (
                        <>
                            <td className={clsx(s.td, s.pathCell)}>{item.page_path}</td>
                            <td className={s.valueCell}>{item.views.toLocaleString()}</td>
                        </>
                    )}
                />

                <AnalyticsDataTable 
                    title="Top Exit Pages"
                    icon={Hand}
                    iconBgClass="bg-red-500/20"
                    iconColorClass="text-red-400"
                    data={exits}
                    headers={["Page Path", "Exits"]}
                    renderRow={(item, s) => (
                        <>
                            <td className={clsx(s.td, s.pathCell)}>{item.page_path}</td>
                            <td className={s.valueCell}>{item.exits.toLocaleString()}</td>
                        </>
                    )}
                />
            </div>

            {/* Click Breakdown Table */}
            <AnalyticsDataTable 
                title="Click Conversion Breakdown"
                icon={MousePointer2}
                iconBgClass="bg-amber-500/20"
                iconColorClass="text-amber-400"
                headers={["Link ID", "Destination URL", "Clicks"]}
                data={conversion.clicksByLink}
                renderRow={(item, s) => (
                    <>
                        <td className={clsx(s.td, s.accentAmber)}>{item.link_id || 'N/A'}</td>
                        <td className={clsx(s.td, s.mono)}>{item.link_url}</td>
                        <td className={s.valueCell}>{item.clicks.toLocaleString()}</td>
                    </>
                )}
            />

            {/* Custom Filter Log */}
            <AnalyticsFilterTable />
        </div>
    )
}
