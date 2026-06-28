"use client"

import SafeImage from "../shared/SafeImage"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { clsx } from "clsx"
import { useState, useEffect } from "react"
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
    { key: "effectResist", label: "Effect Resistance", icon: "/about_website/icon_effect_resistance.webp", unit: "%" },
    { key: "damageAmplification", label: "Damage Amplification", icon: "/about_website/icon_dedicated_damage_amplification.webp", unit: "%" },
    { key: "crush", label: "Crush", icon: "/about_website/icon_dedicated_crush.webp", unit: "%" },
    { key: "resilience", label: "Resilience", icon: "/about_website/icon_dedicated_resilience.webp", unit: "%" },
    { key: "rejuvenate", label: "Rejuvenate", icon: "/about_website/icon_dedicated_rejuvenate.webp", unit: "%" }
]

function getDedicatedStatIcon(stat) {
    switch (stat) {
        case "All Attack (%)": return "/about_website/icon_physical_attack.webp";
        case "Defense (%)": return "/about_website/icon_defense.webp";
        case "HP (%)": return "/about_website/icon_hp.webp";
        case "Effect Hit Rate": return "/about_website/icon_effect_hit_rate.webp";
        case "Effect Resistance": return "/about_website/icon_effect_resistance.webp";
        case "Damage Amplification": return "/about_website/icon_dedicated_damage_amplification.webp";
        case "Crush": return "/about_website/icon_dedicated_crush.webp";
        case "Resilience": return "/about_website/icon_dedicated_resilience.webp";
        case "Rejuvenate": return "/about_website/icon_dedicated_rejuvenate.webp";
        default: return null;
    }
}

const getSkillLabel = (skillPath) => {
    const filename = skillPath.split('/').pop().split('.')[0]
    if (filename === "4") return "Passive"
    if (filename === "3") return "Skill 3"
    if (filename === "2") return "Skill 2"
    if (filename === "1") return "Skill 1"
    return "Skill"
}

