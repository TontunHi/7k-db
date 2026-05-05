"use client"

import { TiktokIcon, DiscordIcon } from '@/components/shared/BrandIcons'
import Link from 'next/link'
import { useCreditsManager } from '../hooks/useCreditsManager'
import CreditRow from './CreditRow'
import styles from '../credits.module.css'
import { clsx } from 'clsx'
import { Marker, ActionLabel } from '@/app/admin/components/AdminEditorial'

const PLATFORMS = [
    { id: 'youtube', name: 'YouTube', icon: null, color: 'text-[#FF0000]' },
    { id: 'tiktok', name: 'TikTok', icon: TiktokIcon, color: 'text-white' },
    { id: 'facebook', name: 'Facebook', icon: null, color: 'text-[#1877F2]' },
    { id: 'discord', name: 'Discord', icon: DiscordIcon, color: 'text-[#5865F2]' },
    { id: 'other', name: 'Other', icon: null, color: 'text-gray-400' },
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
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-1 bg-primary/20 relative overflow-hidden rounded-full">
                    <div className="absolute inset-y-0 left-0 bg-primary animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 animate-pulse">Synchronizing Registry</span>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitleGroup}>
                    <Link href="/admin" className={styles.backButton}>
                        <ActionLabel label="ABORT" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Marker color="bg-primary" className="w-2 h-10" />
                        <h1 className={styles.title}>
                            MANAGE <span className={styles.accent}>CREDITS</span>
                        </h1>
                    </div>
                </div>
            </header>

            {/* Add Form */}
            <div className={styles.formCard}>
                <div className="flex items-center gap-3 mb-6">
                    <Marker color="bg-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest opacity-80">Add Source / Attribution</h2>
                </div>
                <div className={clsx(styles.formGrid)}>
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
                            className={clsx(styles.submitButton, "flex items-center justify-center")}
                        >
                            <ActionLabel label={saving ? "ADDING..." : "ADD_SOURCE"} color="text-black" />
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className={styles.listContainer}>
                <div className="flex items-center gap-3 mb-6">
                    <Marker color="bg-muted" />
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-50">Existing attributions ({credits.length})</h3>
                </div>
                {credits.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className="text-[3rem] font-black opacity-5 italic mb-2">NO_CREDITS</div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">No attributions added yet.</p>
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
