'use client'
import { useState } from 'react'
import { ChevronDown, Zap } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import PetDisplay from '@/components/shared/PetDisplay'
import { getSlotType, getStaggerClass, getSkillImagePath } from '@/lib/formation-utils'
import { clsx } from 'clsx'
import styles from './CounterTeamModule.module.css'

export default function CounterTeamModule({ ct, heroImageMap, accentColor = '#f43f5e' }) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    
    return (
        <div className={clsx(
            styles.teamWrapper,
            !isCollapsed && styles.teamWrapperActive
        )}
        style={{ '--accent-color': accentColor }}
        >
            {/* Collapsed Banner */}
            <div 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={styles.banner}
            >
                <div className={styles.bannerLayout}>
                    {/* Portraits */}
                    <div className={styles.portraits}>
                        {(ct.heroes || []).filter(h => h).map((hero, i, arr) => (
                            <div
                                key={i}
                                className={styles.portraitWrapper}
                                style={{ maxWidth: `${100 / Math.max(arr.length, 3)}%` }}
                            >
                                <div className={styles.portrait}>
                                    <SafeImage src={`/heroes/${hero}`} alt="" fill className={styles.portraitImage} />
                                    {i === arr.length - 1 && <div className={styles.portraitFade} />}
                                    <div className={styles.portraitShadow} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className={styles.info}>
                        {ct.formation && (
                            <span className={styles.formationBadge} style={{ 
                                backgroundColor: `${accentColor}1a`, 
                                color: accentColor, 
                                borderColor: `${accentColor}33` 
                            }}>
                                {ct.formation}
                            </span>
                        )}
                        <h5 className={styles.teamName}>
                            {ct.team_name || 'Counter Team'}
                        </h5>
                        {ct.pet_file && (
                            <div className={styles.petMini}>
                                <SafeImage 
                                    src={ct.pet_file.startsWith('/') ? ct.pet_file : `/pets/${ct.pet_file}`} 
                                    alt="" 
                                    fill 
                                    className={styles.miniPetImage} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Chevron */}
                    <div className={styles.action}>
                        <ChevronDown 
                            className={clsx(styles.chevron, !isCollapsed && styles.chevronActive)} 
                            size={18} 
                        />
                    </div>
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.expandedContent}>
                    <div className={styles.grid}>
                        {/* Summary */}
                        <div className={styles.summaryArea}>
                              <div className={styles.formationPreview}>
                                    <div className={styles.gridContainer}>
                                        {[0, 1, 2, 3, 4].map(slotIdx => {
                                            const heroFile = ct.heroes?.[slotIdx]
                                            const type = getSlotType(ct.formation, slotIdx)
                                            const isFront = type === 'front'
                                            const hasStagger = getStaggerClass(ct.formation, slotIdx) !== ''
                                            
                                            return (
                                                <div key={slotIdx} className={clsx(
                                                    styles.heroSlot,
                                                    hasStagger && styles.stagger,
                                                    heroFile && (isFront ? styles.slotFront : styles.slotBack),
                                                    !heroFile && styles.slotEmpty
                                                )}>
                                                    {heroFile && (
                                                        <div className={styles.heroImageWrapper}>
                                                            <SafeImage src={`/heroes/${heroFile}`} alt="" fill className={styles.heroPortrait} />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                            </div>
                            <div className={styles.petOverview}>
                                <div className={styles.petMainWrapper}>
                                    <PetDisplay 
                                        petFile={ct.pet_file ? (ct.pet_file.startsWith('/') ? ct.pet_file : `/pets/${ct.pet_file}`) : null} 
                                        hideLabel={true}
                                        customClasses={{ wrapper: styles.mainPetBox, image: styles.mainPetImage }}
                                    />
                                    
                                    {ct.pet_supports && ct.pet_supports.filter(p => p).length > 0 && (
                                        <div className={styles.supportsList}>
                                            {ct.pet_supports.filter(p => p).map((p, i) => (
                                                <div key={i} className={styles.supportBox}>
                                                    <SafeImage src={p.startsWith('/') ? p : `/pets/${p}`} alt="" fill className={styles.supportImage} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {ct.note && <p className={styles.setNote}>{ct.note}</p>}
                            </div>
                        </div>

                        {/* Items */}
                        <div className={styles.itemsArea}>
                            {((ct.selection_order && ct.selection_order.length > 0) ? ct.selection_order : (ct.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).slice(0, 3).map((slotIdx, heroIdx) => {
                                const heroFile = ct.heroes?.[slotIdx]
                                const itemSet = ct.items?.[heroIdx]
                                if (!heroFile || !itemSet) return null
                                return (
                                    <div key={heroIdx} className={styles.itemCard}>
                                        <div className={styles.itemHeroPortrait}>
                                            <SafeImage src={`/heroes/${heroFile}`} alt="" fill className={styles.itemHeroImage} />
                                        </div>
                                        <div className={styles.mainItemGrid}>
                                            <div className={clsx(styles.itemBox, itemSet.weapon && styles.itemBoxWeapon)}>
                                                {itemSet.weapon && <SafeImage src={`/items/weapon/${itemSet.weapon}`} alt="" fill className={styles.itemIcon} />}
                                            </div>
                                            <div className={clsx(styles.itemBox, itemSet.armor && styles.itemBoxArmor)}>
                                                {itemSet.armor && <SafeImage src={`/items/armor/${itemSet.armor}`} alt="" fill className={styles.itemIcon} />}
                                            </div>
                                        </div>
                                        <div className={styles.subItemGrid}>
                                            {[0, 1, 2].map(idx => (
                                                <div key={idx} className={clsx(styles.subItemBox, itemSet.accessories?.[idx] && styles.itemBoxAccessory)}>
                                                    {itemSet.accessories?.[idx] && <SafeImage src={`/items/accessory/${itemSet.accessories[idx]}`} alt="" fill className={styles.subItemIcon} />}
                                                </div>
                                            ))}
                                        </div>
                                        {itemSet.note && (
                                            <div className={styles.itemSetNoteBox}>
                                                <p className={styles.itemSetNoteText}>
                                                    {itemSet.note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* Skill Rotation */}
                        {ct.skill_rotation && ct.skill_rotation.length > 0 && (
                            <div className={styles.rotationArea}>
                                <div className={styles.rotationHeader}>
                                    <div className={styles.rotationIconBox}>
                                        <Zap size={16} className={styles.rotationIcon} />
                                    </div>
                                    <h4 className={styles.rotationTitle}>Skill Rotation</h4>
                                </div>
                                
                                <div className={styles.rotationSequenceWrapper}>
                                    <div className={styles.rotationSequence}>
                                        {ct.skill_rotation.map((slot, sIdx) => {
                                            const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                            const hFile = ct.heroes?.[hIdx]
                                            const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                            const isLast = sIdx === (ct.skill_rotation.length - 1)

                                            return (
                                                <div key={sIdx} className={styles.rotationStep}>
                                                    <div className={styles.rotationSkillWrapper}>
                                                        <div className={styles.rotationSkillGlow} />
                                                        <div className={styles.rotationSkillIconBox}>
                                                            {sPath ? <SafeImage src={sPath} alt="" fill className={styles.rotationSkillImage} /> : <div className={styles.rotationSkillPlaceholder}>?</div>}
                                                        </div>
                                                        <div className={styles.rotationSkillIndex}>
                                                            {sIdx + 1}
                                                        </div>
                                                        <span className={styles.rotationSkillLabel}>
                                                            {slot.label || ""}
                                                        </span>
                                                    </div>
                                                    {!isLast && (
                                                        <div className={styles.rotationConnector} />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
