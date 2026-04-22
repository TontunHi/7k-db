'use client'
import { LayoutGrid, PawPrint, Info, Box, Zap, Target, Shield } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import PetDisplay from '@/components/shared/PetDisplay'
import { getSlotType, getStaggerClass, getSkillImagePath } from '@/lib/formation-utils'
import CounterTeamModule from './CounterTeamModule'
import { clsx } from 'clsx'
import styles from './GuildWarTabContent.module.css'

export default function GuildWarTabContent({ activeTab, team, heroImageMap }) {
    if (activeTab === 'overview') {
        return (
            <div className={styles.overview}>
                {/* Formation Card */}
                <div className={styles.formationBox}>
                    <div className={styles.boxAccent} />
                    <div className={styles.boxHeader}>
                        <div className={styles.headerIconWrapper}>
                            <LayoutGrid className={styles.headerIcon} />
                        </div>
                        <h4 className={styles.boxTitle}>Formation</h4>
                    </div>
                    
                    <div className={styles.formationGridWrapper}>
                        <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-[450px] w-full">
                            {[0, 1, 2, 3, 4].map(slotIdx => {
                                const heroFile = team.heroes?.[slotIdx]
                                const type = getSlotType(team.formation, slotIdx)
                                const isFront = type === 'front'
                                const stagger = getStaggerClass(team.formation, slotIdx)
                                
                                return (
                                    <div key={slotIdx} className={clsx(
                                        "relative aspect-[3/4] transition-all duration-500",
                                        stagger,
                                        heroFile 
                                            ? (isFront ? "rounded-2xl border border-sky-500/30 bg-sky-500/10 shadow-lg overflow-hidden" : "rounded-2xl border border-rose-500/30 bg-rose-500/10 shadow-lg overflow-hidden")
                                            : "opacity-0 pointer-events-none"
                                    )}>
                                        {heroFile && (
                                            <div className="relative flex-1 w-full h-full">
                                                <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className={styles.sidePanel}>
                    {/* Pet Box */}
                    <div className={styles.petBox}>
                        <div className={styles.boxHeader}>
                            <div className={styles.headerIconWrapper}>
                                <PawPrint className={styles.headerIcon} />
                            </div>
                            <h4 className={styles.boxTitle}>Pet Setup</h4>
                        </div>
                        
                        <div className={styles.petContent}>
                            <PetDisplay 
                                petFile={team.pet_file ? (team.pet_file.startsWith('/') ? team.pet_file : `/pets/${team.pet_file}`) : null} 
                                hideLabel={true}
                                customClasses={{
                                    wrapper: "w-28 h-28 border-indigo-500/20 bg-indigo-500/5 shadow-2xl ring-1 ring-white/5",
                                    image: "p-4"
                                }}
                            />
                            
                            {team.pet_supports && team.pet_supports.filter(p => p).length > 0 && (
                                <div className={styles.supports}>
                                    {team.pet_supports.filter(p => p).map((p, i) => (
                                        <div key={i} className={styles.supportPet}>
                                            <SafeImage src={p.startsWith('/') ? p : `/pets/${p}`} alt="" fill className="object-contain p-1" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analyst Notes */}
                    {team.note && (
                        <div className={styles.noteBox}>
                            <Info className={styles.noteIconBg} />
                            <p className={styles.noteText}>
                                &quot;{team.note}&quot;
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (activeTab === 'equipment') {
        return (
            <div className={styles.equipmentGrid}>
                {((team.selection_order && team.selection_order.length > 0) ? team.selection_order : (team.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).slice(0, 3).map((slotIdx, heroIdx) => {
                    const heroFile = team.heroes?.[slotIdx]
                    const itemSet = team.items?.[heroIdx]
                    if (!heroFile || !itemSet) return null
                    const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')

                    return (
                        <div key={heroIdx} className={styles.heroEquipmentCard}>
                            <div className={styles.equipmentGlow} />
                            
                            <div className={styles.heroProfile}>
                                <div className={styles.heroPortraitWrapper}>
                                    <div className={styles.portraitAccent} />
                                    <SafeImage src={`/heroes/${heroFile}`} alt={heroName} fill className={styles.heroPortraitImage} />
                                </div>
                                <h5 className={styles.heroName}>{heroName}</h5>
                                <div className={styles.heroNameBar} />
                            </div>

                            <div className={styles.itemsLayout}>
                                <div className={styles.mainItems}>
                                    <div className={clsx(styles.itemSlot, itemSet.weapon && styles.itemFilledWeapon)}>
                                        {itemSet.weapon ? <SafeImage src={`/items/weapon/${itemSet.weapon}`} alt="" fill className={styles.itemImage} /> : <Box size={16} className="opacity-10" />}
                                    </div>
                                    <div className={clsx(styles.itemSlot, itemSet.armor && styles.itemFilledArmor)}>
                                        {itemSet.armor ? <SafeImage src={`/items/armor/${itemSet.armor}`} alt="" fill className={styles.itemImage} /> : <Box size={16} className="opacity-10" />}
                                    </div>
                                </div>
                                <div className={styles.accessoriesGrid}>
                                    {[0, 1, 2].map(idx => (
                                        <div key={idx} className={clsx(styles.accessorySlot, itemSet.accessories?.[idx] && styles.itemFilledAccessory)}>
                                            {itemSet.accessories?.[idx] ? <SafeImage src={`/items/accessory/${itemSet.accessories[idx]}`} alt="" fill className={styles.accessoryImage} /> : <div className={styles.dot} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {itemSet.note && (
                                <div className={styles.itemNote}>
                                    <p className={styles.itemNoteText}>
                                        {itemSet.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    if (activeTab === 'skills') {
        return (
            <div className={styles.rotation}>
                <div className={styles.rotationContent}>
                    <div className={styles.skillSequence}>
                        {(team.skill_rotation || []).map((slot, sIdx) => {
                            const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                            const hFile = team.heroes?.[hIdx]
                            const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                            const isLast = sIdx === (team.skill_rotation.length - 1)

                            return (
                                <div key={sIdx} className={styles.skillStep}>
                                    <div className={styles.skillWrapper}>
                                        <div className={styles.skillGlow} />
                                        <div className={styles.skillIcon}>
                                            {sPath ? <SafeImage src={sPath} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-800 text-2xl font-black">?</div>}
                                        </div>
                                        <div className={styles.skillIndex}>
                                            {sIdx + 1}
                                        </div>
                                        <span className={styles.skillLabel}>
                                            {slot.label || ""}
                                        </span>
                                    </div>
                                    {!isLast && (
                                        <div className={styles.skillConnector} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    if (activeTab === 'counters') {
        return (
            <div className={styles.counters}>
                {/* Primary Targets */}
                {team.counters && team.counters.length > 0 && (
                    <div className={styles.primaryTargets}>
                        <div className={styles.boxHeader}>
                            <div className={styles.headerIconWrapper} style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
                                <Target className={styles.headerIcon} style={{ color: '#fb7185' }} />
                            </div>
                            <h4 className={styles.boxTitle}>Primary Targets</h4>
                        </div>
                        <div className={styles.targetList}>
                            {team.counters.map((target, tIdx) => (
                                <div key={tIdx} className={styles.targetHero}>
                                    <div className={styles.targetPortrait}>
                                        <SafeImage src={`/heroes/${target}`} alt="" fill className="object-cover" />
                                    </div>
                                    <span className={styles.targetName}>
                                        {target.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Counter Teams */}
                <div className={styles.counterTeams}>
                    {!team.counter_teams || team.counter_teams.length === 0 ? (
                        <div className={styles.emptyCounters}>
                            <Shield className={styles.emptyCounterIcon} />
                            <p className={styles.emptyCounterText}>No adaptive counters cataloged</p>
                        </div>
                    ) : (
                        (team.counter_teams || []).map((ct, ctIdx) => {
                            const accentColor = team.type === 'attacker' ? '#fbbf24' : team.type === 'defender' ? '#38bdf8' : '#818cf8';
                            return (
                                <CounterTeamModule 
                                    key={ctIdx} 
                                    ct={ct} 
                                    heroImageMap={heroImageMap} 
                                    accentColor={accentColor}
                                />
                            )
                        })
                    )}
                </div>
            </div>
        )
    }

    return null
}
