"use client"

import { ActionLabel, Marker, SystemBadge } from "../../components/AdminEditorial"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../castle-rush.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/**
 * CastleRushTeamSet - Modular component for a single team setup
 */
export default function CastleRushTeamSet({ 
    set, 
    index, 
    assets, 
    skillErrors,
    isCollapsed,
    onTeamUpdate, 
    onSetUpdate, 
    onDelete, 
    onAddSlot, 
    onDeleteSlot, 
    onUpdateSlotLabel,
    onOpenSkillPicker,
    onToggleCollapse,
    onSkillError 
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: set.id })

    const sortableStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: 'relative',
        opacity: isDragging ? 0.5 : 1
    }

    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const hasHeroes = set.heroes?.some(h => h !== null)

    return (
        <div 
            ref={setNodeRef} 
            style={sortableStyle}
            className={clsx(styles.teamSet, set._dirty && styles.teamSetDirty, isDragging && "shadow-2xl")}
        >
            <div className={styles.setHead}>
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                        <button 
                            {...attributes} 
                            {...listeners} 
                            className="px-2 py-1 hover:bg-accent rounded cursor-grab active:cursor-grabbing text-muted-foreground transition-colors text-[10px] font-black"
                        >
                            DRAG
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleCollapse(set.id)}>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-sm italic">
                                0{index + 1}
                            </div>
                        <input
                            type="text"
                            value={set.team_name || ''}
                            onChange={(e) => onSetUpdate(index, 'team_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`Team ${index + 1}`}
                            className={styles.setNameInput}
                        />
                    </div>
                </div>
                    {set._dirty && <SystemBadge variant="warning">UNSAVED</SystemBadge>}
                    
                    {isCollapsed && (
                        <div className="flex items-center gap-1.5 ml-4 animate-in fade-in slide-in-from-left-2">
                            {set.heroes.map((hero, hIdx) => hero && (
                                <div key={hIdx} className="relative w-7 h-7 rounded-md overflow-hidden border border-border">
                                    <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onToggleCollapse(set.id)}
                        className="text-muted-foreground hover:text-amber-500 px-2 py-1 transition-colors"
                    >
                        <ActionLabel label={isCollapsed ? "EXPAND" : "CLOSE"} size="text-[9px]" />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors px-2 py-1"
                    >
                        <ActionLabel label="REMOVE" size="text-[9px]" />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.setBody}>
                    <TeamBuilder
                        team={{
                            index: index + 1,
                            formation: set.formation,
                            pet_file: set.pet_file,
                            aura: set.aura,
                            heroes: set.heroes
                        }}
                        index={index}
                        heroesList={assets.heroes}
                        petsList={assets.pets}
                        formations={assets.formations}
                        onUpdate={(teamData) => onTeamUpdate(index, teamData)}
                    />

                    {/* Skill Rotation */}
                    <div className={styles.rotationSection}>
                        <div className="mb-4">
                            <Marker color="bg-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Skill Rotation Intel</span>
                        </div>

                        <div className={styles.rotationGrid}>
                            {(set.skill_rotation || []).map((slot, slotIdx) => {
                                const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                const heroFile = set.heroes?.[hIdx]
                                const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                const errKey = `slot-${set.id}-${slotIdx}`
                                const hasError = skillErrors[errKey]

                                return (
                                    <div key={slotIdx} className={styles.slot}>
                                        <input
                                            type="text"
                                            value={slot.label || ''}
                                            onChange={(e) => onUpdateSlotLabel(index, slotIdx, e.target.value)}
                                            placeholder="..."
                                            className={styles.slotLabelInput}
                                        />
                                        <div className="relative">
                                            <button
                                                onClick={() => onOpenSkillPicker({ setIdx: index, slotIdx })}
                                                disabled={!hasHeroes}
                                                className={clsx(
                                                    styles.skillBtn,
                                                    slot.skill && styles.skillBtnActive
                                                )}
                                            >
                                                {slot.skill && heroFile && skillPath && !hasError ? (
                                                    <SafeImage
                                                        src={skillPath}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        onError={() => onSkillError(errKey)}
                                                    />
                                                ) : (
                                                    <span className="text-[10px] font-black opacity-10">ADD</span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onDeleteSlot(index, slotIdx)}
                                                className={styles.removeSlotBtn}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            <button
                                onClick={() => onAddSlot(index)}
                                disabled={!hasHeroes}
                                className={styles.addSlotBtn}
                                title="Add rotation slot"
                            >
                                <span className="text-[10px] font-black">+ STEP</span>
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Marker color="bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Briefing (URL)</span>
                            </div>
                            <input
                                type="url"
                                value={set.video_url || ''}
                                onChange={(e) => onSetUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Marker color="bg-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strategic Intel (Notes)</span>
                            </div>
                            <textarea
                                value={set.note || ''}
                                onChange={(e) => onSetUpdate(index, 'note', e.target.value)}
                                placeholder="Add specific timings or boss-specific requirements..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none h-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
