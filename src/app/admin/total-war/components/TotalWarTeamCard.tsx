"use client"

import { Trash2, Zap, Video, Plus, Pencil } from "lucide-react"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../total-war.module.css"

/**
 * TotalWarTeamCard - Modular component for a single squad within a Total War set
 */
export default function TotalWarTeamCard({ 
    team, 
    teamIdx, 
    tierCfg,
    assets, 
    skillErrors,
    onTeamChange, 
    onDelete, 
    onOpenSkillPicker,
    onSkillError 
}) {
    
    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const hasHeroes = team.heroes?.some(h => h !== null)
    const rotation = team.skill_rotation || []

    return (
        <div className={clsx(styles.teamCard, team._dirty && styles.teamCardDirty)}>
            <div className={styles.teamHead}>
                <div className="flex items-center gap-2">
                    <div 
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-black shrink-0"
                        style={{ backgroundColor: tierCfg.accent }}
                    >
                        {teamIdx + 1}
                    </div>
                    <Pencil size={12} className="text-muted-foreground opacity-50" />
                    <input
                        type="text"
                        value={team.team_name || ''}
                        onChange={(e) => onTeamChange(teamIdx, 'team_name', e.target.value)}
                        placeholder={`SQUAD ${teamIdx + 1}`}
                        className="bg-transparent border-none outline-none text-xs font-black text-white placeholder-gray-700 w-40 uppercase tracking-wider"
                    />
                    {team._dirty && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                </div>

                <button
                    onClick={() => onDelete(teamIdx)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className={styles.teamBody}>
                <TeamBuilder
                    team={{
                        index: teamIdx + 1,
                        formation: team.formation,
                        pet_file: team.pet_file,
                        heroes: team.heroes || [null, null, null, null, null]
                    }}
                    index={teamIdx}
                    heroesList={assets.heroes}
                    petsList={assets.pets}
                    formations={assets.formations}
                    onUpdate={(teamData) => onTeamChange(teamIdx, '_teamData', teamData)}
                    className="!bg-black/20"
                />

                {/* Skill Rotation */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">
                        <Zap size={12} className="text-red-500" /> Operational Sequence
                    </label>

                    <div className={styles.rotationGrid}>
                        {rotation.map((slot, slotIdx) => {
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
                                        onChange={(e) => {
                                            const next = [...rotation]
                                            next[slotIdx] = { ...next[slotIdx], label: e.target.value }
                                            onTeamChange(teamIdx, 'skill_rotation', next)
                                        }}
                                        placeholder="..."
                                        className={styles.slotLabel}
                                    />
                                    <div className="relative group">
                                        <button
                                            onClick={() => onOpenSkillPicker(teamIdx, slotIdx)}
                                            disabled={!hasHeroes}
                                            className={clsx(
                                                styles.skillBtn,
                                                "relative",
                                                slot.skill && styles.skillBtnActive
                                            )}
                                            style={slot.skill ? { borderColor: tierCfg.accent + '80' } : {}}
                                        >
                                            {slot.skill && heroFile && skillPath && !hasError ? (
                                                <SafeImage
                                                    src={skillPath}
                                                    alt=""
                                                    fill
                                                    sizes="100px"
                                                    className="object-cover"
                                                    onError={() => onSkillError(errKey)}
                                                />
                                            ) : (
                                                <Plus size={14} className="text-muted-foreground opacity-20" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const next = [...rotation]
                                                next.splice(slotIdx, 1)
                                                onTeamChange(teamIdx, 'skill_rotation', next)
                                            }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center text-[8px] hidden group-hover:flex"
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
                                onClick={() => onTeamChange(teamIdx, 'skill_rotation', [...rotation, { label: '', skill: null }])}
                                disabled={!hasHeroes}
                                className={styles.addSlotBtn}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">
                            <Video size={12} /> Deployment Feed
                        </label>
                        <input
                            type="url"
                            value={team.video_url || ''}
                            onChange={(e) => onTeamChange(teamIdx, 'video_url', e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-black/40 border border-border rounded-xl px-4 py-2.5 font-bold text-xs focus:outline-none focus:border-red-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Operational Notes</label>
                        <input
                            type="text"
                            value={team.note || ''}
                            onChange={(e) => onTeamChange(teamIdx, 'note', e.target.value)}
                            placeholder="Team-specific strategy..."
                            className="w-full bg-black/40 border border-border rounded-xl px-4 py-2.5 font-bold text-xs focus:outline-none focus:border-red-500/50"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
