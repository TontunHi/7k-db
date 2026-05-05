"use client"

import { Trash2, Zap, Video, Plus, ScrollText, ChevronDown, ChevronUp } from "lucide-react"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../raid.module.css"

/**
 * RaidTeamSet - Modular component for a single raid squad setup
 */
export default function RaidTeamSet({ 
    set, 
    index, 
    assets, 
    skillErrors,
    isCollapsed,
    onTeamUpdate, 
    onSetUpdate, 
    onDelete, 
    onToggleSkill,
    onToggleCollapse,
    onSkillError 
}) {
    
    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const rotation = set.skill_rotation || []

    return (
        <div className={clsx(styles.teamSet, set._dirty && styles.teamSetDirty)}>
            {/* Header */}
            <div className={styles.setHead}>
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleCollapse(set.id)}>
                        <div className={styles.setIndex}>{index + 1}</div>
                        <input
                            type="text"
                            value={set.team_name || ''}
                            onChange={(e) => onSetUpdate(index, 'team_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`Tactical Team ${index + 1}`}
                            className={styles.setNameInput}
                        />
                    </div>
                    {set._dirty && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-black rounded uppercase">Modified</span>}
                    
                    {/* Inline Summary when collapsed */}
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
                        className="text-muted-foreground hover:text-red-500 p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove squad"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
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

                    {/* Grid-based Skill Rotation */}
                    <div className={styles.rotationSection}>
                        <div className="flex justify-between items-end border-b border-border pb-2">
                            <label className={styles.sectionLabel}>
                                <Zap size={14} className="text-red-500" /> Tactical Skill Sequence Grid
                            </label>
                            <span className="text-[9px] font-black uppercase text-muted-foreground opacity-50 italic">Click icons to set numeric order</span>
                        </div>

                        <div className={styles.skillPool}>
                            {[0, 1, 2, 3, 4].map(heroIdx => {
                                const heroFile = set.heroes?.[heroIdx]
                                if (!heroFile) return <div key={heroIdx} className={styles.heroColumn} />
                                
                                const heroSlug = heroFile.replace(/\.[^/.]+$/, "")
                                const skills = assets.skills?.[heroSlug] || ["4", "3", "2", "1"]

                                return (
                                    <div key={heroIdx} className={styles.heroColumn}>
                                        {skills.map(skillName => {
                                            const skillDataKey = `${heroIdx}-${skillName}`
                                            const skillPath = getSkillImagePath(heroFile, skillName)
                                            const orderIndex = rotation.indexOf(skillDataKey)
                                            const order = orderIndex >= 0 ? orderIndex + 1 : null
                                            const errKey = `set-${set.id}-h${heroIdx}-s${skillName}`

                                            return (
                                                <button
                                                    key={skillName}
                                                    onClick={() => onToggleSkill(index, skillDataKey)}
                                                    className={clsx(
                                                        styles.skillToggle,
                                                        order && styles.skillToggleActive
                                                    )}
                                                >
                                                    <div className={styles.skillIconWrapper}>
                                                        {skillPath && !skillErrors[errKey] && (
                                                            <SafeImage
                                                                src={skillPath}
                                                                alt=""
                                                                fill
                                                                className={clsx("object-contain p-1", !order && "grayscale opacity-60")}
                                                                onError={() => onSkillError(errKey)}
                                                            />
                                                        )}
                                                    </div>
                                                    {order && <div className={styles.orderBadge}>{order}</div>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )
                            })}
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
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <ScrollText size={14} /> Strategic Intel (Notes)
                            </label>
                            <textarea
                                value={set.note || ''}
                                onChange={(e) => onSetUpdate(index, 'note', e.target.value)}
                                placeholder="Document phase transitions and timing requirements..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
