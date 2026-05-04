"use client"

import { clsx } from "clsx"
import styles from "../users.module.css"
import { ActionLabel, Marker, SystemBadge } from "@/app/admin/components/AdminEditorial"

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
                        <Marker color={isSuper ? "bg-amber-500" : "bg-primary"} className="w-2 h-10" />
                        <div>
                            <div className={styles.nameRow}>
                                <h3 className={styles.username}>{user.username}</h3>
                                {isSelf && (
                                    <SystemBadge label="YOU" color="bg-primary" />
                                )}
                            </div>
                            <div className={styles.metaRow}>
                                <div className={styles.metaItem}>
                                    <span className="text-[10px] font-black opacity-30 mr-2 uppercase italic">Joined</span>
                                    <span suppressHydrationWarning>{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className="text-[10px] font-black opacity-30 mr-2 uppercase italic">Access</span>
                                    {isSuper ? 'FULL_PROTOCOL' : `${user.permissions?.length || 0}/${allPermissions.length} MODULES`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cardActions}>
                        <button 
                            onClick={() => onEdit(user)}
                            className={styles.actionButton}
                        >
                            <ActionLabel label="EDIT" size="text-[9px]" />
                        </button>
                        {!isSelf && (
                            <button 
                                onClick={() => onDelete(user.id)}
                                className={clsx(styles.actionButton, styles.deleteButton)}
                            >
                                <ActionLabel label="DELETE" size="text-[9px]" color="text-red-500" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Permissions View */}
                <div className={styles.permissionsSection}>
                    <div className="flex items-center gap-2 mb-3">
                        <Marker color="bg-white/10" className="w-1 h-3" />
                        <h4 className={styles.permissionTitle}>Active Modules</h4>
                    </div>
                    <div className={styles.permissionGrid}>
                        {isSuper ? (
                            <div className={styles.fullAccessBadge}>
                                <span className={styles.fullAccessText}>ALL_ADMIN_ACCESS_GRANTED</span>
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
                                    <span className={styles.noPermissionsText}>NO_PERMISSIONS_ASSIGNED</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