export default function BuildViewerModal({ hero, data, onClose }) {
    const [currentBuildIndex, setCurrentBuildIndex] = useState(0)
    const [activeTab, setActiveTab] = useState("equipment")

    useEffect(() => {
        if (data && data.builds && data.builds[currentBuildIndex]) {
            const build = data.builds[currentBuildIndex]
            if (activeTab === "guide" && !build.note) {
                setActiveTab("equipment")
            }
        }
    }, [currentBuildIndex, data, activeTab])

    if (!data) return null

    const { builds, heroData, skills: allSkills } = data
    const { skillPriority } = heroData

    const getPriorityRank = (skillPath) => {
        if (!skillPriority) return null
        const index = skillPriority.indexOf(skillPath)
        return index !== -1 ? index + 1 : null
    }

    const prioritizedSkills = allSkills
        .filter(s => getPriorityRank(s) !== null)
        .sort((a, b) => getPriorityRank(a)! - getPriorityRank(b)!)

    const unprioritizedSkills = allSkills
        .filter(s => {
            const filename = s.split('/').pop().split('.')[0]
            return ["1", "2", "3", "4"].includes(filename) && getPriorityRank(s) === null
        })
        .sort((a, b) => {
            const getNum = (s) => parseInt(s.split('/').pop().split('.')[0]) || 0
            return getNum(a) - getNum(b)
        })

    const build = builds[currentBuildIndex]

    const getModeBadgeClass = (mode) => {
        const lower = mode.toLowerCase()
        if (lower.includes("pvp")) return styles.badgePvp
        if (lower.includes("pve")) return styles.badgePve
        return styles.modeBadge
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.backdrop} onClick={onClose} />

            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton} aria-label="Close">
                    <X className="w-4 h-4" />
                </button>

                <div className={styles.contentWrapper}>
                    {/* LEFT SIDEBAR: Hero Profile Identity */}
                    <div className={styles.sidebar}>
                        <div className={styles.portraitContainer}>
                            <SafeImage
                                src={`/heroes/${hero.filename}${hero.filename?.endsWith('.webp') ? '' : '.webp'}`}
                                fill
                                className={styles.heroImage}
                                alt={hero.name}
                                sizes="120px"
                                priority
                            />
                        </div>

                        <h2 className={styles.heroName}>{hero.name}</h2>
                        
                        {/* Active Modes Highlighted */}
                        <div className={styles.modesRow}>
                            {build && (
                                <span className={styles.modeBadge} style={{ borderColor: '#d4af37', color: '#d4af37', background: 'rgba(212,175,55,0.05)' }}>
                                    Level {build.cLevel}
                                </span>
                            )}
                            {build?.mode?.map(m => (
                                <span key={m} className={getModeBadgeClass(m)}>
                                    {m}
                                </span>
                            ))}
                        </div>

                        {/* Recommended Upgrades Column */}
                        <div className={styles.skillPriorityContainer}>
                            <span className={styles.skillsTitle}>Recommended Upgrade</span>
                            <div className="flex flex-col items-center gap-3 mt-3">
                                {allSkills
                                    .sort((a, b) => {
                                        const getNum = (s) => parseInt(s.split('/').pop().split('.')[0]) || 0
                                        return getNum(b) - getNum(a)
                                    })
                                    .map((s, i) => {
                                        const isRecommended = skillPriority?.includes(s)
                                        return (
                                            <div key={i} className="relative w-12 h-12 bg-black/50 border border-gray-800 rounded-xl overflow-visible p-0.5 group/s shadow-md">
                                                <div className="relative w-full h-full overflow-hidden rounded-lg">
                                                    <SafeImage src={`/skills/${s}`} fill alt="skill" sizes="48px" className="object-cover" />
                                                </div>
                                                {isRecommended && (
                                                    <div className="absolute -top-2 -right-2 w-5 h-5 z-20">
                                                        <SafeImage
                                                            src="/about_website/icon_upgrade.png"
                                                            fill
                                                            unoptimized
                                                            className="object-contain"
                                                            alt="upgrade"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT MAIN PANEL */}
                    <div className={styles.mainPanel}>
                        {/* Multiple Builds Prominent Selector Tab bar with cLevel included */}
                        {builds.length > 1 && (
                            <div className={styles.buildTabsContainer}>
                                {builds.map((b, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentBuildIndex(idx)}
                                        className={clsx(
                                            styles.buildTabButton,
                                            idx === currentBuildIndex && styles.buildTabButtonActive
                                        )}
                                    >
                                        <span className={styles.buildTabNumber}>BUILD {idx + 1} ({b.cLevel})</span>
                                        <span className={styles.buildTabModes}>{b.mode.join(" / ")}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tabs Bar */}
                        <div className={styles.tabsContainer}>
                            <button
                                onClick={() => setActiveTab("equipment")}
                                className={clsx(styles.tabButton, activeTab === "equipment" && styles.tabButtonActive)}
                            >
                                Equipment
                            </button>
                            <button
                                onClick={() => setActiveTab("stats")}
                                className={clsx(styles.tabButton, activeTab === "stats" && styles.tabButtonActive)}
                            >
                                Attributes
                            </button>
                            {build?.note && (
                                <button
                                    onClick={() => setActiveTab("guide")}
                                    className={clsx(styles.tabButton, activeTab === "guide" && styles.tabButtonActive)}
                                >
                                    Note
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className={styles.tabContent}>
                            {build ? (
                                <>
                                    {/* TAB 1: EQUIPMENT */}
                                    {activeTab === "equipment" && (
                                        <div className="animate-in fade-in duration-300">
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
                                                                sizes="56px"
                                                            />
                                                        </div>
                                                        {acc.refined && (
                                                            <div className={styles.refinedContainer}>
                                                                <span className={styles.refiningLabel}>Refining</span>
                                                                <div className={styles.refinedImg} title="Refining accessory effect">
                                                                    <SafeImage
                                                                        src={`/items/accessory/${acc.refined}`}
                                                                        fill
                                                                        className="object-cover"
                                                                        alt="refined"
                                                                        sizes="28px"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {build.accessories.length === 0 && (
                                                    <div className="col-span-full py-8 text-center text-xs italic text-gray-500 uppercase tracking-wider">No accessories recommended</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 2: ATTRIBUTES */}
                                    {activeTab === "stats" && (
                                        <div className="animate-in fade-in duration-300 space-y-5">
                                            <div>
                                                <SectionLabel>Minimum Stats Target</SectionLabel>
                                                <div className={styles.statsBox}>
                                                    {MIN_STATS_KEYS.filter(s => build.minStats?.[s.key]).map((s) => (
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
                                                    {!MIN_STATS_KEYS.some(s => build.minStats?.[s.key]) && (
                                                        <div className="col-span-full py-8 text-center text-xs italic text-gray-500 uppercase tracking-wider">No minimum stats set</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.statsViewGrid}>
                                                <div>
                                                    <SectionLabel>Substats Priority</SectionLabel>
                                                    <div className={styles.substatsList}>
                                                        {build.substats.map((sub, idx) => (
                                                            <div key={idx} className={styles.substatBadge}>
                                                                <span className={styles.substatRank}>{idx + 1}</span>
                                                                <span>{sub}</span>
                                                            </div>
                                                        ))}
                                                        {build.substats.length === 0 && (
                                                            <div className="py-6 text-center text-xs italic text-gray-500 uppercase tracking-wider">No substats priority set</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <SectionLabel>Dedicated Stats</SectionLabel>
                                                    <div className="flex flex-col gap-2 w-full">
                                                        {Array.from({ length: 4 }).map((_, i) => {
                                                            const primary = build.dedicatedStats?.[i]
                                                            const secondary = build.dedicatedStats?.[i + 4]
                                                            
                                                            if (!primary && !secondary) return null
                                                            
                                                            const priIcon = primary ? getDedicatedStatIcon(primary) : null
                                                            const secIcon = secondary ? getDedicatedStatIcon(secondary) : null
                                                            
                                                            return (
                                                                <div key={i} className="grid grid-cols-2 gap-3 w-full">
                                                                    {primary ? (
                                                                        <div className={styles.dedicatedBadgePrimary}>
                                                                            {priIcon && (
                                                                                <div className={styles.dedicatedIcon}>
                                                                                    <SafeImage src={priIcon} fill alt="" className="object-contain" />
                                                                                </div>
                                                                            )}
                                                                            <span className={styles.dedicatedName}>{primary}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-full border border-dashed border-gray-800/10 rounded-lg min-h-[34px]" />
                                                                    )}
                                                                    {secondary ? (
                                                                        <div className={styles.dedicatedBadgeSecondary}>
                                                                            {secIcon && (
                                                                                <div className={styles.dedicatedIcon}>
                                                                                    <SafeImage src={secIcon} fill alt="" className="object-contain" />
                                                                                </div>
                                                                            )}
                                                                            <span className={styles.dedicatedName}>{secondary}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-full border border-dashed border-gray-800/10 rounded-lg min-h-[34px]" />
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                        {(!build.dedicatedStats || !build.dedicatedStats.some(Boolean)) && (
                                                            <div className="py-6 text-center text-xs italic text-gray-500 uppercase tracking-wider">No dedicated stats set</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 3: NOTE */}
                                    {activeTab === "guide" && build.note && (
                                        <div className="animate-in fade-in duration-300">
                                            <div className={styles.noteBox}>
                                                <div className={styles.noteAccent} />
                                                <h5 className={styles.noteTitle}>Note</h5>
                                                <p className={styles.noteText}>{build.note}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.noBuilds}>No build data configured.</div>
                            )}
                        </div>
                    </div>
                </div>
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
            EMPTY {type.toUpperCase()}
        </div>
    )

    const isWeapon = type.toLowerCase().includes("weapon")

    return (
        <div className={styles.viewerCard}>
            <div className={styles.itemImageWrapper}>
                <SafeImage
                    src={`/items/${isWeapon ? 'weapon' : 'armor'}/${item.image}`}
                    fill
                    className="object-cover"
                    alt={type}
                    sizes="48px"
                />
            </div>
            <div className={styles.itemInfo}>
                <span className={styles.itemType}>{type}</span>
                <span className={styles.itemName}>{item.image.replace(/\.[^/.]+$/, "").split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                <span className={styles.itemStat}>{item.stat}</span>
            </div>
        </div>
    )
}
