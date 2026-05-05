'use client'
import { forwardRef } from 'react'
import { Trash2 } from 'lucide-react'
import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import { RANKS, TYPES, LAYOUT_MODES } from '../constants'
import styles from './TierlistWorkspace.module.css'

const TierlistWorkspace = forwardRef<HTMLDivElement, any>(({ 
    title, layoutMode, tiers, onAddHero, onRemoveHero 
}, ref) => {
    return (
        <div className={styles.workspace}>
            <div ref={ref} className={styles.exportContainer}>
                
                <div className={styles.workspaceHeader}>
                    <div className={styles.workspaceHeaderAccent}></div>
                    <h2 className={styles.workspaceTitle}>{title}</h2>
                </div>

                {layoutMode === LAYOUT_MODES.SIMPLE ? (
                    <div className={styles.listContainer}>
                        {RANKS.map((rank) => (
                            <div key={rank} className={styles.listRow}>
                                <div className={styles.rankLabelBox}>
                                    <div className={styles.rankIconWrapper}>
                                        <SafeImage 
                                            src={`/logo_tiers/rank_tier/${rank}.webp`} 
                                            fill 
                                            unoptimized 
                                            className="object-contain" 
                                            alt={rank} 
                                        />
                                    </div>
                                </div>
                                <div 
                                    className={styles.listCell}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        try {
                                            const hero = JSON.parse(e.dataTransfer.getData("hero"))
                                            onAddHero(hero, rank)
                                        } catch (err) {}
                                    }}
                                >
                                    {(tiers[rank] || []).map((hero) => (
                                        <div 
                                            key={hero.filename} 
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData("hero", JSON.stringify(hero))
                                            }}
                                            onClick={() => onRemoveHero(hero, rank)} 
                                            className={styles.heroItem}
                                        >
                                            <div className={styles.heroPortrait}>
                                                <SafeImage src={`/heroes/${hero.filename}`} fill unoptimized className="object-cover" alt="" />
                                                <div className={styles.deleteOverlay}>
                                                    <Trash2 className={styles.trashIcon} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.matrixTable}>
                            <thead>
                                <tr>
                                    <th className={styles.thRank}>
                                        <div className={styles.rtBadge}>
                                            <span className={styles.rtText}>R / T</span>
                                        </div>
                                    </th>
                                    {TYPES.map(type => (
                                        <th key={type} className={styles.thType}>
                                            <div className={styles.typeIconWrapper}>
                                                <SafeImage 
                                                    src={`/logo_tiers/type/${type.toLowerCase()}.webp`} 
                                                    fill 
                                                    unoptimized 
                                                    className="object-contain" 
                                                    alt={type} 
                                                />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RANKS.map((rank) => (
                                    <tr key={rank}>
                                        <th className={styles.tdRank}>
                                            <div className={styles.rankIconWrapper}>
                                                <SafeImage 
                                                    src={`/logo_tiers/rank_tier/${rank}.webp`} 
                                                    fill 
                                                    unoptimized 
                                                    className="object-contain" 
                                                    alt={rank} 
                                                />
                                            </div>
                                        </th>
                                        {TYPES.map(type => {
                                            const cellKey = `${rank}-${type}`
                                            const cellHeroes = tiers[cellKey] || []
                                            return (
                                                <td 
                                                    key={type} 
                                                    className={styles.tdCell}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        try {
                                                            const hero = JSON.parse(e.dataTransfer.getData("hero"))
                                                            onAddHero(hero, rank, type)
                                                        } catch (err) {}
                                                    }}
                                                >
                                                    <div className={styles.cellContent}>
                                                        {cellHeroes.map(hero => (
                                                            <div 
                                                                key={hero.filename} 
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData("hero", JSON.stringify(hero))
                                                                }}
                                                                onClick={() => onRemoveHero(hero, cellKey)} 
                                                                className={clsx(styles.heroItem, styles.heroItemMatrix)}
                                                            >
                                                                <div className={styles.heroPortrait}>
                                                                    <SafeImage src={`/heroes/${hero.filename}`} fill unoptimized className="object-cover" alt="" />
                                                                    <div className={styles.deleteOverlay}>
                                                                        <Trash2 className={styles.trashIcon} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
})

TierlistWorkspace.displayName = 'TierlistWorkspace'
export default TierlistWorkspace
