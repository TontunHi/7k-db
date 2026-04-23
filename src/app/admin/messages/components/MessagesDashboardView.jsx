"use client"

import { 
    Search, ArrowLeft, Loader2, MessageSquare, 
    Globe, EyeOff 
} from 'lucide-react'
import Link from 'next/link'
import { useMessagesManager } from '../hooks/useMessagesManager'
import MessageCard from './MessageCard'
import styles from '../messages.module.css'
import { clsx } from 'clsx'

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
                    <div>
                        <h1 className={styles.title}>
                            User <span className={styles.accent}>Messages</span>
                        </h1>
                        <p className={styles.subtitle}>Manage incoming inquiries and site settings.</p>
                    </div>
                </div>

                {/* Status Toggle Card */}
                <div className={styles.statusCard}>
                    <div className={clsx(styles.statusIconBox, isEnabled ? styles.statusOnline : styles.statusOffline)}>
                        {isEnabled ? <Globe className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
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
                    <Search className={styles.searchIcon} />
                    <input 
                        type="text"
                        placeholder="Search by name, email, or message content..."
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
                        <div className={styles.emptyIconBox}>
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
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
