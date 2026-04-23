"use client"

import { Shield, Edit2, Trash2, Calendar, Lock, Globe, AlertCircle } from "lucide-react"
import { clsx } from "clsx"
import styles from "../users.module.css"

export default function UserCard({ user, currentUser, allPermissions, onEdit, onDelete }) {
    const isSelf = user.id === currentUser?.id
    const isSuper = user.role === 'super_admin'

    return (
        <div className={clsx(styles.userCard, isSuper && styles.superCard)}>
            {/* Role Background Text */}
            <div className={styles.roleBgText}>
                {user.role}
            </div>

            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <div className={styles.userInfo}>
                        <div className={clsx(styles.shieldIconBox, isSuper && styles.superShieldBox)}>
                            <Shield className={clsx(styles.shieldIcon, isSuper && styles.superShieldIcon)} />
                        </div>
                        <div>
                            <div className={styles.nameRow}>
                                <h3 className={styles.username}>{user.username}</h3>
                                {isSelf && (
                                    <span className={styles.selfBadge}>You</span>
                                )}
                            </div>
                            <div className={styles.metaRow}>
                                <div className={styles.metaItem}>
                                    <Calendar className={styles.metaIcon} />
                                    <span suppressHydrationWarning>{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <Lock className={styles.metaIcon} />
                                    {isSuper ? 'Full Access' : `${user.permissions?.length || 0}/${allPermissions.length} Modules`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cardActions}>
                        <button 
                            onClick={() => onEdit(user)}
                            className={styles.actionButton}
                            title="Edit user"
                        >
                            <Edit2 size={18} />
                        </button>
                        {!isSelf && (
                            <button 
                                onClick={() => onDelete(user.id)}
                                className={clsx(styles.actionButton, styles.deleteButton)}
                                title="Delete user"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Permissions View */}
                <div className={styles.permissionsSection}>
                    <h4 className={styles.permissionTitle}>Active Modules</h4>
                    <div className={styles.permissionGrid}>
                        {isSuper ? (
                            <div className={styles.fullAccessBadge}>
                                <Globe className={styles.fullAccessIcon} />
                                <span className={styles.fullAccessText}>All Admin Access Granted</span>
                            </div>
                        ) : (
                            user.permissions?.length > 0 ? (
                                user.permissions.map(pId => {
                                    const perm = allPermissions.find(ap => ap.id === pId)
                                    return (
                                        <span key={pId} className={clsx(styles.permissionBadge, perm?.color)}>
                                            {perm?.label || pId}
                                        </span>
                                    )
                                })
                            ) : (
                                <div className={styles.noPermissions}>
                                    <AlertCircle size={14} className="text-red-500/50" />
                                    <span className={styles.noPermissionsText}>No Permissions Assigned</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
