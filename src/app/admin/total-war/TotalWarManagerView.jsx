"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Swords } from "lucide-react"
import { TIER_CONFIG } from "@/lib/total-war-config"
import styles from "./total-war.module.css"

/**
 * TotalWarManagerView - Dashboard for Total War tier selection
 */
export default function TotalWarManagerView({ setCounts = {} }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Swords className="w-10 h-10 text-red-500" />
                    <h1 className={styles.title}>Total War</h1>
                </div>
                <p className={styles.subtitle}>Configure multi-team deployment strategies across different difficulty tiers.</p>
            </header>

            <div className={styles.grid}>
                {TIER_CONFIG.map((tier) => {
                    const count = setCounts[tier.key] || 0

                    return (
                        <Link
                            key={tier.key}
                            href={`/admin/total-war/${tier.key}`}
                            className={styles.tierCard}
                        >
                            {/* Set count badge */}
                            <div className={styles.setBadge}>
                                {count} {count === 1 ? 'Set' : 'Sets'}
                            </div>

                            <div className={styles.tierLogo}>
                                <NextImage
                                    src={tier.logo}
                                    alt={tier.label}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div>
                                <h2 className={styles.tierName} style={{ color: tier.accent }}>
                                    {tier.label}
                                </h2>
                                <p className={styles.tierMeta}>
                                    {tier.maxTeams} teams / set
                                </p>
                            </div>

                            <div 
                                className={styles.tierLine} 
                                style={{ background: `linear-gradient(to right, transparent, ${tier.accent}, transparent)` }} 
                            />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
