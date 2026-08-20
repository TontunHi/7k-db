'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ChevronRight, Sparkles } from 'lucide-react'
import styles from './ModeQuickSwitchNav.module.css'

export interface QuickSwitchItem {
    key: string
    name: string
    href: string
    subtext?: string
}

interface ModeQuickSwitchNavProps {
    modeTitle: string
    modeHref: string
    currentKey: string
    currentName: string
    items: QuickSwitchItem[]
    theme?: 'gold' | 'cyan' | 'red'
}

export default function ModeQuickSwitchNav({
    modeTitle,
    modeHref,
    currentKey,
    currentName,
    items = [],
    theme = 'gold'
}: ModeQuickSwitchNavProps) {
    const activeClass = theme === 'cyan'
        ? styles.switchPillActiveCyan
        : theme === 'red'
            ? styles.switchPillActiveRed
            : styles.switchPillActiveGold

    const crumbCurrentClass = theme === 'cyan'
        ? styles.crumbCurrentCyan
        : theme === 'red'
            ? styles.crumbCurrentRed
            : styles.crumbCurrent

    return (
        <div className={styles.container}>
            {/* 1. Breadcrumbs Trail */}
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/" className={styles.crumbLink}>
                    <Home size={13} />
                    <span>Home</span>
                </Link>
                <span className={styles.crumbSeparator}>
                    <ChevronRight size={12} />
                </span>
                <Link href={modeHref} className={styles.crumbLink}>
                    <span>{modeTitle}</span>
                </Link>
                <span className={styles.crumbSeparator}>
                    <ChevronRight size={12} />
                </span>
                <span className={crumbCurrentClass}>{currentName}</span>
            </nav>

            {/* 2. Quick Boss Switcher Strip */}
            {items.length > 0 && (
                <div className={styles.stripWrapper}>
                    {items.map((item) => {
                        const isActive = item.key === currentKey
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`${styles.switchPill} ${isActive ? activeClass : ''}`}
                            >
                                <Sparkles size={11} className={isActive ? 'opacity-100' : 'opacity-40'} />
                                <span>{item.name}</span>
                                {item.subtext && (
                                    <span className={styles.pillSubtext}>({item.subtext})</span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
