"use client"

import SafeImage from "@/components/shared/SafeImage"
import { Edit2, X } from "lucide-react"
import { parseHeroDetails } from "@/lib/hero-utils"
import styles from "./tierlist.module.css"

/**
 * TierlistMatrix - The Rank/Type table with drop zones
 */
export default function TierlistMatrix({ 
    ranks, 
    types, 
    tierData, 
    onDragStart, 
    onClick, 
    onRemove 
}) {
    return (
        <div className={styles.tableWrapper}>
            <div className={styles.scrollContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.thHeader}>Rank \ Type</th>
                            {types.map(type => (
                                <th key={type} className={styles.thHeader}>
                                    <div className={styles.typeIconWrapper}>
                                        <SafeImage 
                                            src={`/logo_tiers/type/${type.toLowerCase()}.webp`} 
                                            fill 
                                            className="object-contain" 
                                            alt={type} 
                                            sizes="96px" 
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ranks.map(rank => (
                            <tr key={rank}>
                                <th className={styles.thSide}>
                                    <div className={styles.rankIconWrapper}>
                                        <SafeImage 
                                            src={`/logo_tiers/rank_tier/${rank}.webp`} 
                                            fill 
                                            className="object-contain" 
                                            alt={rank} 
                                            sizes="56px" 
                                        />
                                    </div>
                                </th>
                                {types.map(type => {
                                    const cellHeroes = tierData.filter(d => d.rank === rank && d.type === type)
                                    return (
                                        <td
                                            key={type}
                                            data-rank={rank}
                                            data-type={type}
                                            className={styles.cell}
                                        >
                                            <div
                                                data-rank={rank}
                                                data-type={type}
                                                className={styles.dropZone}
                                            >
                                                {cellHeroes.map(entry => {
                                                    const { name } = parseHeroDetails(entry.heroFilename)
                                                    return (
                                                        <div
                                                            key={entry.heroFilename}
                                                            data-rank={rank}
                                                            data-type={type}
                                                            className={styles.heroItem}
                                                            onMouseDown={(e) => onDragStart(e, entry.heroFilename, "grid", `/heroes/${entry.heroFilename}`)}
                                                            onClick={(e) => onClick(e, entry)}
                                                            title={`${name} — Click to reassign, drag to move`}
                                                        >
                                                            <div className={styles.heroImageWrapper}>
                                                                <SafeImage 
                                                                    src={`/heroes/${entry.heroFilename}`} 
                                                                    fill 
                                                                    className="object-cover" 
                                                                    alt={name} 
                                                                    sizes="48px" 
                                                                />
                                                            </div>
                                                            <div className={styles.editOverlay}>
                                                                <Edit2 size={12} className="text-[#FFD700]" />
                                                            </div>
                                                            <button
                                                                className={styles.removeBtn}
                                                                onClick={(e) => onRemove(e, entry)}
                                                                title="Remove from category"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
