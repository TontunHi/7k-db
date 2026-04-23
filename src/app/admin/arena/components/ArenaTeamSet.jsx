"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2, Zap, Video, Plus, ScrollText, GripVertical, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../arena.module.css"

/**
 * ArenaTeamSet - Modular sortable component for an Arena squad
 */
export default function ArenaTeamSet({ 
    team, 
    index, 
    assets, 
    skillErrors,
    isMinimized,
    onTeamUpdate, 
    onDelete, 
    onAddSlot, 
    onDeleteSlot, 
    onUpdateSlotLabel,
    onOpenSkillPicker,
    onToggleMinimize,
    onSkillError 
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: team.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    }

    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const hasHeroes = team.heroes?.some(h => h !== null)

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={clsx(styles.teamCard, team._dirty && styles.teamCardDirty)}
        >
            <div className={styles.cardHead}>
                <div className={styles.teamMeta}>
                    <div {...attributes} {...listeners} className={styles.dragHandle}>
                        <GripVertical size={20} />
                    </div>
                    <div className={styles.indexBadge}>
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => onToggleMinimize(team.id)} style={{ cursor: 'pointer' }}>
                        <input
                            type="text"
                            value={team.team_name || ''}
                            onChange={(e) => onTeamUpdate(index, 'team_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`ELITE SQUAD ${index + 1}`}
                            className={styles.teamNameInput}
                        />
                    </div>
                    {team._dirty && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-black rounded uppercase">Modified</span>}
                    
                    {isMinimized && (
                        <div className="flex items-center gap-1.5 ml-4 animate-in fade-in slide-in-from-left-2">
                            {team.heroes.map((hero, hIdx) => hero && (
                                <div key={hIdx} className="relative w-7 h-7 rounded-md overflow-hidden border border-border">
                                    <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onToggleMinimize(team.id)}
                        className="text-muted-foreground hover:text-amber-500 p-2 hover:bg-accent rounded-xl transition-colors"
                    >
                        {isMinimized ? <Plus size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                        title="Remove squad"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <div className={styles.cardBody}>
                    <TeamBuilder
                        team={{
                            index: index + 1,
                            formation: team.formation,
                            pet_file: team.pet_file,
                            heroes: team.heroes || [null, null, null, null, null]
                        }}
                        index={index}
                        heroesList={assets.heroes}
                        petsList={assets.pets}
                        formations={assets.formations}
                        onUpdate={(teamData) => onTeamUpdate(index, 'builder', teamData)}
                        className="!bg-black/20"
                    />

                    {/* Skill Rotation */}
                    <div className={styles.rotationSection}>
                        <label className={styles.sectionLabel}>
                            <Zap size={14} className="text-amber-500" /> TACTICAL EXECUTION SEQUENCE
                        </label>

                        <div className={styles.rotationGrid}>
                            {(team.skill_rotation || []).map((slot, slotIdx) => {
                                const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                const heroFile = team.heroes?.[hIdx]
                                const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                const errKey = `slot-${team.id}-${slotIdx}`
                                const hasError = skillErrors[errKey]

                                return (
                                    <div key={slotIdx} className={styles.slot}>
                                        <input
                                            type="text"
                                            value={slot.label || ''}
                                            onChange={(e) => onUpdateSlotLabel(index, slotIdx, e.target.value)}
                                            placeholder="..."
                                            className={styles.slotLabel}
                                        />
                                        <div className="relative">
                                            <button
                                                onClick={() => onOpenSkillPicker({ teamIdx: index, slotIdx })}
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

                            <div className={styles.slot}>
                                <div className={styles.slotLabel} /> {/* Spacer */}
                                <button
                                    onClick={() => onAddSlot(index)}
                                    disabled={!hasHeroes}
                                    className={styles.addSlotBtn}
                                    title="Add tactical slot"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <Video size={14} className="text-purple-500" /> MISSION ARCHIVE (VIDEO URL)
                            </label>
                            <input
                                type="url"
                                value={team.video_url || ''}
                                onChange={(e) => onTeamUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <ScrollText size={14} className="text-blue-500" /> DEPLOYMENT NOTES
                            </label>
                            <textarea
                                value={team.note || ''}
                                onChange={(e) => onTeamUpdate(index, 'note', e.target.value)}
                                placeholder="Notes on matchmaking, counters, or specific stat requirements..."
                                className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none h-full min-h-[100px] transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
