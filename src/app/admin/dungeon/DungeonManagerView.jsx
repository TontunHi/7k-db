"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Landmark } from "lucide-react"
import styles from "./dungeon.module.css"

/**
 * DungeonManagerView - Main category list for Dungeon management
 */
export default function DungeonManagerView({ dungeons = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Landmark className="w-10 h-10 text-[#FFD700]" />
                    <h1 className={styles.title}>Dungeon Intel</h1>
                </div>
                <p className={styles.subtitle}>Configure team lineups and skill rotations for particle farming dungeons.</p>
            </header>

            <div className={styles.grid}>
                {dungeons.map((dungeon) => (
                    <Link
                        key={dungeon.key}
                        href={`/admin/dungeon/${dungeon.key}`}
                        className={styles.dungeonCard}
                    >
                        {/* Status Badge */}
                        {dungeon.setCount > 0 && (
                            <div className={styles.setCount}>
                                {dungeon.setCount} {dungeon.setCount === 1 ? 'Setup' : 'Setups'}
                            </div>
                        )}

                        <NextImage
                            src={dungeon.image}
                            alt={dungeon.name}
                            fill
                            className={styles.bgImage}
                        />
                        <div className={styles.overlay} />

                        <div className={styles.cardContent}>
                            <h3 className={styles.dungeonName}>
                                {dungeon.name}
                            </h3>
                            <div className={styles.accentBar} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
