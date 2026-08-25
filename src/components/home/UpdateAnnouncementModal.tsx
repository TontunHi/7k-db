'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
    X, 
    Share2, 
    Shield, 
    Award, 
    ArrowRight, 
    Sparkles, 
    Check, 
    Calendar,
    BookOpen
} from 'lucide-react'
import styles from './UpdateAnnouncementModal.module.css'

const STORAGE_KEY = '7k_daily_community_build_update_seen_date'

export default function UpdateAnnouncementModal() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        try {
            const todayStr = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
            const lastSeenDate = localStorage.getItem(STORAGE_KEY)

            if (lastSeenDate !== todayStr) {
                // Open modal once per day
                setIsOpen(true)
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }, [])

    const handleDismiss = () => {
        try {
            const todayStr = new Date().toISOString().split('T')[0]
            localStorage.setItem(STORAGE_KEY, todayStr)
        } catch (e) {}
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={handleDismiss}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Gold Top Accent Line */}
                <div className={styles.topGoldLine} />

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.badge}>
                            <Calendar size={12} />
                            <span>New Feature Announcement</span>
                        </div>
                        <h2 className={styles.title}>
                            Suggest &amp; Share <span className={styles.goldText}>Community Builds</span>
                        </h2>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleDismiss} 
                        className={styles.closeButton}
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div className={styles.body}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIconBox}>
                            <Share2 size={20} />
                        </div>
                        <div className={styles.featureContent}>
                            <h4 className={styles.featureTitle}>
                                Share Your Hero Builds with the Community!
                            </h4>
                            <p className={styles.featureDesc}>
                                Have a winning gear combination? You can now submit your own custom hero setups directly to the 7K Database for others to discover and learn from.
                            </p>
                        </div>
                    </div>

                    {/* Highlights breakdown */}
                    <div className="flex flex-col gap-2.5 pt-1">
                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <div className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Award size={13} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-amber-300">Author Credit &amp; Attribution</span>
                                <span className="text-[11px] text-zinc-400 leading-normal">
                                    Your Name or In-Game Name (IGN) will be prominently credited on the build viewer once approved.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <div className="w-5 h-5 rounded-md bg-sky-400/20 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Shield size={13} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-sky-300">Full Equipment &amp; Stat Customization</span>
                                <span className="text-[11px] text-zinc-400 leading-normal">
                                    Equip tailored weapons, armors, dual refining accessories, priority substats, and minimum stat goals.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <div className="w-5 h-5 rounded-md bg-emerald-400/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <BookOpen size={13} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-emerald-300">Strategy Notes &amp; Tips</span>
                                <span className="text-[11px] text-zinc-400 leading-normal">
                                    Share tactical advice, rotation guidelines, and gameplay insights with fellow players.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.footer}>
                    <button type="button" onClick={handleDismiss} className={styles.dismissBtn}>
                        Don&apos;t show again today
                    </button>
                    <Link 
                        href="/build" 
                        onClick={handleDismiss}
                        className={styles.actionBtn}
                    >
                        <span>Go to Hero Builds</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
