"use client"

import { 
    Mail, Trash2, CheckCircle, Clock, 
    ShieldCheck, Eye, Loader2 
} from 'lucide-react'
import { format } from 'date-fns'
import styles from '../messages.module.css'
import { clsx } from 'clsx'

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
                            <Mail className="w-3 h-3" />
                            {msg.email}
                        </p>
                    </div>
                </div>
                <div className={styles.timeBox}>
                    <p className={styles.timeLabel}>Received</p>
                    <p className={styles.timeValue}>
                        <Clock className="w-3 h-3" />
                        {format(new Date(msg.created_at), 'MMM d, yyyy · HH:mm')}
                    </p>
                </div>
            </div>

            <div className={styles.messageBody}>
                {msg.subject && (
                    <p className={styles.subject}>Subject: {msg.subject}</p>
                )}
                <p className={styles.text}>
                    {msg.message}
                </p>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.metaInfo}>
                    <ShieldCheck className="w-3 h-3" />
                    IP: {msg.ip_address}
                </div>
                <div className={styles.actionGroup}>
                    {isUnread ? (
                        <button 
                            onClick={() => onStatusUpdate(msg.id, 'read')}
                            disabled={isActionLoading}
                            className={styles.markReadBtn}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Mark as Read
                        </button>
                    ) : (
                        <div className={styles.seenBadge}>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Seen
                        </div>
                    )}
                    <button 
                        onClick={() => onDelete(msg.id)}
                        disabled={isActionLoading}
                        className={styles.deleteBtn}
                    >
                        {isActionLoading ? <Loader2 className={clsx(styles.loader, "w-4 h-4")} /> : <Trash2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
