"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Skull } from "lucide-react"
import styles from "./raid.module.css"

/**
 * RaidManagerView - Dashboard for Raid boss management
 */
export default function RaidManagerView({ raids = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Skull className="w-10 h-10 text-[#ef4444]" />
                    <h1 className={styles.title}>Raid Protocols</h1>
                </div>
                <p className={styles.subtitle}>Deploy tactical lineups and optimal skill rotations for high-level Raid encounters.</p>
            </header>

            <div className={styles.grid}>
                {raids.map((raid) => (
                    <Link
                        key={raid.key}
                        href={`/admin/raid/${raid.key}`}
                        className={styles.raidCard}
                    >
                        {/* Set Count Badge */}
                        {raid.setCount > 0 && (
                            <div className={styles.setBadge}>
                                {raid.setCount} {raid.setCount === 1 ? 'Squad' : 'Squads'}
                            </div>
                        )}

                        <NextImage
                            src={raid.image}
                            alt={raid.name}
                            fill
                            className={styles.bgImage}
                        />
                        <div className={styles.overlay} />

                        <div className={styles.cardContent}>
                            <h3 className={styles.raidName}>
                                {raid.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Skull size={14} className="text-red-500" />
                                <span className="text-[10px] font-black uppercase text-red-500/80 tracking-widest">Tactical Management</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
