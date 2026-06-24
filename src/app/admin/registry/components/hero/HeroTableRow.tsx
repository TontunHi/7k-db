"use client"

import { useState, useEffect } from "react"
import { Edit3 } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "./HeroRegistry.module.css"
import { clsx } from "clsx"

export default function HeroTableRow({ hero, onEdit, onInlineUpdate }) {
    const [atkPhys, setAtkPhys] = useState(hero.atk_phys || 0)
    const [atkMag, setAtkMag] = useState(hero.atk_mag || 0)
    const [def, setDef] = useState(hero.def || 0)
    const [hp, setHp] = useState(hero.hp || 0)

    useEffect(() => {
        setAtkPhys(hero.atk_phys || 0)
        setAtkMag(hero.atk_mag || 0)
        setDef(hero.def || 0)
        setHp(hero.hp || 0)
    }, [hero.atk_phys, hero.atk_mag, hero.def, hero.hp])

    const handleBlur = (field, localVal, originalVal) => {
        const val = parseInt(localVal) || 0
        if (val !== originalVal) {
            onInlineUpdate(hero.filename, field, val)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.currentTarget.blur()
        }
    }

    const getTypeClass = (t: string) => {
        switch (t?.toLowerCase()) {
            case "attack": return styles.badgeTypeAttack
            case "magic": return styles.badgeTypeMagic
            case "universal": return styles.badgeTypeUniversal
            case "defense": return styles.badgeTypeDefense
            case "support": return styles.badgeTypeSupport
            default: return styles.badgeType
        }
    }

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
                        <select
                            value={hero.hero_group || ""}
                            onChange={(e) => onInlineUpdate(hero.filename, "hero_group", e.target.value === "" ? null : e.target.value)}
                            className={clsx(
                                styles.inlineSelect,
                                hero.hero_group === "Physical" ? styles.badgePhysical : (hero.hero_group === "Magic" ? styles.badgeMagic : styles.badgeType)
                            )}
                        >
                            <option value="">—</option>
                            <option value="Physical">Physical</option>
                            <option value="Magic">Magic</option>
                        </select>
                        <select
                            value={hero.type || ""}
                            onChange={(e) => onInlineUpdate(hero.filename, "type", e.target.value === "" ? null : e.target.value)}
                            className={clsx(styles.inlineSelect, getTypeClass(hero.type))}
                        >
                            <option value="">—</option>
                            {["Attack", "Magic", "Defense", "Support", "Universal"].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Phys Atk</span>
                        <input
                            type="number"
                            value={atkPhys}
                            onChange={(e) => setAtkPhys(e.target.value)}
                            onBlur={() => handleBlur("atk_phys", atkPhys, hero.atk_phys)}
                            onKeyDown={handleKeyDown}
                            className={styles.inlineInput}
                        />
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Mag Atk</span>
                        <input
                            type="number"
                            value={atkMag}
                            onChange={(e) => setAtkMag(e.target.value)}
                            onBlur={() => handleBlur("atk_mag", atkMag, hero.atk_mag)}
                            onKeyDown={handleKeyDown}
                            className={styles.inlineInput}
                        />
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Defense</span>
                        <input
                            type="number"
                            value={def}
                            onChange={(e) => setDef(e.target.value)}
                            onBlur={() => handleBlur("def", def, hero.def)}
                            onKeyDown={handleKeyDown}
                            className={styles.inlineInput}
                        />
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>HP</span>
                        <input
                            type="number"
                            value={hp}
                            onChange={(e) => setHp(e.target.value)}
                            onBlur={() => handleBlur("hp", hp, hero.hp)}
                            onKeyDown={handleKeyDown}
                            className={styles.inlineInput}
                        />
                    </div>
                </div>
            </td>
            <td className={clsx(styles.td, styles.actionsCell)}>
                <button 
                    onClick={() => onEdit(hero)}
                    className={styles.editButton}
                    title="Edit Registry Details"
                >
                    <Edit3 className={styles.editIcon} />
                </button>
            </td>
        </tr>
    )
}
