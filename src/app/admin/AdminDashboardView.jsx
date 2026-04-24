"use client"

import { 
    ShieldCheck, Activity, Skull, Zap, Eye, UserCheck, Globe 
} from "lucide-react"
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
        { label: "Total Reach", value: stats.views.toLocaleString(), icon: Eye, colorClass: "text-blue-500" },
        { label: "Unique Users", value: stats.visitors.toLocaleString(), icon: UserCheck, colorClass: "text-emerald-500" },
        { label: "Raid Assets", value: stats.raidSets, icon: Skull, colorClass: "text-red-500" },
        { label: "PVE Guides", value: stats.stages, icon: Zap, colorClass: "text-amber-500" },
    ]

    return (
        <div className={styles.dashboard}>
            {/* Command Center Header */}
            <div className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroGrid}>
                    <div className={styles.heroContent}>
                        <div className={styles.versionBadge}>
                            <ShieldCheck size={16} />
                            <span>Secure Access &bull; v2.0</span>
                        </div>
                        <h1 className={styles.title}>
                            Admin <span className={styles.titleAccent}>Command</span>
                        </h1>
                        <p className={styles.description}>
                            Centralized logistics for <span className={styles.highlight}>{user?.username}</span>. 
                            Global changes to the 7K Database are deployed here.
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
                                <div className={styles.categoryIndicator}></div>
                                <h2 className={styles.categoryTitle}>{category.title}</h2>
                            </div>
                            
                            <div className={styles.toolGrid}>
                                {category.items.map((tool) => (
                                    <ToolCard key={tool.title} {...tool} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Quick Access System Tools */}
                    <div className={styles.systemBar}>
                         <div className={styles.systemHeader}>
                            <h2 className={styles.systemLabel}>System Infrastructure</h2>
                         </div>
                         <div className={styles.systemGrid}>
                            {SYSTEM_TOOLS.map((tool, i) => (
                                <Link key={i} href={tool.href} className={styles.systemLink}>
                                    <tool.icon size={20} className={`${styles.systemIcon} ${tool.color}`} />
                                    <span className={styles.systemText}>{tool.title}</span>
                                </Link>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Activity Feed Sidebar */}
                <div className="space-y-10">
                    <ActivityFeed logs={recentLogs} />


                </div>
            </div>
        </div>
    )
}
