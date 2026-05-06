"use client"

import React from "react"
import styles from "./admin-dashboard.module.css"
import StatCard from "./components/StatCard"
import ToolCard from "./components/ToolCard"
import ActivityFeed from "./components/ActivityFeed"
import { DASHBOARD_CATEGORIES } from "./constants"

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
        { label: "Total Views", value: stats.views.toLocaleString(), colorClass: "bg-blue-500" },
        { label: "Unique Users", value: stats.visitors.toLocaleString(), colorClass: "bg-emerald-500" },
        { label: "Views Today", value: stats.viewsToday.toLocaleString(), colorClass: "bg-red-500" },
        { label: "Unique Users Today", value: stats.visitorsToday.toLocaleString(), colorClass: "bg-amber-500" },
    ]

    return (
        <div className={styles.v2Dashboard}>
            <header className={styles.header}>
                <div className={styles.welcomeText}>OPERATOR / {user?.username?.toUpperCase()}</div>
                <h1 className={styles.title}>
                    ADMIN <span className={styles.titleAccent}>DASHBOARD</span>
                </h1>
            </header>

            <section className={styles.statsGrid}>
                {statCards.map((s, i) => (
                    <StatCard key={i} {...s} />
                ))}
            </section>

            <div className={styles.mainContent}>
                <div className={styles.toolsArea}>
                    {filteredCategories.map((category) => (
                        <div key={category.title} className={styles.categorySection}>
                            <h2 className={styles.sectionTitleMinimal}>
                                {category.title}
                            </h2>
                            <div className={styles.toolGridMinimal}>
                                {category.items.map((tool) => (
                                    <ToolCard 
                                        key={tool.title} 
                                        {...tool} 
                                        markerColor={tool.marker}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className={styles.activityFeedArea}>
                    <ActivityFeed logs={recentLogs} />
                </aside>
            </div>
        </div>
    )
}
