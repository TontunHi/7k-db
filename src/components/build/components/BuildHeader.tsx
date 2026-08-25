'use client'

import React from 'react'
import { Sparkles, Plus } from 'lucide-react'
import styles from './BuildHeader.module.css'

interface BuildHeaderProps {
    onOpenCommunityBuild?: () => void
}

export default function BuildHeader({ onOpenCommunityBuild }: BuildHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                    HERO <span className={styles.goldText}>BUILDS</span>
                </h1>
                <div className={styles.underline} />
            </div>

            {onOpenCommunityBuild && (
                <button
                    type="button"
                    onClick={onOpenCommunityBuild}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/60 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    <Plus size={15} />
                    <span>Suggest a Build</span>
                </button>
            )}
        </div>
    )
}
