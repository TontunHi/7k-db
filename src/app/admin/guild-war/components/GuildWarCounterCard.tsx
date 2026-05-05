"use client"

import { useState } from "react"
import { Marker, ActionLabel, SectionHeader } from "../../components/AdminEditorial"
import SafeImage from "@/components/shared/SafeImage"
import TeamBuilder from "@/components/admin/TeamBuilder"
import { clsx } from "clsx"
import styles from "../guild-war.module.css"

/**
 * GuildWarCounterCard - Editor for a specific counter squad
 */
export default function GuildWarCounterCard({ 
    teamId, 
    ct, 
    ctIdx, 
    heroesList, 
    petsList, 
    formations, 
    onUpdate, 
    onRemove, 
    onOpenSkillPicker,
    onOpenItemPicker,
    getSkillImagePath 
}) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const handleItemUpdate = (heroIdx, field, value, accIdx = null) => {
        const items = [...(ct.items || [])]
        while (items.length <= heroIdx) items.push({ weapon: '', armor: '', accessories: [null, null, null], note: '' })
        
        if (field === 'accessories' && accIdx !== null) {
            const accs = [...(items[heroIdx].accessories || [null, null, null])]
            accs[accIdx] = value
            items[heroIdx] = { ...items[heroIdx], accessories: accs }
        } else {
            items[heroIdx] = { ...items[heroIdx], [field]: value }
        }
        onUpdate({ items })
    }

    return (
        <div className={clsx(styles.counterCard, !isCollapsed && styles.counterCardOpen)}>
            {/* Header */}
            <div className={styles.counterHeader} onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className={styles.counterLeft}>
                    <Marker color="bg-rose-500" className="h-8" />
                    <div>
                        <h4 className={styles.counterName}>{ct.team_name || `Counter Intel ${ctIdx + 1}`}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            {(ct.heroes || []).filter(h => h).map((hero, i) => (
                                <div key={i} className="relative w-6 h-6 rounded-md border border-border overflow-hidden bg-muted shadow-sm">
                                    <SafeImage src={`/heroes/${hero}`} alt="" fill sizes="50px" className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="px-2 py-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        <ActionLabel label="REMOVE" size="text-[9px]" />
                    </button>
                    <div className={clsx("transition-transform duration-300", !isCollapsed && "rotate-180")}>
                        <ActionLabel label={isCollapsed ? "OPEN" : "CLOSE"} size="text-[9px]" />
                    </div>
                </div>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="p-6 border-t border-border space-y-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Configuration Name</label>
                            <input
                                type="text"
                                value={ct.team_name || ''}
                                onChange={(e) => onUpdate({ team_name: e.target.value })}
                                className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-foreground focus:border-rose-500/40 transition-all outline-none font-bold"
                                placeholder="Anti-Defense, Magic Burst..."
                            />
                        </div>
                        <TeamBuilder 
                            team={ct}
                            heroesList={heroesList}
                            petsList={petsList}
                            formations={formations}
                            onUpdate={(updated) => {
                                onUpdate({
                                    heroes: updated.heroes,
                                    formation: updated.formation,
                                    pet_file: updated.pet_file,
                                    pet_supports: updated.pet_supports,
                                    selection_order: updated.selection_order
                                })
                            }}
                            maxHeroes={3}
                            className="bg-transparent border-none p-0"
                        />
                    </div>

                    {/* Gear Setup */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <SectionHeader title="Tactical Gear" markerColor="bg-rose-500" />
                        </div>

                        <div className={styles.itemsGrid}>
                            {((ct.selection_order && ct.selection_order.length > 0) ? ct.selection_order : (ct.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).map((slotIdx, heroIdx) => {
                                const heroFile = ct.heroes?.[slotIdx]
                                const heroName = heroFile ? heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ') : `Vessel ${heroIdx + 1}`
                                const itemSet = ct.items?.[heroIdx] || { weapon: '', armor: '', accessories: [null, null, null], note: '' }

                                return (
                                    <div key={heroIdx} className={clsx(styles.heroBuildCard, heroFile && styles.heroBuildCardActive)}>
                                        <div className={styles.buildHeader}>
                                            <div className={styles.heroPortrait}>
                                                {heroFile ? (
                                                    <SafeImage src={`/heroes/${heroFile}`} alt="" fill sizes="100px" className="object-contain" />
                                                ) : <span className="text-[10px] font-black opacity-20">VOID</span>}
                                            </div>
                                            <h4 className={styles.heroName}>{heroName}</h4>
                                        </div>

                                        <div className={styles.gearGrid}>
                                            {['weapon', 'armor'].map(gearType => (
                                                <div key={gearType} className="relative group">
                                                    <div 
                                                        onClick={() => heroFile && onOpenItemPicker(ctIdx, heroIdx, gearType)}
                                                        className={styles.gearSlot}
                                                    >
                                                        {itemSet[gearType] ? (
                                                            <SafeImage src={`/items/${gearType}/${itemSet[gearType]}`} alt="" fill sizes="100px" className="object-contain p-2" />
                                                        ) : <span className="text-[8px] font-black opacity-20 uppercase tracking-tighter">{gearType.slice(0,3)}</span>}
                                                    </div>
                                                    {itemSet[gearType] && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleItemUpdate(heroIdx, gearType, '') }}
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors z-10"
                                                        >
                                                            <span className="text-[8px] font-black">×</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.accRow}>
                                            {[0, 1, 2].map(aIdx => (
                                                <div key={aIdx} className="relative group">
                                                    <div 
                                                        onClick={() => heroFile && onOpenItemPicker(ctIdx, heroIdx, 'accessories', aIdx)}
                                                        className={styles.accSlot}
                                                    >
                                                        {itemSet.accessories?.[aIdx] ? (
                                                            <SafeImage src={`/items/accessory/${itemSet.accessories[aIdx]}`} alt="" fill sizes="60px" className="object-contain p-2" />
                                                        ) : <span className="text-[7px] font-black opacity-20">ACC</span>}
                                                    </div>
                                                    {itemSet.accessories?.[aIdx] && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleItemUpdate(heroIdx, 'accessories', null, aIdx) }}
                                                            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors z-10"
                                                        >
                                                            <span className="text-[7px] font-black">×</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <textarea
                                            value={itemSet.note || ''}
                                            onChange={(e) => handleItemUpdate(heroIdx, 'note', e.target.value)}
                                            placeholder="Hero strategic notes..."
                                            className={styles.buildNote}
                                            rows={2}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Skill Rotation */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <SectionHeader title="Execution Order" markerColor="bg-indigo-400" />
                        </div>

                        <div className={styles.rotationTrack}>
                            {(ct.skill_rotation || []).map((step, sidx) => {
                                const [hIdx, sNum] = (step.skill || '').split('-').map(Number)
                                const heroFile = ct.heroes?.[hIdx]
                                const skillPath = step.skill ? getSkillImagePath(heroFile, sNum) : null
                                return (
                                    <div key={sidx} className={styles.rotationSlot}>
                                        <input
                                            type="text"
                                            value={step.label || ''}
                                            onChange={(e) => {
                                                const newRot = [...(ct.skill_rotation || [])]
                                                newRot[sidx] = { ...newRot[sidx], label: e.target.value }
                                                onUpdate({ skill_rotation: newRot })
                                            }}
                                            placeholder="..."
                                            className={styles.slotLabel}
                                        />
                                        <div 
                                            onClick={() => onOpenSkillPicker(ctIdx, sidx)}
                                            className={clsx(styles.skillButton, "group", step.skill && styles.skillButtonActive)}
                                        >
                                            <div className="absolute inset-0 overflow-hidden rounded-[1.125rem] flex items-center justify-center">
                                                {skillPath ? <SafeImage src={skillPath} alt="" fill sizes="100px" className="object-cover" /> : <span className="text-[10px] font-black opacity-10">ADD</span>}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdate({ skill_rotation: ct.skill_rotation.filter((_, i) => i !== sidx) })
                                                }}
                                                className="absolute -top-1 -right-1 p-1 bg-red-600/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <span className="text-[8px] font-black px-1">×</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            <button 
                                onClick={() => {
                                    const newRot = [...(ct.skill_rotation || [])]
                                    newRot.push({ label: '', skill: null })
                                    onUpdate({ skill_rotation: newRot })
                                }}
                                className={clsx(styles.skillButton, "border-dashed opacity-40 hover:opacity-100")}
                            >
                                <span className="text-[10px] font-black">+ STEP</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
