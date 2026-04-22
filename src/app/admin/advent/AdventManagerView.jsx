"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Compass } from "lucide-react"
import styles from "./advent.module.css"

/**
 * AdventManagerView - Dashboard for Advent Expedition bosses
 */
export default function AdventManagerView({ bosses = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Compass className="w-10 h-10 text-violet-400" />
                    <h1 className={styles.title}>Advent Expedition</h1>
                </div>
                <p className={styles.subtitle}>Manage tactical deployment strategies for Advent Expedition bosses.</p>
            </header>

            <div className={styles.grid}>
                {bosses.map((boss) => (
                    <Link
                        key={boss.key}
                        href={`/admin/advent/${boss.key}`}
                        className={styles.bossCard}
                    >
                        {/* Set Count Badge */}
                        {boss.setCount > 0 && (
                            <div className={styles.setBadge}>
                                {boss.setCount} {boss.setCount === 1 ? 'Set' : 'Sets'}
                            </div>
                        )}

                        <div className="absolute inset-0 bg-violet-900/10 z-0" />
                        
                        {boss.image && !boss.image.includes('undefined') ? (
                            <NextImage
                                src={boss.image}
                                alt={boss.name}
                                fill
                                className={styles.bgImage}
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Compass className="w-16 h-16 text-gray-700 opacity-20" />
                            </div>
                        )}
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
