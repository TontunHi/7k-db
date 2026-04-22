import Link from "next/link"
import { History, ExternalLink } from "lucide-react"
import styles from "../admin-dashboard.module.css"

export default function ActivityFeed({ logs = [] }) {
    return (
        <div className={styles.activitySidebar}>
            <div className={styles.activityHeader}>
                <div className="flex items-center gap-3">
                    <History size={20} className="text-red-500" />
                    <h2 className={styles.sidebarTitle}>Recency</h2>
                </div>
                <Link href="/admin/logs" className={styles.viewAllLink}>
                    Entire Log <ExternalLink size={10} />
                </Link>
            </div>

            <div className={styles.activityCard}>
                <div className={styles.activityList}>
                    {logs.map((log) => (
                        <div key={log.id} className={styles.logItem}>
                            <div className={styles.logIndicatorWrapper}>
                                <div className={`${styles.logDot} ${
                                    log.action_type === 'CREATE' ? styles.dotEmerald : 
                                    log.action_type === 'DELETE' ? styles.dotRed : styles.dotBlue
                                }`} />
                                <div className={styles.logLine} />
                            </div>
                            <div className="space-y-1">
                                <div className={styles.logMeta}>
                                    {log.admin_name} &bull; {log.display_time}
                                </div>
                                <p className={styles.logContent}>
                                    <span className={styles.logAction}>{log.action_type}</span> {log.content_type}: <span className={styles.logTarget}>{log.target_name}</span>
                                </p>
                            </div>
                        </div>
                    ))}

                    {logs.length === 0 && (
                        <p className={styles.emptyLogs}>No recent activity recorded</p>
                    )}
                </div>
            </div>
        </div>
    )
}
