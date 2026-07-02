"use client"

import { useState } from "react"
import { ChevronDown, Copy, Trash2 } from "lucide-react"
import { Marker, ActionLabel, SectionHeader } from "../../components/AdminEditorial"
import SafeImage from "@/components/shared/SafeImage"
import TeamBuilder from "@/components/admin/TeamBuilder"
import GuildWarCounterCard from "./GuildWarCounterCard"
import { clsx } from "clsx"
import styles from "../guild-war.module.css"

/**
 * GuildWarTeamCard — compact, information-rich admin card
 * Features:
 *  - Hero thumbnail strip visible when collapsed
 *  - Type toggle (Attacker / Defender) on header
 *  - UNSAVED dirty badge
 *  - Inline delete confirmation (no window.confirm)
 *  - Duplicate button (calls onDuplicate)
 */
export default function GuildWarTeamCard({ 
    team, 
    index, 
    heroesList, 
    petsList, 
    formations, 
    onUpdate, 
    onDelete,
    onDuplicate,
    onOpenSkillPicker,
    onOpenItemPicker,
    getSkillImagePath,
    forceCollapsed,
}) {
    const [isMinimized, setIsMinimized] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(false)

    // Sync with external collapse-all
    const collapsed = forceCollapsed !== undefined ? forceCollapsed : isMinimized

    const handleToggle = (e) => {
        e.stopPropagation()
        if (forceCollapsed !== undefined) return // controlled externally
        setIsMinimized(prev => !prev)
    }

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

    const visibleHeroes = (team.heroes || []).slice(0, 5)

    return (
        <div className={clsx(styles.teamCard, team._dirty && styles.teamCardDirty)}>

            {/* ── Header ── */}
            <div
                className={clsx(styles.cardHeader, !collapsed && styles.cardHeaderOpen)}
                onClick={() => { setIsMinimized(prev => !prev); setConfirmDelete(false) }}
            >
                {/* Index */}
                <div className={styles.indexBadge}>{String(index + 1).padStart(2, '0')}</div>

                {/* Hero preview strip */}
                <div className={styles.heroPreviewStrip}>
                    {visibleHeroes.filter(hero => hero).map((hero, i) => (
                        <div key={i} className={styles.heroPreviewAvatar}>
                            <SafeImage
                                src={`/heroes/${hero}`}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover object-top"
                            />
                        </div>
                    ))}
                </div>

                {/* Name */}
                <input
                    type="text"
                    value={team.team_name || ''}
                    onChange={(e) => { e.stopPropagation(); onUpdate('team_name', e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    placeholder={`Squad ${index + 1}`}
                    className={styles.nameInput}
                />

                {/* Type toggle */}
                <div
                    className={styles.typeToggle}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        className={clsx(styles.typeBtn, team.type === 'attacker' && styles.typeBtnActive)}
                        onClick={() => onUpdate('type', 'attacker')}
                    >ATK</button>
                    <button
                        className={clsx(styles.typeBtn, (team.type === 'defender' || !team.type) && styles.typeBtnActiveDefender)}
                        onClick={() => onUpdate('type', 'defender')}
                    >DEF</button>
                </div>

                {/* Dirty badge */}
                {team._dirty && <span className={styles.dirtyBadge}>UNSAVED</span>}

                {/* Actions */}
                <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    <button
                        className={clsx(styles.actionBtn, styles.actionBtnDuplicate)}
                        onClick={onDuplicate}
                        title="Duplicate team"
                    >
                        <Copy size={11} />
                    </button>
                    <button
                        className={clsx(styles.actionBtn, styles.actionBtnDelete)}
                        onClick={() => setConfirmDelete(true)}
                        title="Delete team"
                    >
                        <Trash2 size={11} />
                    </button>
                </div>

                <ChevronDown
                    size={16}
                    className={clsx(styles.chevron, !collapsed && styles.chevronOpen)}
                />
            </div>

            {/* ── Inline Delete Confirm ── */}
            {confirmDelete && (
                <div className={styles.deleteConfirmBar}>
                    <span className={styles.deleteConfirmText}>
                        Delete "{team.team_name || `Squad ${index + 1}`}"? This cannot be undone.
                    </span>
                    <button
                        className={styles.deleteConfirmNo}
                        onClick={() => setConfirmDelete(false)}
                    >Cancel</button>
                    <button
                        className={styles.deleteConfirmYes}
                        onClick={() => { setConfirmDelete(false); onDelete() }}
                    >Delete</button>
                </div>
            )}

            {/* ── Body ── */}
            {!collapsed && (
                <div className={styles.cardBody}>

                    {/* Formation & Heroes */}
                    <div className={styles.section}>
                        <TeamBuilder
                            team={team}
                            index={index}
                            heroesList={heroesList}
                            petsList={petsList}
                            formations={formations}
                            onUpdate={(data) => onUpdate('_builder', data)}
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
                            {((team.selection_order && team.selection_order.length > 0)
                                ? team.selection_order
                                : (team.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)
                            ).map((slotIdx, heroIdx) => {
                                const heroFile = team.heroes?.[slotIdx]
                                const heroName = heroFile
                                    ? heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')
                                    : `Operative ${heroIdx + 1}`
                                const itemSet = team.items?.[heroIdx] || { weapon: '', armor: '', accessories: [null, null, null], note: '' }

                                return (
                                    <div key={heroIdx} className={clsx(styles.heroBuildCard, heroFile && styles.heroBuildCardActive)}>
                                        <div className={styles.buildHeader}>
                                            <div className={styles.heroPortrait}>
                                                {heroFile
                                                    ? <SafeImage src={`/heroes/${heroFile}`} alt="" fill sizes="100px" className="object-contain" />
                                                    : <span className="text-[10px] font-black opacity-20">VOID</span>}
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
                                                        {itemSet[gearType]
                                                            ? <SafeImage src={`/items/${gearType}/${itemSet[gearType]}`} alt="" fill sizes="100px" className="object-contain p-2" />
                                                            : <span className="text-[8px] font-black opacity-20 uppercase tracking-tighter">{gearType.slice(0,3)}</span>}
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
                                                        {itemSet.accessories?.[aIdx]
                                                            ? <SafeImage src={`/items/accessory/${itemSet.accessories[aIdx]}`} alt="" fill sizes="60px" className="object-contain p-2" />
                                                            : <span className="text-[7px] font-black opacity-20">ACC</span>}
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
                                            placeholder="Spec notes…"
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
                                            <div className="absolute inset-0 overflow-hidden rounded-[0.875rem] flex items-center justify-center">
                                                {skillPath
                                                    ? <SafeImage src={skillPath} alt="" fill sizes="80px" className="object-cover" />
                                                    : <span className="text-[10px] font-black opacity-10">ADD</span>}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
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
                                        team_name: `Counter ${counters.length + 1}`,
                                        formation: formations[0]?.value || '1-4',
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
                                <ActionLabel label="+ Counter" size="text-[9px]" />
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
