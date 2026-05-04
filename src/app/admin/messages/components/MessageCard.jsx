"use client"

import { format } from 'date-fns'
import styles from '../messages.module.css'
import { clsx } from 'clsx'
import { Marker, ActionLabel, SystemBadge } from '@/app/admin/components/AdminEditorial'

export default function MessageCard({ 
    msg, 
    isActionLoading, 
    onStatusUpdate, 
    onDelete 
}) {
    const isUnread = msg.status === 'unread'

    return (
        <div className={clsx(styles.messageCard, isUnread && styles.unreadCard)}>
            <div className={styles.cardHeader}>
                <div className={styles.senderBox}>
                    <div className={styles.avatar}>
                        {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className={styles.senderName}>
                            {msg.name}
                            {isUnread && <span className={styles.unreadDot} />}
                        </h3>
                        <p className={styles.senderEmail}>
                            <span className="text-[10px] font-black opacity-30 mr-2 uppercase italic">Email</span>
                            {msg.email}
                        </p>
                    </div>
                </div>
                <div className={styles.timeBox}>
                    <p className={styles.timeLabel}>Received</p>
                    <p className={styles.timeValue}>
                        {format(new Date(msg.created_at), 'MMM d, yyyy · HH:mm')}
                    </p>
                </div>
            </div>

            <div className={styles.messageBody}>
                {msg.subject && (
                    <div className="flex items-center gap-2 mb-2">
                        <Marker color="bg-primary" className="w-1 h-3" />
                        <p className={styles.subject}>Subject: {msg.subject}</p>
                    </div>
                )}
                <p className={styles.text}>
                    {msg.message}
                </p>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.metaInfo}>
                    <span className="text-[10px] font-black opacity-30 mr-2 uppercase italic">Origin_IP</span>
                    {msg.ip_address}
                </div>
                <div className={styles.actionGroup}>
                    {isUnread ? (
                        <button 
                            onClick={() => onStatusUpdate(msg.id, 'read')}
                            disabled={isActionLoading}
                            className={styles.markReadBtn}
                        >
                            <ActionLabel label="MARK READ" size="text-[9px]" />
                        </button>
                    ) : (
                        <div className={styles.seenBadge}>
                            <SystemBadge label="SEEN" color="bg-emerald-500" />
                        </div>
                    )}
                    <button 
                        onClick={() => onDelete(msg.id)}
                        disabled={isActionLoading}
                        className={styles.deleteBtn}
                    >
                        <ActionLabel label={isActionLoading ? "..." : "DELETE"} size="text-[9px]" color="text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    )
}
