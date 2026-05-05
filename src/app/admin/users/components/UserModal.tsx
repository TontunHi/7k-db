"use client"

import { X, Key, Check, CheckSquare, Square } from "lucide-react"
import { clsx } from "clsx"
import styles from "../users.module.css"

export default function UserModal({ 
    isOpen, 
    onClose, 
    editingUser, 
    formData, 
    loading, 
    permissionGroups, 
    allPermissions,
    onPermissionToggle, 
    onSelectAll, 
    onClearAll, 
    onUpdateField, 
    onSubmit 
}) {
    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBackdrop} onClick={onClose} />
            
            <div className={styles.modalContent}>
                <button 
                    onClick={onClose}
                    className={styles.closeModalBtn}
                >
                    <X size={24} />
                </button>

                <header className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {editingUser ? 'Update' : 'Initialize'} <span className={styles.titleGradient}>Admin</span>
                    </h2>
                    <p className={styles.modalSubtitle}>CONFIGURE USER ACCESS AND ACCOUNT SECURITY</p>
                </header>

                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.fieldBox}>
                            <label className={styles.fieldLabel}>Admin Username</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.username}
                                onChange={e => onUpdateField('username', e.target.value)}
                                className={styles.modalInput}
                                placeholder="e.g. guild_lead"
                            />
                        </div>
                        <div className={styles.fieldBox}>
                            <label className={styles.fieldLabel}>
                                {editingUser ? 'Credentials (Skip to keep original)' : 'Admin Password'}
                            </label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={e => onUpdateField('password', e.target.value)}
                                    className={styles.modalInput}
                                    placeholder="••••••••"
                                />
                                <Key className="absolute right-6 top-5 w-4 h-4 text-gray-700" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.roleSelector}>
                        <label className={styles.fieldLabel}>Privilege Level</label>
                        <div className={styles.roleGrid}>
                            <button 
                                type="button"
                                onClick={() => onUpdateField('role', 'admin')}
                                className={clsx(styles.roleOption, formData.role === 'admin' && styles.roleActive)}
                            >
                                <span className={styles.roleTitle}>Standard Admin</span>
                                <span className={styles.roleDesc}>Restricted to specific modules</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => onUpdateField('role', 'super_admin')}
                                className={clsx(styles.roleOption, formData.role === 'super_admin' && styles.roleSuperActive)}
                            >
                                <span className={styles.roleTitle}>Super Admin</span>
                                <span className={styles.roleDesc}>All Power • System Settings</span>
                            </button>
                        </div>
                    </div>

                    {formData.role === 'admin' && (
                        <div className={styles.permContainer}>
                            <div className={styles.permHeader}>
                                <label className={styles.fieldLabel}>Manageable Modules</label>
                                <div className={styles.permActionRow}>
                                    <button 
                                        type="button" 
                                        onClick={() => onSelectAll(allPermissions.map(p => p.id))} 
                                        className={styles.permSmallBtn}
                                    >
                                        <CheckSquare size={14} /> All
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={onClearAll} 
                                        className={styles.permSmallBtn}
                                    >
                                        <Square size={14} /> Clear
                                    </button>
                                </div>
                            </div>
                            
                            <div className={styles.permGroupGrid}>
                                {permissionGroups.map((group, gIdx) => (
                                    <div key={gIdx}>
                                        <h5 className={styles.groupLabel}>{group.name}</h5>
                                        <div className={styles.permOptionsGrid}>
                                            {group.permissions.map(p => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => onPermissionToggle(p.id)}
                                                    className={clsx(
                                                        styles.permToggleBtn,
                                                        formData.permissions.includes(p.id) && styles.permToggleActive
                                                    )}
                                                >
                                                    <span className="truncate pr-2">{p.label}</span>
                                                    <div className={clsx(
                                                        styles.checkCircle,
                                                        formData.permissions.includes(p.id) && styles.checkActive
                                                    )}>
                                                        {formData.permissions.includes(p.id) && <Check size={10} strokeWidth={4} />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.submitWrapper}>
                        <button 
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            <div className={styles.submitGradient} />
                            <span className={styles.submitText}>
                                {loading ? 'Processing...' : (editingUser ? 'Commit Changes' : 'Initialize Account')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
