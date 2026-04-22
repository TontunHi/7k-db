"use client"

import SafeImage from "@/components/shared/SafeImage"
import { Plus } from "lucide-react"
import styles from "./tierlist.module.css"

/**
 * HeroPool - List of unassigned heroes available for the tierlist
 */
export default function HeroPool({ heroes, onDragStart, onClick }) {
    return (
        <div data-pool="true" className={styles.poolContainer}>
            <div className={styles.poolHeader}>
                <h3 className={styles.poolTitle}>Hero Reserve</h3>
                <span className={styles.poolCount}>{heroes.length} Available</span>
            </div>

            <div className={styles.poolList}>
                {heroes.map(hero => (
                    <div
                        key={hero.filename}
                        onMouseDown={(e) => onDragStart(e, hero.filename, "pool", `/heroes/${hero.filename}`)}
                        onClick={() => onClick(hero)}
                        className={styles.poolHero}
                        title={hero.name}
                    >
                        <SafeImage 
                            src={`/heroes/${hero.filename}`} 
                            fill 
                            className="object-cover" 
                            alt={hero.name} 
                            sizes="56px" 
                        />
                        <div className={styles.plusOverlay}>
                            <Plus size={24} className="text-[#FFD700]" />
                        </div>
                    </div>
                ))}

                {heroes.length === 0 && (
                    <p className={styles.emptyPool}>All heroes have been deployed to the Matrix.</p>
                )}
            </div>
        </div>
    )
}
