"use client"

import React, { useState } from "react"
import styles from "./admin-dashboard.module.css"
import StatCard from "./components/StatCard"
import ToolCard from "./components/ToolCard"
import ActivityFeed from "./components/ActivityFeed"
import { DASHBOARD_CATEGORIES } from "./constants"
import { Search, Sparkles } from "lucide-react"

export default function AdminDashboardView({ user, stats, recentLogs }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("ALL")

    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true
        return user?.permissions?.includes(perm) || user?.permissions?.includes('*')
    }

    const filteredCategories = DASHBOARD_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            if (item.superOnly && user?.role !== 'super_admin') return false
            const permitted = hasPermission(item.perm)
            if (!permitted) return false

            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase()
                return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
            }
            return true
        })
    })).filter(cat => {
        if (cat.items.length === 0) return false
        if (activeCategory === "ALL") return true
        if (activeCategory === "CONTENT" && (cat.title === "Core Logistics" || cat.title === "General")) return true
        if (activeCategory === "PVE" && cat.title.includes("PVE")) return true
        if (activeCategory === "PVP" && cat.title.includes("PVP")) return true
        if (activeCategory === "SYSTEM" && cat.title.includes("System")) return true
        return false
    })

    const statCards = [
        { label: "Total Views", value: stats.views.toLocaleString(), type: "total_views" },
        { label: "Unique Users", value: stats.visitors.toLocaleString(), type: "unique_users" },
        { label: "Views Today", value: stats.viewsToday.toLocaleString(), type: "views_today" },
        { label: "Users Today", value: stats.visitorsToday.toLocaleString(), type: "users_today" },
    ]

    return (
        <div className={styles.minimalDashboard}>
            {/* Greeting & Quick Header */}
            <header className={styles.dashboardHeader}>
                <div>
                    <h1 className={styles.greetingTitle}>
                        Hello, <span className={styles.usernameHighlight}>{user?.username || 'Operator'}</span>
                    </h1>
                    <p className={styles.greetingSubtitle}>Welcome back to your administration console.</p>
                </div>
                <div className={styles.sessionStatus}>
                    <div className={styles.statusDot} />
                    <span className={styles.statusText}>{user?.role?.replace('_', ' ')} Session</span>
                </div>
            </header>

            {/* Split Grid Layout */}
            <div className={styles.dashboardBody}>
                
                {/* Left Side: Operations Navigation */}
                <main className={styles.operationsColumn}>
                    {/* Minimalist Filter Bar */}
                    <div className={styles.toolFilterBar}>
                        <div className={styles.searchContainer}>
                            <Search className={styles.searchIcon} size={14} />
                            <input 
                                type="text" 
                                placeholder="Search modules..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchField}
                            />
                        </div>
                        <div className={styles.filterTabs}>
                            {["ALL", "CONTENT", "PVE", "PVP", "SYSTEM"].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`${styles.tabBtn} ${activeCategory === category ? styles.tabBtnActive : ""}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tool Categories Matrix */}
                    <div className={styles.toolsMatrix}>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div key={cat.title} className={styles.moduleSection}>
                                    <h3 className={styles.moduleGroupTitle}>{cat.title}</h3>
                                    <div className={styles.modulesGrid}>
                                        {cat.items.map((tool) => (
                                            <ToolCard 
                                                key={tool.title} 
                                                {...tool} 
                                                markerColor={tool.marker}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptySearch}>
                                <Sparkles size={20} className="text-muted-foreground/30 mb-2" />
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">No administrative modules match search filter</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Side: Telemetry & Activity */}
                <aside className={styles.telemetryColumn}>
                    {/* System Telemetries */}
                    <div className={styles.sidebarSection}>
                        <h3 className={styles.sidebarGroupTitle}>System Telemetries</h3>
                        <div className={styles.telemetriesGrid}>
                            {statCards.map((stat, idx) => (
                                <StatCard key={idx} {...stat} />
                            ))}
                        </div>
                    </div>

                    {/* Live Audit Log Stream */}
                    <div className={styles.sidebarSection}>
                        <ActivityFeed logs={recentLogs} />
                    </div>
                </aside>
            </div>
        </div>
    )
}
