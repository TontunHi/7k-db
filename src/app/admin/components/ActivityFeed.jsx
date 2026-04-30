"use client"

import styles from "../admin-dashboard.module.css"
import { Clock, ExternalLink, Plus, Trash2, Edit3, Settings } from "lucide-react"
import Link from "next/link"

const ACTION_ICONS = {
    create: { icon: Plus, color: 'text-emerald-500' },
    delete: { icon: Trash2, color: 'text-red-500' },
    update: { icon: Edit3, color: 'text-blue-500' },
    default: { icon: Settings, color: 'text-gray-500' }
}

export default function ActivityFeed({ logs = [] }) {
    return (
        <div className={styles.activitySidebar}>
            <div className={styles.activityHeader}>
                <h2 className={styles.sidebarTitle}>Neural Activity</h2>
                <Link href="/admin/logs" className={styles.viewAllLink}>
                    Protocol Log <ExternalLink size={10} />
                </Link>
            </div>

            <div className={styles.activityCard}>
                {logs && logs.length > 0 ? (
                    <div className={styles.activityList}>
                        {logs.map((log, i) => {
                            const actionInfo = ACTION_ICONS[log.action_type] || ACTION_ICONS.default
                            const Icon = actionInfo.icon

                            return (
                                <div key={i} className={styles.logItem}>
                                    <div className={styles.logIndicatorWrapper}>
                                        <div className={`${styles.logDot} ${
                                            log.action_type === 'create' ? styles.dotEmerald : 
                                            log.action_type === 'delete' ? styles.dotRed : styles.dotBlue
                                        }`} />
                                        {i !== logs.length - 1 && <div className={styles.logLine} />}
                                    </div>
                                    <div className="flex-1 pb-6">
                                        <div className={styles.logMeta}>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={10} />
                                                <span>{log.display_time}</span>
                                            </div>
                                            <span className="opacity-30">•</span>
                                            <span className="text-[9px]">{log.admin_name || 'System'}</span>
                                        </div>
                                        <div className={styles.logContent}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icon size={12} className={actionInfo.color} />
                                                <span className={styles.logAction}>{log.action_type}</span>
                                            </div>
                                            <span className={styles.logTarget}>{log.target_name}</span>
                                            {log.message && (
                                                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 opacity-70">
                                                    {log.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyLogs}>No recent activity detected.</div>
                )}
            </div>
        </div>
    )
}

