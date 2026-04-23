"use client"

import SafeImage from "../shared/SafeImage"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { clsx } from "clsx"
import { useState } from "react"
import styles from "./BuildViewerModal.module.css"

const MIN_STATS_KEYS = [
    { key: "physAtk", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp" },
    { key: "defense", label: "Defense", icon: "/about_website/icon_defense.webp" },
    { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
    { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
    { key: "critRate", label: "Crit Rate", icon: "/about_website/icon_crit_rate.webp", unit: "%" },
    { key: "critDamage", label: "Crit Damage", icon: "/about_website/icon_crit_damage.webp", unit: "%" },
    { key: "weaknessHit", label: "Weakness Hit Chance", icon: "/about_website/icon_weakness_hit_chance.webp", unit: "%" },
    { key: "blockRate", label: "Block Rate", icon: "/about_website/icon_block_rate.webp", unit: "%" },
    { key: "damageReduction", label: "Damage Taken Reduction", icon: "/about_website/icon_damage_taken_reduction.webp", unit: "%" },
    { key: "effectHit", label: "Effect Hit Rate", icon: "/about_website/icon_effect_hit_rate.webp", unit: "%" },
    { key: "effectResist", label: "Effect Resistance", icon: "/about_website/icon_effect_resistance.webp", unit: "%" }
]

export default function BuildViewerModal({ hero, data, onClose }) {
    const [currentBuildIndex, setCurrentBuildIndex] = useState(0)

    if (!data) return null

    const { builds, heroData, skills: allSkills } = data
    const { skillPriority } = heroData

    const sortedSkills = allSkills
        .filter(s => {
            const filename = s.split('/').pop().split('.')[0]
            return ["1", "2", "3", "4"].includes(filename)
        })
        .sort((a, b) => {
            const getNum = (s) => parseInt(s.split('/').pop().split('.')[0]) || 0
            return getNum(b) - getNum(a)
        })

    const getPriorityRank = (skillPath) => {
        if (!skillPriority) return null
        const index = skillPriority.indexOf(skillPath)
        return index !== -1 ? index + 1 : null
    }

    const goNext = () => setCurrentBuildIndex(prev => (prev === builds.length - 1 ? 0 : prev + 1))
    const goPrev = () => setCurrentBuildIndex(prev => (prev === 0 ? builds.length - 1 : prev - 1))

    return (
        <div className={styles.overlay}>
            {/* Backdrop click */}
            <div className={styles.backdrop} onClick={onClose} />

            {/* Main Container */}
            <div className={styles.modal}>
                
                {/* Close button */}
                <button onClick={onClose} className={styles.closeButton} aria-label="Close">
                    <X className="w-5 h-5" />
                </button>

                {/* Content Wrapper */}
                <div className={styles.contentWrapper}>
                    
                    {/* Compact Header Section */}
                    <div className={styles.header}>
                        <div className={styles.portrait}>
                            <SafeImage
                                src={`/heroes/${hero.filename}${hero.filename?.endsWith('.webp') ? '' : '.webp'}`}
                                fill
                                className={styles.heroImage}
                                alt={hero.name}
                                sizes="64px"
                            />
                        </div>

                        <div className={styles.heroInfo}>
                            <h2 className={styles.heroName}>{hero.name}</h2>
                            <div className={styles.skillsRow}>
                                {sortedSkills.map((s, i) => {
                                    const rank = getPriorityRank(s)
                                    return (
                                        <div key={i} className={clsx(
                                            styles.skillItem,
                                            rank ? styles.skillItemActive : styles.skillItemInactive
                                        )}>
                                            <SafeImage src={`/skills/${s}`} fill alt="skill" sizes="32px" className="rounded-md" />
                                            {rank && <div className={styles.skillPriority}>{rank}</div>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Build Content */}
                    <div className={styles.buildContent}>
                        {builds.length > 0 ? (
                            <div>
                                {(() => {
                                    const build = builds[currentBuildIndex]
                                    return (
                                        <div key={currentBuildIndex} className={styles.buildWrapper}>
                                            {/* Build Metadata */}
                                            <div className={styles.metaRow}>
                                                <span className={styles.cLevel}>
                                                    Level {build.cLevel}
                                                </span>
                                                {build.mode.map(m => (
                                                    <span key={m} className={styles.modeBadge}>
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Equipment Grid */}
                                            <div className={styles.equipmentGrid}>
                                                {/* Gear Column */}
                                                <div className={styles.section}>
                                                    <SectionLabel>Combat Equipment</SectionLabel>
                                                    <div className={styles.gearGrid}>
                                                        <ViewerItemCard item={build.weapons[0]} type="Weapon" />
                                                        <ViewerItemCard item={build.armors[0]} type="Armor" />
                                                        <ViewerItemCard item={build.weapons[1]} type="Weapon" />
                                                        <ViewerItemCard item={build.armors[1]} type="Armor" />
                                                    </div>
                                                    
                                                    <SectionLabel>Accessory & Refining</SectionLabel>
                                                    <div className={styles.accessoryList}>
                                                        {build.accessories.map((acc, idx) => (
                                                            <div key={idx} className={styles.accessoryItem}>
                                                                <div className={styles.accessoryImg}>
                                                                    <SafeImage 
                                                                        src={`/items/accessory/${acc.image}`} 
                                                                        fill 
                                                                        className="object-cover" 
                                                                        alt="acc" 
                                                                        sizes="48px"
                                                                    />
                                                                </div>
                                                                {acc.refined && (
                                                                    <div className={styles.refinedImg}>
                                                                        <SafeImage 
                                                                            src={`/items/accessory/${acc.refined}`} 
                                                                            fill 
                                                                            className="object-cover" 
                                                                            alt="refined" 
                                                                            sizes="32px"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Stats Column */}
                                                <div className={styles.section}>
                                                    <SectionLabel>Minimum Stats Priority</SectionLabel>
                                                    <div className={styles.statsBox}>
                                                        {MIN_STATS_KEYS.filter(s => build.minStats[s.key]).map((s) => (
                                                            <div key={s.key} className={styles.statRow}>
                                                                <div className={styles.statLabelWrapper}>
                                                                    <div className={styles.statIcon}>
                                                                        <SafeImage src={s.icon} fill alt="" className="object-contain" />
                                                                    </div>
                                                                    <span className={styles.statLabel}>{s.label}</span>
                                                                </div>
                                                                <div className={styles.statValueWrapper}>
                                                                    <span className={styles.statValue}>{build.minStats[s.key]}</span>
                                                                    {s.unit && <span className={styles.statUnit}>{s.unit}</span>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <SectionLabel>Substats Priority</SectionLabel>
                                                    <div className={styles.substatsList}>
                                                        {build.substats.map((sub, idx) => (
                                                            <span key={idx} className={styles.substatBadge}>
                                                                <span className={styles.substatRank}>{idx + 1}</span>
                                                                {sub}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Note */}
                                            {build.note && (
                                                <div className={styles.noteBox}>
                                                    <div className={styles.noteAccent} />
                                                    <h5 className={styles.noteTitle}>Tactical Note</h5>
                                                    <p className={styles.noteText}>{build.note}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        ) : (
                            <div className={styles.noBuilds}>No builds available.</div>
                        )}
                    </div>

                </div>

                {/* Pagination - Fixed at bottom */}
                {builds.length > 1 && (
                    <div className={styles.pagination}>
                        <button onClick={goPrev} className={styles.navButton}><ChevronLeft className="w-4 h-4"/></button>
                        <div className={styles.dotsRow}>
                            {builds.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentBuildIndex(idx)}
                                    className={clsx(styles.dot, idx === currentBuildIndex ? styles.dotActive : styles.dotInactive)}
                                />
                            ))}
                        </div>
                        <button onClick={goNext} className={styles.navButton}><ChevronRight className="w-4 h-4"/></button>
                    </div>
                )}
            </div>
        </div>
    )
}

function SectionLabel({ children }) {
    return (
        <h4 className={styles.sectionLabel}>
            <span className={styles.sectionDot} />
            {children}
        </h4>
    )
}

function ViewerItemCard({ item, type }) {
    if (!item?.image) return (
        <div className={styles.emptyCard}>
            EMPTY
        </div>
    )

    return (
        <div className={styles.viewerCard}>
            <div className={styles.itemImageWrapper}>
                <SafeImage
                    src={`/items/${type.toLowerCase()}/${item.image}`}
                    fill
                    className="object-cover"
                    alt={type}
                    sizes="44px"
                />
            </div>

            <div className={styles.itemInfo}>
                <div className={styles.itemType}>{type}</div>
                <div className={styles.itemStat}>{item.stat}</div>
            </div>
        </div>
    )
}
