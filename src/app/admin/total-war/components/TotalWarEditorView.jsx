"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Loader2, Swords } from 'lucide-react'
import { TIER_CONFIG } from '@/lib/total-war-config'
import {
    getSetsByTier,
    createSet,
    updateSet,
    deleteSet as deleteSetAction,
    createTeam,
    updateTeam,
    deleteTeam as deleteTeamAction,
} from '@/lib/total-war-actions'
import TotalWarSetCard from './TotalWarSetCard'
import TotalWarSkillPicker from './TotalWarSkillPicker'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../total-war.module.css'

const uid = () => `new-${Date.now()}-${Math.random()}`

/**
 * TotalWarEditorView - Orchestrator for Total War strategy editing per Tier
 */
export default function TotalWarEditorView({ tierKey, initialSets, assets }) {
    const tierCfg = TIER_CONFIG.find(t => t.key === tierKey)
    const [sets, setSets] = useState(initialSets.map(s => ({
        ...s,
        _dirty: false,
        teams: (s.teams || []).map(t => ({ ...t, _uid: String(t.id), _dirty: false }))
    })))
    const [loading, setLoading] = useState(false)
    const [savingSetId, setSavingSetId] = useState(null)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null) // { setIdx, teamIdx, slotIdx }

    const handleAddSet = () => {
        setSets(prev => [...prev, {
            id: uid(), tier: tierKey, set_name: '', note: '', teams: [], _isNew: true, _dirty: true
        }])
        toast.info("New tactical set drafted")
    }

    const handleSetUpdate = (setIdx, field, value) => {
        setSets(prev => {
            const next = [...prev]
            next[setIdx] = { ...next[setIdx], [field]: value, _dirty: true }
            return next
        })
    }

    const handleDeleteSet = async (setIdx) => {
        const set = sets[setIdx]
        if (!confirm(`Permanently remove Strategy Set ${set.set_name || setIdx + 1}?`)) return

        try {
            if (!set._isNew) await deleteSetAction(set.id)
            setSets(prev => prev.filter((_, i) => i !== setIdx))
            toast.success("Strategic set purged")
        } catch (err) {
            toast.error("Operation failed")
        }
    }

    const handleAddTeam = (setIdx) => {
        const defFormation = assets.formations[0]?.value || '2-3'
        setSets(prev => {
            const next = [...prev]
            next[setIdx] = {
                ...next[setIdx],
                _dirty: true,
                teams: [...(next[setIdx].teams || []), {
                    id: uid(), _uid: uid(), _isNew: true, _dirty: true,
                    team_name: '', formation: defFormation, pet_file: '',
                    heroes: [null, null, null, null, null], skill_rotation: [], video_url: '', note: ''
                }]
            }
            return next
        })
    }

    const handleTeamChange = (setIdx, teamIdx, field, value) => {
        setSets(prev => {
            const next = [...prev]
            const teams = [...next[setIdx].teams]
            if (field === '_teamData') {
                teams[teamIdx] = { ...teams[teamIdx], formation: value.formation, pet_file: value.pet_file, heroes: value.heroes, _dirty: true }
            } else {
                teams[teamIdx] = { ...teams[teamIdx], [field]: value, _dirty: true }
            }
            next[setIdx] = { ...next[setIdx], teams, _dirty: true }
            return next
        })
    }

    const handleDeleteTeam = async (setIdx, teamIdx) => {
        const team = sets[setIdx].teams[teamIdx]
        if (!confirm(`Remove Squad ${team.team_name || teamIdx + 1}?`)) return

        try {
            if (!team._isNew) await deleteTeamAction(team.id)
            setSets(prev => {
                const next = [...prev]
                next[setIdx] = { ...next[setIdx], teams: next[setIdx].teams.filter((_, i) => i !== teamIdx), _dirty: true }
                return next
            })
            toast.success("Squad decommissioned")
        } catch (err) {
            toast.error("Operation failed")
        }
    }

    const handleSaveSet = async (setIdx) => {
        const set = sets[setIdx]
        setSavingSetId(setIdx)

        try {
            let setId = set.id
            if (set._isNew) {
                const res = await createSet({ tier: tierKey, set_name: set.set_name, note: set.note })
                if (!res.success) throw new Error(res.error)
                setId = res.id
            } else {
                await updateSet(setId, { set_name: set.set_name, note: set.note })
            }

            // Save each dirty team
            for (const team of set.teams) {
                if (!team._dirty) continue
                const teamData = { 
                    set_id: setId, 
                    team_name: team.team_name, 
                    formation: team.formation, 
                    pet_file: team.pet_file, 
                    heroes: team.heroes, 
                    skill_rotation: team.skill_rotation, 
                    video_url: team.video_url, 
                    note: team.note 
                }
                if (team._isNew) {
                    await createTeam(teamData)
                } else {
                    await updateTeam(team.id, teamData)
                }
            }

            // Refresh local state
            const refreshed = await getSetsByTier(tierKey)
            setSets(refreshed.map(s => ({
                ...s, _dirty: false,
                teams: (s.teams || []).map(t => ({ ...t, _uid: String(t.id), _dirty: false }))
            })))
            toast.success(`Strategic Set ${setIdx + 1} Synchronized`)
        } catch (err) {
            toast.error("Synchronization failed")
        } finally {
            setSavingSetId(null)
        }
    }

    const handleSkillSelect = (skillKey) => {
        if (!skillPicker) return
        const { setIdx, teamIdx, slotIdx } = skillPicker
        
        setSets(prev => {
            const next = [...prev]
            if (!next[setIdx] || !next[setIdx].teams[teamIdx]) return prev
            
            const teams = [...next[setIdx].teams]
            const rotation = [...(teams[teamIdx].skill_rotation || [])]
            
            rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
            teams[teamIdx] = { ...teams[teamIdx], skill_rotation: rotation, _dirty: true }
            
            next[setIdx] = { ...next[setIdx], teams, _dirty: true }
            return next
        })
        setSkillPicker(null)
    }

    if (!tierCfg) return <div className="py-20 text-center text-gray-500">Tier profile missing from registry.</div>

    return (
        <div className={styles.container}>
            <div className={styles.editorLayout}>
                {/* Tactical Sidebar */}
                <aside className={styles.sidebar}>
                    <Link href="/admin/total-war" className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors w-fit group mb-4">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase text-xs tracking-widest">Return to Operations</span>
                    </Link>

                    <div className={styles.sidebarLogoCard} style={{ borderColor: tierCfg.accent + '40' }}>
                        <NextImage src={tierCfg.logo} alt={tierCfg.label} fill className="object-contain p-4" priority />
                    </div>

                    <div className="mt-4 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">Operational Tiers</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {TIER_CONFIG.map(t => (
                                <Link key={t.key} href={`/admin/total-war/${t.key}`}
                                    className={clsx(
                                        "flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border transition-all",
                                        t.key === tierKey ? "border-gray-600 bg-gray-800/80" : "border-transparent hover:bg-gray-800/40 hover:border-gray-700"
                                    )}>
                                    <div className="relative w-6 h-6 shrink-0">
                                        <NextImage src={t.logo} alt={t.label} fill className="object-contain" sizes="24px" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.key === tierKey ? t.accent : '#4b5563' }}>
                                        {t.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Data Stream */}
                <main className={styles.mainContent}>
                    <header className={styles.topBar}>
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8">
                                <NextImage src={tierCfg.logo} alt={tierCfg.label} fill className="object-contain" sizes="32px" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black italic uppercase" style={{ color: tierCfg.accent }}>{tierCfg.label} Strategic Matrix</h1>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{sets.length} Configured Sets · Capacity: {tierCfg.maxTeams} Teams / Set</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddSet}
                            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors border border-border"
                        >
                            <Plus size={18} />
                            <span>Add Strategic Set</span>
                        </button>
                    </header>

                    <div className="space-y-6">
                        {sets.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <Swords size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                                <p className="text-muted-foreground italic font-bold">No strategic configurations logged for this tier.</p>
                            </div>
                        ) : (
                            sets.map((set, setIdx) => (
                                <TotalWarSetCard
                                    key={set.id}
                                    set={set}
                                    setIdx={setIdx}
                                    tierCfg={tierCfg}
                                    assets={assets}
                                    skillErrors={skillErrors}
                                    saving={savingSetId === setIdx}
                                    onSetUpdate={handleSetUpdate}
                                    onAddTeam={handleAddTeam}
                                    onTeamChange={handleTeamChange}
                                    onDeleteTeam={handleDeleteTeam}
                                    onDeleteSet={handleDeleteSet}
                                    onSaveSet={handleSaveSet}
                                    onOpenSkillPicker={(si, ti, sli) => setSkillPicker({ setIdx: si, teamIdx: ti, slotIdx: sli })}
                                    onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>

            {/* Tactical Modal */}
            <TotalWarSkillPicker
                setIdx={skillPicker?.setIdx}
                teamIdx={skillPicker?.teamIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={skillPicker !== null ? sets[skillPicker.setIdx]?.teams[skillPicker.teamIdx]?.heroes || [] : []}
                skillsMap={assets.skills}
                skillErrors={skillErrors}
                onSelect={handleSkillSelect}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />
        </div>
    )
}
