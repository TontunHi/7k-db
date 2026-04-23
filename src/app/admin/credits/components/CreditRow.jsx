"use client"

import { 
    Save, X, Edit2, Trash2, Link as LinkIcon 
} from 'lucide-react'
import styles from '../credits.module.css'
import { clsx } from 'clsx'

export default function CreditRow({ 
    item, 
    platforms, 
    isEditing, 
    onEdit, 
    onCancel, 
    onUpdate, 
    onDelete 
}) {
    if (isEditing) {
        return (
            <div className={styles.creditRow}>
                <div className={styles.editGrid}>
                    <div className="md:col-span-3">
                        <select 
                            id={`plat-${item.id}`}
                            defaultValue={item.platform}
                            className={styles.select}
                        >
                            {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <input 
                            id={`name-${item.id}`}
                            defaultValue={item.name}
                            className={styles.input}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <input 
                            id={`link-${item.id}`}
                            defaultValue={item.link}
                            className={styles.input}
                        />
                    </div>
                    <div className={clsx("md:col-span-2", styles.editActions)}>
                        <button 
                            onClick={() => onUpdate(item.id, {
                                platform: document.getElementById(`plat-${item.id}`).value,
                                name: document.getElementById(`name-${item.id}`).value,
                                link: document.getElementById(`link-${item.id}`).value
                            })}
                            className={clsx(styles.actionButton, styles.saveBtn)}
                        >
                            <Save size={20} className="mx-auto" />
                        </button>
                        <button 
                            onClick={onCancel}
                            className={clsx(styles.actionButton, styles.cancelBtn)}
                        >
                            <X size={20} className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const platform = platforms.find(p => p.id === item.platform) || platforms[4]
    const Icon = platform.icon

    return (
        <div className={styles.creditRow}>
            <div className={styles.creditInfo}>
                <div className={styles.platformIconBox}>
                    <Icon className={clsx("w-6 h-6", platform.color)} />
                </div>
                <div>
                    <h4 className={styles.creatorName}>{item.name}</h4>
                    <p className={styles.creatorLink}>
                        <LinkIcon className="w-3 h-3" />
                        {item.link}
                    </p>
                </div>
            </div>
            <div className={styles.rowActions}>
                <button 
                    onClick={() => onEdit(item.id)}
                    className={clsx(styles.actionButton, styles.editBtn)}
                >
                    <Edit2 size={20} />
                </button>
                <button 
                    onClick={() => onDelete(item.id)}
                    className={clsx(styles.actionButton, styles.deleteBtn)}
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    )
}
