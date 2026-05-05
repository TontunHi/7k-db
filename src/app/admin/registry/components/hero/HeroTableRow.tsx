"use client"

import { Edit3 } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "./HeroRegistry.module.css"
import { clsx } from "clsx"

export default function HeroTableRow({ hero, onEdit }) {
    return (
        <tr className={styles.tr}>
            <td className={styles.td}>
                <div className={styles.heroCell}>
                    <div className={styles.heroImageWrapper}>
                        <SafeImage 
                            src={`/heroes/${hero.filename}.webp`} 
                            fill 
                            className="object-cover" 
                            alt=""
                        />
                    </div>
                    <div>
                        <div className={styles.heroName}>{hero.name}</div>
                        <div className={styles.heroGrade}>{hero.grade}</div>
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <div className={styles.badgeContainer}>
                    <div className={styles.badgeWrapper}>
                        <span className={clsx(
                            styles.badge,
                            hero.hero_group === "Physical" ? styles.badgePhysical : styles.badgeMagic
                        )}>
                            {hero.hero_group || "—"}
                        </span>
                        <span className={clsx(styles.badge, styles.badgeType)}>
                            {hero.type || "—"}
                        </span>
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Atk / Matk</span>
                        <span className={styles.statValue}>{hero.atk_phys || 0} / {hero.atk_mag || 0}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Defense</span>
                        <span className={styles.statValue}>{hero.def || 0}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>HP</span>
                        <span className={styles.statValue}>{hero.hp || 0}</span>
                    </div>
                </div>
            </td>
            <td className={clsx(styles.td, styles.actionsCell)}>
                <button 
                    onClick={() => onEdit(hero)}
                    className={styles.editButton}
                    title="Edit Registry"
                >
                    <Edit3 className={styles.editIcon} />
                </button>
            </td>
        </tr>
    )
}
