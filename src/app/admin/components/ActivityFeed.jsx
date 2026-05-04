"use client"

import styles from "../admin-dashboard.module.css"
import { ActionLabel } from "./AdminEditorial"
import Link from "next/link"

const ACTION_COLORS = {
    create: 'text-emerald-500',
    delete: 'text-red-500',
    update: 'text-blue-500',
    default: 'text-gray-500'
}

export default function ActivityFeed({ logs = [] }) {
    return (
        <div className={styles.activitySidebar}>
            <div className={styles.activityHeader}>
                <h2 className={styles.sidebarTitle}>Protocol Stream</h2>
                <Link href="/admin/logs" className={styles.viewAllLink}>
                    FULL LOG
                </Link>
            </div>

            <div className={styles.activityCard}>
                {logs && logs.length > 0 ? (
                    <div className={styles.activityList}>
                        {logs.map((log, i) => {
                            const actionColor = ACTION_COLORS[log.action_type] || ACTION_COLORS.default

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
                                                <span>{log.display_time}</span>
                                            </div>
                                            <span className="opacity-30">•</span>
                                            <span className="text-[9px] uppercase font-bold tracking-widest">{log.admin_name || 'System'}</span>
                                        </div>
                                        <div className={styles.logContent}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <ActionLabel label={log.action_type} color={actionColor} size="text-[9px]" />
                                            </div>
                                            <span className={styles.logTarget}>{log.target_name}</span>
                                            {log.message && (
                                                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 opacity-70 italic font-medium">
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
                    <div className={styles.emptyLogs}>No active streams.</div>
                )}
            </div>
        </div>
    )
}
