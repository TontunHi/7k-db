"use client"

import { useState } from "react"
import { Marker, ActionLabel, SectionHeader } from "../../components/AdminEditorial"
import SafeImage from "@/components/shared/SafeImage"
import TeamBuilder from "@/components/admin/TeamBuilder"
import GuildWarCounterCard from "./GuildWarCounterCard"
import { clsx } from "clsx"
import styles from "../guild-war.module.css"

/**
 * GuildWarTeamCard - Main team configuration card
 */
export default function GuildWarTeamCard({ 
    team, 
    index, 
    heroesList, 
    petsList, 
    formations, 
    onUpdate, 
    onDelete, 
    onOpenSkillPicker,
    onOpenItemPicker,
    getSkillImagePath 
}) {
    const [isMinimized, setIsMinimized] = useState(true)

    const handleItemUpdate = (heroIdx, field, value, accIdx = null) => {
        const items = [...(team.items || [])]
        while (items.length <= heroIdx) items.push({ weapon: '', armor: '', accessories: [null, null, null], note: '' })
        
        if (field === 'accessories' && accIdx !== null) {
            const accs = [...(items[heroIdx].accessories || [null, null, null])]
            accs[accIdx] = value
            items[heroIdx] = { ...items[heroIdx], accessories: accs }
        } else {
            items[heroIdx] = { ...items[heroIdx], [field]: value }
        }
        onUpdate('items', items)
    }

    return (
        <div className={clsx(styles.teamCard, team._dirty && styles.teamCardDirty)}>
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.indexBadge}>0{index + 1}</div>
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            type="text"
                            value={team.team_name || ''}
                            onChange={(e) => onUpdate('team_name', e.target.value)}
                            placeholder={`Strategic Squad ${index + 1}`}
                            className={styles.nameInput}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ActionLabel label={isMinimized ? "EXPAND" : "COLLAPSE"} size="text-[9px]" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-2 py-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        <ActionLabel label="DECOMMISSION" size="text-[9px]" />
                    </button>
                </div>
            </div>

            {/* Body */}
            {!isMinimized && (
                <div className={styles.cardBody}>
                    {/* Formation & Heroes */}
                    <div className={styles.section}>
                        <TeamBuilder
                            team={team}
                            index={index}
                            heroesList={heroesList}
                            petsList={petsList}
                            formations={formations}
                            onUpdate={(data) => {
                                onUpdate('_builder', data)
                            }}
                            maxHeroes={5}
                            className="bg-transparent border-none p-0"
                        />
                    </div>

                    {/* Equipment Build */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <SectionHeader title="Tactical Loadout" markerColor="bg-blue-500" />
                        </div>

                        <div className={styles.itemsGrid}>
                            {((team.selection_order && team.selection_order.length > 0) ? team.selection_order : (team.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).map((slotIdx, heroIdx) => {
                                const heroFile = team.heroes?.[slotIdx]
                                const heroName = heroFile ? heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ') : `Operative ${heroIdx + 1}`
                                const itemSet = team.items?.[heroIdx] || { weapon: '', armor: '', accessories: [null, null, null], note: '' }

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
                                                         onClick={() => heroFile && onOpenItemPicker(null, heroIdx, gearType)}
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
                                                         onClick={() => heroFile && onOpenItemPicker(null, heroIdx, 'accessories', aIdx)}
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
                                             placeholder="Spec notes..."
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
                            <SectionHeader title="Execution Protocol" markerColor="bg-amber-500" />
                        </div>

                        <div className={styles.rotationTrack}>
                            {(team.skill_rotation || []).map((step, sidx) => {
                                const [hIdx, sNum] = (step.skill || '').split('-').map(Number)
                                const heroFile = team.heroes?.[hIdx]
                                const skillPath = step.skill ? getSkillImagePath(heroFile, sNum) : null
                                return (
                                    <div key={sidx} className={styles.rotationSlot}>
                                        <input
                                            type="text"
                                            value={step.label || ''}
                                            onChange={(e) => {
                                                const newRot = [...(team.skill_rotation || [])]
                                                newRot[sidx] = { ...newRot[sidx], label: e.target.value }
                                                onUpdate('skill_rotation', newRot)
                                            }}
                                            placeholder="..."
                                            className={styles.slotLabel}
                                        />
                                        <div 
                                            onClick={() => onOpenSkillPicker(null, sidx)}
                                            className={clsx(styles.skillButton, "group", step.skill && styles.skillButtonActive)}
                                        >
                                            <div className="absolute inset-0 overflow-hidden rounded-[1.125rem] flex items-center justify-center">
                                                {skillPath ? <SafeImage src={skillPath} alt="" fill sizes="100px" className="object-cover" /> : <span className="text-[10px] font-black opacity-10">ADD</span>}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdate('skill_rotation', team.skill_rotation.filter((_, i) => i !== sidx))
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
                                    const newRot = [...(team.skill_rotation || [])]
                                    newRot.push({ label: '', skill: null })
                                    onUpdate('skill_rotation', newRot)
                                }}
                                className={clsx(styles.skillButton, "border-dashed opacity-40 hover:opacity-100")}
                            >
                                <span className="text-[10px] font-black">+ STEP</span>
                            </button>
                        </div>
                    </div>

                    {/* Counter Strategies */}
                    <div className={styles.counterSection}>
                        <div className="flex items-center justify-between">
                            <SectionHeader title="Incursion Response" markerColor="bg-rose-500" />
                            <button
                                onClick={() => {
                                    const counters = [...(team.counter_teams || [])]
                                    counters.push({
                                        team_name: `Counter Squad ${counters.length + 1}`,
                                        formation: '1-4',
                                        heroes: [null, null, null, null, null],
                                        pet_file: '',
                                        items: [],
                                        skill_rotation: [],
                                        note: ''
                                    })
                                    onUpdate('counter_teams', counters)
                                }}
                                className={styles.btnSecondary}
                            >
                                <ActionLabel label="ADD COUNTER INTEL" size="text-[9px]" />
                            </button>
                        </div>

                        <div className={styles.counterList}>
                            {(team.counter_teams || []).map((ct, ctIdx) => (
                                <GuildWarCounterCard
                                    key={ctIdx}
                                    teamId={team.id}
                                    ct={ct}
                                    ctIdx={ctIdx}
                                    heroesList={heroesList}
                                    petsList={petsList}
                                    formations={formations}
                                    onUpdate={(updates) => {
                                        const counters = [...(team.counter_teams || [])]
                                        counters[ctIdx] = { ...counters[ctIdx], ...updates }
                                        onUpdate('counter_teams', counters)
                                    }}
                                    onRemove={() => {
                                        const counters = team.counter_teams.filter((_, i) => i !== ctIdx)
                                        onUpdate('counter_teams', counters)
                                    }}
                                    onOpenSkillPicker={(cIdx, sIdx) => onOpenSkillPicker(cIdx, sIdx)}
                                    onOpenItemPicker={(cIdx, hIdx, type, aIdx) => onOpenItemPicker(cIdx, hIdx, type, aIdx)}
                                    getSkillImagePath={getSkillImagePath}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
