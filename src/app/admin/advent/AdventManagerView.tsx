"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Marker, SystemBadge } from "../components/AdminEditorial"
import styles from "./advent.module.css"

/**
 * AdventManagerView - Dashboard for Advent Expedition bosses
 */
export default function AdventManagerView({ bosses = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Marker color="bg-violet-500" className="w-2 h-10" />
                    <h1 className={styles.title}>ADVENT</h1>
                </div>
            </header>

            <div className={styles.grid}>
                {bosses.map((boss) => (
                    <Link
                        key={boss.key}
                        href={`/admin/advent/${boss.key}`}
                        className={styles.bossCard}
                    >
                        {/* Set Count Badge - High Contrast Floating */}
                        {boss.setCount > 0 && (
                            <div className="absolute top-4 right-4 z-20">
                                <div className="bg-violet-600 text-white px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-600/30">
                                    {boss.setCount} SQUADS
                                </div>
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
                                <div className="text-4xl font-black opacity-5 italic">IMG_MISSING</div>
                            </div>
                        )}
                        <div className={styles.overlay} />
                    </Link>
                ))}
            </div>
        </div>
    )
}
