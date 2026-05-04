"use client"

import { Trash2, Zap, Video, Plus, ScrollText, ChevronDown, ChevronUp, GripVertical } from "lucide-react"
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

    const sortableStyle = {
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
                            className="p-1 hover:bg-accent rounded cursor-grab active:cursor-grabbing text-muted-foreground transition-colors"
                        >
                            <GripVertical size={18} />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleCollapse(set.id)}>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-sm">
                                {index + 1}
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
                    {set._dirty && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-black rounded uppercase">Unsaved</span>}
                    
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

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleCollapse(set.id)}
                        className="text-muted-foreground hover:text-amber-500 p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Remove team"
                    >
                        <Trash2 size={18} />
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
                        <label className={styles.sectionLabel}>
                            <Zap size={14} className="text-amber-500" /> Skill Rotation Intel
                        </label>

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
                                                    <Plus size={16} className="text-muted-foreground opacity-30" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onDeleteSlot(index, slotIdx)}
                                                className={styles.removeSlotBtn}
                                            >
                                                ✕
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
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <Video size={14} /> Tactical Briefing (Video URL)
                            </label>
                            <input
                                type="url"
                                value={set.video_url || ''}
                                onChange={(e) => onSetUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <ScrollText size={14} /> Strategic Intel (Notes)
                            </label>
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
