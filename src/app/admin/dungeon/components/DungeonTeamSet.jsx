"use client"

import { Trash2, Zap, Video, Plus } from "lucide-react"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../dungeon.module.css"

/**
 * DungeonTeamSet - Modular component for a single team setup
 */
export default function DungeonTeamSet({ 
    set, 
    index, 
    assets, 
    skillErrors,
    onTeamUpdate, 
    onSetUpdate, 
    onDelete, 
    onAddSlot, 
    onDeleteSlot, 
    onUpdateSlotLabel,
    onOpenSkillPicker,
    onSkillError 
}) {
    
    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    return (
        <div className={clsx(styles.teamSet, set._dirty && styles.teamSetDirty)}>
            <div className={styles.setHead}>
                <div className="flex items-center gap-3">
                    <div className={styles.setIndex}>{index + 1}</div>
                    <h3 className="font-bold uppercase tracking-tight">Deployment {index + 1}</h3>
                    {set._dirty && <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded uppercase">Unsaved Intel</span>}
                </div>
                <button
                    onClick={() => onDelete(index)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    title="Remove team set"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className={styles.setBody}>
                {/* Team Builder Core */}
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

                {/* Skill Rotation Section */}
                <div className={styles.rotationSection}>
                    <label className={styles.sectionLabel}>
                        <Zap size={14} className="text-primary" /> Skill Rotation Sequence
                    </label>

                    <div className={styles.rotationGrid}>
                        {(set.skill_rotation || []).map((slot, slotIdx) => {
                            const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                            const heroFile = set.heroes?.[hIdx]
                            const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                            const errKey = `slot-${set.id}-${slotIdx}`
                            const hasError = skillErrors[errKey]
                            const hasHeroes = set.heroes?.some(h => h !== null)

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
                                                <Plus size={16} className="text-muted-foreground" />
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
                            disabled={!set.heroes?.some(h => h !== null)}
                            className={styles.addSlotBtn}
                            title="Add skill slot"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Meta Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={styles.sectionLabel}>
                            <Video size={14} /> Tactical Briefing (Video URL)
                        </label>
                        <input
                            type="url"
                            value={set.video_url || ''}
                            onChange={(e) => onSetUpdate(index, 'video_url', e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={styles.sectionLabel}>Setup Intelligence (Notes)</label>
                        <textarea
                            value={set.note || ''}
                            onChange={(e) => onSetUpdate(index, 'note', e.target.value)}
                            placeholder="Add specific timings or requirements..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none h-full min-h-[50px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
