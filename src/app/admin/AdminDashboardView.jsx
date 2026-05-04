"use client"

import { SectionHeader, SystemBadge, Marker } from "./components/AdminEditorial"
import StatCard from "./components/StatCard"
import ToolCard from "./components/ToolCard"
import ActivityFeed from "./components/ActivityFeed"
import { DASHBOARD_CATEGORIES, SYSTEM_TOOLS } from "./constants"
import styles from "./admin-dashboard.module.css"
import Link from "next/link"

export default function AdminDashboardView({ user, stats, recentLogs }) {
    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true
        return user?.permissions?.includes(perm) || user?.permissions?.includes('*')
    }

    const filteredCategories = DASHBOARD_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            if (item.superOnly && user?.role !== 'super_admin') return false
            return hasPermission(item.perm)
        })
    })).filter(cat => cat.items.length > 0)

    const statCards = [
        { label: "Total Reach", value: stats.views.toLocaleString(), colorClass: "text-blue-500" },
        { label: "Unique Users", value: stats.visitors.toLocaleString(), colorClass: "text-emerald-500" },
        { label: "Raid Assets", value: stats.raidSets, colorClass: "text-red-500" },
        { label: "PVE Guides", value: stats.stages, colorClass: "text-amber-500" },
    ]

    return (
        <div className={styles.dashboard}>
            {/* Command Center Header */}
            <div className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroGrid}>
                    <div className={styles.heroContent}>
                        <div className={styles.versionBadge}>
                            <SystemBadge variant="active">SECURE ACCESS</SystemBadge>

                        </div>
                        <h1 className={styles.title}>
                            <span className="italic">ADMIN</span> <span className={styles.titleAccent}>COMMAND</span>
                        </h1>
                        <p className={styles.description}>
                            Centralized logistics for <span className={styles.highlight}>{user?.username}</span>.
                            Global tactical adjustments are deployed from this terminal.
                        </p>
                    </div>

                    <div className={styles.statsGrid}>
                        {statCards.map((s, i) => (
                            <StatCard key={i} {...s} />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.mainLayout}>
                {/* Tools Grid */}
                <div className={styles.toolsArea}>
                    {filteredCategories.map((category, idx) => (
                        <div key={idx} className={styles.categorySection}>
                            <div className={styles.categoryHeader}>
                                <SectionHeader title={category.title} />
                            </div>

                            <div className={styles.toolGrid}>
                                {category.items.map((tool) => (
                                    <ToolCard key={tool.title} {...tool} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity Feed Sidebar */}
                <div className="space-y-10">
                    <ActivityFeed logs={recentLogs} />
                </div>
            </div>
        </div>
    )
}
