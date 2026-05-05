"use client"

import { ActionLabel, Marker, SystemBadge } from "../../components/AdminEditorial"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../arena.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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
                    <div {...attributes} {...listeners} className="px-2 py-1 hover:bg-accent rounded cursor-grab active:cursor-grabbing text-muted-foreground transition-colors text-[10px] font-black">
                        DRAG
                    </div>
                    <div className={styles.indexBadge}>
                        0{index + 1}
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
                    {team._dirty && <SystemBadge variant="warning">MODIFIED</SystemBadge>}
                    
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

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onToggleMinimize(team.id)}
                        className="text-muted-foreground hover:text-amber-500 px-2 py-1 transition-colors"
                    >
                        <ActionLabel label={isMinimized ? "EXPAND" : "CLOSE"} size="text-[9px]" />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors px-2 py-1"
                    >
                        <ActionLabel label="REMOVE" size="text-[9px]" />
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
                        <div className="mb-4">
                            <Marker color="bg-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Tactical Execution Sequence</span>
                        </div>

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

                            <div className={styles.slot}>
                                <div className={styles.slotLabel} /> {/* Spacer */}
                                <button
                                    onClick={() => onAddSlot(index)}
                                    disabled={!hasHeroes}
                                    className={styles.addSlotBtn}
                                    title="Add tactical slot"
                                >
                                    <span className="text-[10px] font-black">+ STEP</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Marker color="bg-purple-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Archive (URL)</span>
                            </div>
                            <input
                                type="url"
                                value={team.video_url || ''}
                                onChange={(e) => onTeamUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Marker color="bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deployment Notes</span>
                            </div>
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
