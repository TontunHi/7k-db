"use client"

import styles from "../admin-dashboard.module.css"
import { Clock, ExternalLink } from "lucide-react"

export default function ActivityFeed({ logs = [] }) {
    return (
        <div className={styles.activitySidebar}>
            <div className={styles.activityHeader}>
                <h2 className={styles.sidebarTitle}>Neural Activity</h2>
                <a href="#" className={styles.viewAllLink}>
                    Protocol Log <ExternalLink size={10} />
                </a>
            </div>

            <div className={styles.activityCard}>
                {logs && logs.length > 0 ? (
                    <div className={styles.activityList}>
                        {logs.map((log, i) => (
                            <div key={i} className={styles.logItem}>
                                <div className={styles.logIndicatorWrapper}>
                                    <div className={`${styles.logDot} ${
                                        log.action_type === 'create' ? styles.dotEmerald : 
                                        log.action_type === 'delete' ? styles.dotRed : styles.dotBlue
                                    }`} />
                                    {i !== logs.length - 1 && <div className={styles.logLine} />}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className={styles.logMeta}>
                                        <Clock size={10} />
                                        <span>{log.display_time}</span>
                                        <span className="opacity-30">•</span>
                                        <span>{log.admin_name || 'System'}</span>
                                    </div>
                                    <div className={styles.logContent}>
                                        <span className={styles.logAction}>{log.action_type}</span>
                                        {" "}
                                        <span className={styles.logTarget}>{log.target_name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyLogs}>No recent activity detected.</div>
                )}
            </div>
        </div>
    )
}
