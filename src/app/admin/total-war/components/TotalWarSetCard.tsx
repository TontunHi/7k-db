"use client"

import { useState } from "react"
import { Trash2, Plus, Save, Loader2, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import TotalWarTeamCard from "./TotalWarTeamCard"
import { clsx } from "clsx"
import styles from "../total-war.module.css"

/**
 * TotalWarSetCard - Orchestrator for a set of multiple squads in Total War
 */
export default function TotalWarSetCard({ 
    set, 
    setIdx, 
    tierCfg,
    assets, 
    skillErrors,
    saving,
    onSetUpdate, 
    onAddTeam,
    onTeamChange,
    onDeleteTeam,
    onDeleteSet, 
    onSaveSet,
    onOpenSkillPicker,
    onSkillError 
}) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const canAddTeam = (set.teams?.length || 0) < tierCfg.maxTeams

    return (
        <div className={clsx(styles.setCard, set._dirty && styles.setCardDirty)}>
            <div className={styles.setHead}>
                <div className={styles.setMeta}>
                    <div 
                        className={styles.indexBadge}
                        style={{ backgroundColor: tierCfg.accent }}
                    >
                        {setIdx + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-2" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
                        <Pencil size={14} className="text-muted-foreground opacity-50" />
                        <input
                            type="text"
                            value={set.set_name || ''}
                            onChange={(e) => onSetUpdate(setIdx, 'set_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`STRATEGIC SET ${setIdx + 1}`}
                            className={styles.setNameInput}
                        />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 ml-2">
                            {set.teams?.length || 0} / {tierCfg.maxTeams} Teams Deployed
                        </span>
                    </div>
                    {set._dirty && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-black rounded uppercase">Unsynchronized</span>}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-muted-foreground hover:text-red-500 p-2 hover:bg-accent rounded-xl transition-colors"
                    >
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={() => onDeleteSet(setIdx)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.setBody}>
                    {/* Set-level Note */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Strategic Overview</label>
                        <textarea
                            value={set.note || ''}
                            onChange={(e) => onSetUpdate(setIdx, 'note', e.target.value)}
                            placeholder="Overall strategy for this set (e.g. anti-cleave, stall team variants)..."
                            className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/50 focus:outline-none resize-none min-h-[80px]"
                        />
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {(set.teams || []).map((team, teamIdx) => (
                            <TotalWarTeamCard
                                key={team.id || team._uid}
                                team={team}
                                teamIdx={teamIdx}
                                tierCfg={tierCfg}
                                assets={assets}
                                skillErrors={skillErrors}
                                onTeamChange={(tIdx, field, val) => onTeamChange(setIdx, tIdx, field, val)}
                                onDelete={(tIdx) => onDeleteTeam(setIdx, tIdx)}
                                onOpenSkillPicker={(tIdx, sIdx) => onOpenSkillPicker(setIdx, tIdx, sIdx)}
                                onSkillError={onSkillError}
                            />
                        ))}

                        {canAddTeam ? (
                            <button
                                onClick={() => onAddTeam(setIdx)}
                                className={styles.addTeamBtn}
                            >
                                <Plus size={20} />
                                <span>Deploy New Squad ({set.teams?.length || 0} / {tierCfg.maxTeams})</span>
                            </button>
                        ) : (
                            <div className="py-4 rounded-xl border border-border bg-black/20 text-center text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">
                                Maximum Deployment Capacity Reached
                            </div>
                        )}
                    </div>

                    {/* Save Footer */}
                    {set._dirty && (
                        <div className="flex justify-end pt-4 border-t border-border mt-2">
                            <button
                                onClick={() => onSaveSet(setIdx)}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-600/20"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Synchronize Set {setIdx + 1}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
