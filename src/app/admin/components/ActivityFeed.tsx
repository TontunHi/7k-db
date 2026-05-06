"use client"

import v2Styles from "../admin-dashboard.module.css"
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
        <div className={v2Styles.activitySidebar}>
            <div className={v2Styles.activityHeader}>
                <h2 className={v2Styles.feedTitle}>ADMIN LOG</h2>
                <Link href="/admin/logs" className={v2Styles.viewAllLink}>
                    VIEW ALL
                </Link>
            </div>

            <div className={v2Styles.activityCard}>
                {logs && logs.length > 0 ? (
                    <div className={v2Styles.activityList}>
                        {logs.map((log, i) => {
                            const actionColor = ACTION_COLORS[log.action_type] || ACTION_COLORS.default

                            return (
                                <div key={i} className={v2Styles.logItem}>
                                    <div className={v2Styles.logIndicatorWrapper}>
                                        <div className={`${v2Styles.logDot} ${
                                            log.action_type === 'create' ? v2Styles.dotEmerald : 
                                            log.action_type === 'delete' ? v2Styles.dotRed : v2Styles.dotBlue
                                        }`} />
                                        {i !== logs.length - 1 && <div className={v2Styles.logLine} />}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className={v2Styles.logMeta}>
                                            <span className="font-semibold">{log.admin_name || 'System'}</span>
                                            <span className="opacity-40">{log.display_time}</span>
                                        </div>
                                        <div className={v2Styles.logContent}>
                                            <span className={v2Styles.logTarget}>{log.target_name}</span>
                                            <span className="mx-2 opacity-20">/</span>
                                            <ActionLabel label={log.action_type} color={actionColor} size="text-[8px]" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className={v2Styles.emptyLogs}>No active logs.</div>
                )}
            </div>
        </div>
    )
}
