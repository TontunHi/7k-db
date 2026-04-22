"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Crown } from "lucide-react"
import styles from "./castle-rush.module.css"

/**
 * CastleRushManagerView - Dashboard for Castle Rush bosses
 */
export default function CastleRushManagerView({ bosses = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Crown className="w-10 h-10 text-amber-500" />
                    <h1 className={styles.title}>Castle Rush</h1>
                </div>
                <p className={styles.subtitle}>Manage team recommendations and tactical rotations for daily Castle Rush boss encounters.</p>
            </header>

            <div className={styles.grid}>
                {bosses.map((boss) => (
                    <Link
                        key={boss.key}
                        href={`/admin/castle-rush/${boss.key}`}
                        className={styles.bossCard}
                    >
                        {/* Set Count Badge */}
                        {boss.setCount > 0 && (
                            <div className={styles.setBadge}>
                                {boss.setCount} {boss.setCount === 1 ? 'Set' : 'Sets'}
                            </div>
                        )}

                        <NextImage
                            src={boss.image}
                            alt={boss.name}
                            fill
                            className={styles.bgImage}
                            priority
                        />
                        <div className={styles.overlay} />

                        <div className={styles.cardContent}>
                            <h3 className={styles.bossName}>
                                {boss.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
