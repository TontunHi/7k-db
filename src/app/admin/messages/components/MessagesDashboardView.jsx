"use client"

import Link from 'next/link'
import { useMessagesManager } from '../hooks/useMessagesManager'
import MessageCard from './MessageCard'
import styles from '../messages.module.css'
import { clsx } from 'clsx'
import { ActionLabel, Marker, SystemBadge } from '@/app/admin/components/AdminEditorial'

export default function MessagesDashboardView() {
    const {
        messages,
        allCount,
        loading,
        isEnabled,
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        actionLoading,
        handleToggle,
        handleStatus,
        handleDelete
    } = useMessagesManager()

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-1 bg-primary/20 relative overflow-hidden rounded-full">
                    <div className="absolute inset-y-0 left-0 bg-primary animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 animate-pulse">Scanning Transmission</span>
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
                        <Marker color="bg-primary" className="w-2 h-12" />
                        <div>
                            <h1 className={styles.title}>
                                USER <span className={styles.accent}>MESSAGES</span>
                            </h1>
                            <p className={styles.subtitle}>Manage incoming inquiries and site settings.</p>
                        </div>
                    </div>
                </div>

                {/* Status Toggle Card */}
                <div className={styles.statusCard}>
                    <div className={clsx(styles.statusIconBox, isEnabled ? styles.statusOnline : styles.statusOffline)}>
                        <span className="text-[10px] font-black">{isEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className={styles.statusInfo}>
                        <p className={styles.statusLabel}>Contact Form Status</p>
                        <p className={styles.statusValue}>{isEnabled ? 'ONLINE' : 'OFFLINE'}</p>
                    </div>
                    <button 
                        onClick={handleToggle}
                        className={clsx(styles.toggle, isEnabled ? styles.toggleOn : styles.toggleOff)}
                    >
                        <span className={clsx(styles.toggleCircle, isEnabled ? styles.circleOn : styles.circleOff)} />
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div className={styles.controlsGrid}>
                <div className={styles.searchWrapper}>
                    <input 
                        type="text"
                        placeholder="SEARCH_NAME_EMAIL_OR_CONTENT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="all">All Messages ({allCount})</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                </select>
            </div>

            {/* Message List */}
            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className="text-[4rem] font-black opacity-5 italic mb-4">NO_TRANSMISSIONS</div>
                        <p className={styles.emptyText}>No messages found matching your criteria.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageCard 
                            key={msg.id}
                            msg={msg}
                            isActionLoading={actionLoading === msg.id}
                            onStatusUpdate={handleStatus}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
