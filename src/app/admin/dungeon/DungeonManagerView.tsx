"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Marker, SystemBadge } from "@/app/admin/components/AdminEditorial"
import styles from "./dungeon.module.css"

/**
 * DungeonManagerView - Main category list for Dungeon management
 */
export default function DungeonManagerView({ dungeons = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Marker color="bg-[#FFD700]" className="w-2 h-10" />
                    <h1 className={styles.title}>Dungeon Intelligence</h1>
                </div>
            </header>

            <div className={styles.grid}>
                {dungeons.map((dungeon) => (
                    <Link
                        key={dungeon.key}
                        href={`/admin/dungeon/${dungeon.key}`}
                        className={styles.dungeonCard}
                    >
                        {/* Status Badge - Floating High Contrast */}
                        {dungeon.setCount > 0 && (
                            <div className="absolute top-4 right-4 z-20">
                                <div className="bg-emerald-600 text-white px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/30">
                                    {dungeon.setCount} SQUADS
                                </div>
                            </div>
                        )}

                        <NextImage
                            src={dungeon.image}
                            alt={dungeon.name}
                            fill
                            className={styles.bgImage}
                        />
                        <div className={styles.overlay} />
                    </Link>
                ))}
            </div>
        </div>
    )
}
