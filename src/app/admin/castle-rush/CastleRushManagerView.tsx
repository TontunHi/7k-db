"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Marker, SystemBadge } from "../components/AdminEditorial"
import styles from "./castle-rush.module.css"

/**
 * CastleRushManagerView - Dashboard for Castle Rush bosses
 */
export default function CastleRushManagerView({ bosses = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Marker color="bg-amber-500" className="w-2 h-10" />
                    <h1 className={styles.title}>CASTLE RUSH</h1>
                </div>
            </header>

            <div className={styles.grid}>
                {bosses.map((boss) => (
                    <Link
                        key={boss.key}
                        href={`/admin/castle-rush/${boss.key}`}
                        className={styles.bossCard}
                    >
                        {/* Set Count Badge - High Contrast Floating */}
                        {boss.setCount > 0 && (
                            <div className="absolute top-4 right-4 z-20">
                                <div className="bg-amber-600 text-white px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/30">
                                    {boss.setCount} SQUADS
                                </div>
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
                    </Link>
                ))}
            </div>
        </div>
    )
}
