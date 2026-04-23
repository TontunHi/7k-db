"use client"

import { 
    Plus, Loader2, ArrowLeft, 
    Youtube, Link as LinkIcon 
} from 'lucide-react'
import { TiktokIcon, DiscordIcon } from '@/components/shared/BrandIcons'
import { Facebook } from 'lucide-react'
import Link from 'next/link'
import { useCreditsManager } from '../hooks/useCreditsManager'
import CreditRow from './CreditRow'
import styles from '../credits.module.css'
import { clsx } from 'clsx'

const PLATFORMS = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-[#FF0000]' },
    { id: 'tiktok', name: 'TikTok', icon: TiktokIcon, color: 'text-white' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-[#1877F2]' },
    { id: 'discord', name: 'Discord', icon: DiscordIcon, color: 'text-[#5865F2]' },
    { id: 'other', name: 'Other', icon: LinkIcon, color: 'text-gray-400' },
]

export default function CreditsDashboardView() {
    const {
        credits,
        loading,
        saving,
        editingId,
        setEditingId,
        newItem,
        handleAdd,
        handleUpdate,
        handleDelete,
        updateNewItem
    } = useCreditsManager()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className={clsx(styles.loader, "w-8 h-8 text-[#FFD700]")} />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitleGroup}>
                    <Link href="/admin" className={styles.backButton}>
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className={styles.title}>
                        Manage <span className={styles.accent}>Credits</span>
                    </h1>
                </div>
            </header>

            {/* Add Form */}
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>
                    <Plus className={styles.plusIcon} />
                    Add Source / Attribution
                </h2>
                <div className={clsx(styles.formGrid, "mt-6")}>
                    <div className={clsx(styles.fieldGroup, "md:col-span-3")}>
                        <label className={styles.label}>Platform</label>
                        <select 
                            value={newItem.platform}
                            onChange={(e) => updateNewItem('platform', e.target.value)}
                            className={styles.select}
                        >
                            {PLATFORMS.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={clsx(styles.fieldGroup, "md:col-span-3")}>
                        <label className={styles.label}>Creator Name</label>
                        <input 
                            type="text"
                            placeholder="e.g. SevenKnightsThai"
                            value={newItem.name}
                            onChange={(e) => updateNewItem('name', e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={clsx(styles.fieldGroup, "md:col-span-4")}>
                        <label className={styles.label}>Channel Link</label>
                        <input 
                            type="url"
                            placeholder="https://youtube.com/@..."
                            value={newItem.link}
                            onChange={(e) => updateNewItem('link', e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button 
                            onClick={handleAdd}
                            disabled={saving || !newItem.name || !newItem.link}
                            className={styles.submitButton}
                        >
                            {saving ? <Loader2 className={clsx(styles.loader, "w-4 h-4")} /> : <Plus className="w-4 h-4" />}
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className={styles.listContainer}>
                <h3 className={styles.listHeader}>Existing attributions ({credits.length})</h3>
                {credits.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No attributions added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {credits.map((item) => (
                            <CreditRow 
                                key={item.id}
                                item={item}
                                platforms={PLATFORMS}
                                isEditing={editingId === item.id}
                                onEdit={setEditingId}
                                onCancel={() => setEditingId(null)}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
