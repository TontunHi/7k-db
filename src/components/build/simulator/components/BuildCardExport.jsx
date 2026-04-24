'use client'
import { forwardRef } from 'react'
import { Sword, Wand2, Plus, Sparkles, Info } from 'lucide-react'
import { clsx } from 'clsx'
import { MIN_STATS_KEYS } from '../constants' // I will create this constants file
import styles from './BuildCardExport.module.css'

const BuildCardExport = forwardRef(({ hero, build, skills }, ref) => {
    return (
        <div 
            ref={ref}
            className={styles.exportCard}
        >
            {/* Background Glow */}
            <div className={styles.backgroundGlow}>
                <div className={styles.glowCircle} />
            </div>
            
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.brand}>
                    <div className={styles.logo}>7K</div>
                    <div className={styles.brandText}>
                        <h1 className={styles.brandTitle}>
                            BUILD <span className={styles.brandTitleAccent}>ARCHIVE</span>
                        </h1>
                        <p className={styles.brandUrl}>Powered by 7k-db.com</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Hero Visual */}
                <div className={styles.heroVisual}>
                    <div className={styles.heroGlow} />
                    <div className={styles.heroImageContainer}>
                        <img 
                            src={`/heroes/${hero.filename}`} 
                            className={styles.heroImage} 
                            alt="" 
                        />
                        <div className={styles.heroFade} />
                        
                        {/* C-Level Badge */}
                        {build.cLevel && build.cLevel !== "None" && (
                            <div className={styles.cLevelBadge}>
                                {build.cLevel}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats & Priority Grid */}
                <div className={styles.statsGrid}>
                    {/* Column 1: Equipment & Substats */}
                    <div className={styles.statsColumn}>
                        <div>
                            <h4 className={styles.sectionHeader}>
                                 <Sword className={styles.iconSmall} /> Equipment Set
                                 <div className={styles.headerLine} />
                            </h4>
                            <div className={styles.equipmentGrid}>
                                {[build.weapons[0], build.armors[0], build.weapons[1], build.armors[1]].map((item, idx) => {
                                    const type = idx % 2 === 0 ? 'weapon' : 'armor'
                                    return (
                                        <div key={idx} className={styles.itemBox}>
                                            <div className={styles.itemIconBox}>
                                                {item?.image && (
                                                    <img 
                                                        src={`/items/${type}/${item.image}`} 
                                                        className={styles.itemIcon} 
                                                        alt="" 
                                                    />
                                                )}
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <p className={styles.itemTypeLabel}>{type}</p>
                                                <p className={styles.itemStatName}>{item?.stat || ""}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 className={styles.sectionHeader}>
                                 <Wand2 className={styles.iconSmall} /> Substats Priority
                                 <div className={styles.headerLine} />
                            </h4>
                            <div className={styles.substatsList}>
                                 {build.substats.map((stat, idx) => (
                                     <div key={idx} className={styles.substatBadge}>
                                         <span className={styles.substatOrder}>#{idx+1}</span>
                                         <span className={styles.substatName}>{stat}</span>
                                     </div>
                                 ))}
                                 {build.substats.length === 0 && (
                                    <div className={styles.emptyStateText}>No priority set</div>
                                 )}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Accessories & Skills */}
                    <div className={styles.statsColumn}>
                        <div>
                            <h4 className={styles.sectionHeader}>
                                 <Plus className={styles.iconSmall} /> Accessories
                                 <div className={styles.headerLine} />
                            </h4>
                            <div className={styles.accessoriesRow}>
                                {build.accessories.filter(acc => acc.image).map((acc, idx) => (
                                    <div key={idx} className={styles.accessoryBox}>
                                        <div className={styles.accessoryIconBox}>
                                            <img src={`/items/accessory/${acc.image}`} className={styles.accessoryIcon} alt="" />
                                        </div>
                                        {acc.refined && (
                                            <div className={styles.refinedIconBox}>
                                                <img src={`/items/accessory/${acc.refined}`} className={styles.accessoryIcon} alt="" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {build.accessories.filter(acc => acc.image).length === 0 && (
                                    <div className={styles.emptyStateText}>No accessories equipped</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className={styles.sectionHeader}>
                                 <Sparkles className={styles.iconSmall} /> Skill Priority
                                 <div className={styles.headerLine} />
                            </h4>
                            <div className={styles.skillsRow}>
                                {skills.map((s, idx) => {
                                    const rankIndex = build.skillPriority.indexOf(s)
                                    const isRanked = rankIndex !== -1
                                    return (
                                        <div key={idx} className={styles.skillSlot}>
                                            <div className={clsx(
                                                styles.skillIconBox,
                                                !isRanked && styles.skillIconBoxInactive
                                            )}>
                                                <img src={`/skills/${s}`} className={styles.skillIcon} alt="" />
                                            </div>
                                            {isRanked && (
                                                <div className={styles.skillPriorityBadge}>
                                                    {rankIndex + 1}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Target Stats */}
                    <div className={styles.minStatsFullWidth}>
                        <h4 className={styles.sectionHeader}>
                             <Info className={styles.iconSmall} /> Target Stats
                             <div className={styles.headerLine} />
                        </h4>
                        <div className={styles.minStatsGrid}>
                             {MIN_STATS_KEYS.filter(s => build.minStats[s.key]).map(s => (
                                 <div key={s.key} className={styles.minStatBadge}>
                                     <div className={styles.minStatLabelBox}>
                                         <div className={styles.minStatIconBox}>
                                            <img src={s.icon} className={styles.itemIcon} alt="" />
                                         </div>
                                         <span className={styles.minStatLabel}>{s.label}</span>
                                     </div>
                                     <span className={styles.minStatValue}>{build.minStats[s.key]}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerLine} />
                <p className={styles.footerText}>Designed at 7k-db.com</p>
            </div>
        </div>
    )
})

BuildCardExport.displayName = "BuildCardExport"

export default BuildCardExport
