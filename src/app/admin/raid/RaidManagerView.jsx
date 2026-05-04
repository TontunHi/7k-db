"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Marker, SystemBadge } from "../components/AdminEditorial"
import styles from "./raid.module.css"

/**
 * RaidManagerView - Dashboard for Raid boss management
 */
export default function RaidManagerView({ raids = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Marker color="bg-red-600" className="w-2 h-10" />
                    <h1 className={styles.title}>RAID</h1>
                </div>
            </header>

            <div className={styles.grid}>
                {raids.map((raid) => (
                    <Link
                        key={raid.key}
                        href={`/admin/raid/${raid.key}`}
                        className={styles.raidCard}
                    >
                        {/* Set Count Badge - High Contrast Floating */}
                        {raid.setCount > 0 && (
                            <div className="absolute top-4 right-4 z-20">
                                <div className="bg-red-600 text-white px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/30">
                                    {raid.setCount} SQUADS
                                </div>
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
                            <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter drop-shadow-2xl uppercase">
                                {raid.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
