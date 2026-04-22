"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Loader2, Skull } from 'lucide-react'
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByRaid } from '@/lib/raid-actions'
import RaidTeamSet from './RaidTeamSet'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../raid.module.css'

/**
 * RaidEditorView - Main orchestrator for editing raid tactical data
 */
export default function RaidEditorView({ raidKey, initialRaid, initialSets, allRaids, assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [collapsedSets, setCollapsedSets] = useState(new Set(initialSets.map(s => s.id)))

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            raid_key: raidKey,
            set_index: sets.length + 1,
            team_name: '',
            formation: assets.formations[0]?.value || '2-3',
            pet_file: '',
            heroes: [null, null, null, null, null],
            skill_rotation: [],
            video_url: '',
            note: '',
            _isNew: true,
            _dirty: true
        }
        setSets([...sets, newSet])
        toast.info("New tactical deployment drafted")
    }

    const handleUpdateSet = (index, field, value) => {
        const updated = [...sets]
        updated[index] = { ...updated[index], [field]: value, _dirty: true }
        setSets(updated)
    }

    const handleTeamUpdate = (index, teamData) => {
        const updated = [...sets]
        updated[index] = { 
            ...updated[index], 
            formation: teamData.formation,
            pet_file: teamData.pet_file,
            heroes: teamData.heroes,
            _dirty: true 
        }
        setSets(updated)
    }

    const handleDeleteSet = async (index) => {
        const set = sets[index]
        if (!confirm(`Permanently decommission Squad ${set.team_name || index + 1}?`)) return

        try {
            if (!set._isNew) {
                await deleteSetAction(set.id)
            }
            setSets(sets.filter((_, i) => i !== index))
            toast.success("Squad decommissioned")
        } catch (err) {
            toast.error("Decommissioning failed")
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const dirtySets = sets.filter(s => s._dirty)
        
        try {
            for (const set of dirtySets) {
                const data = {
                    raid_key: raidKey,
                    team_name: set.team_name,
                    formation: set.formation,
                    pet_file: set.pet_file,
                    heroes: set.heroes,
                    skill_rotation: set.skill_rotation,
                    video_url: set.video_url,
                    note: set.note
                }

                if (set._isNew) {
                    await createSet(data)
                } else {
                    await updateSet(set.id, data)
                }
            }
            
            const freshSets = await getSetsByRaid(raidKey)
            setSets(freshSets.map(s => ({ ...s, _dirty: false })))
            toast.success("Tactical synchronization complete")
        } catch (err) {
            toast.error("Synchronization failed")
        } finally {
            setSaving(false)
        }
    }

    const handleToggleSkill = (setIdx, skillDataKey) => {
        const updated = [...sets]
        let rotation = [...(updated[setIdx].skill_rotation || [])]
        
        const existingIdx = rotation.indexOf(skillDataKey)
        if (existingIdx >= 0) {
            rotation = rotation.filter(k => k !== skillDataKey)
        } else {
            rotation.push(skillDataKey)
        }
        
        updated[setIdx] = { ...updated[setIdx], skill_rotation: rotation, _dirty: true }
        setSets(updated)
    }

    const toggleCollapse = (id) => {
        const next = new Set(collapsedSets)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setCollapsedSets(next)
    }

    const hasDirty = sets.some(s => s._dirty)

    return (
        <div className={styles.container}>
            <div className={styles.editorLayout}>
                {/* Left Tactical Sidebar */}
                <aside className={styles.sidebar}>
                    <Link href="/admin/raid" className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors w-fit group mb-4">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase text-xs tracking-widest">Abort to Command Center</span>
                    </Link>

                    <div className={styles.sidebarCard}>
                        <NextImage src={initialRaid.image} alt={initialRaid.name} fill className={styles.bgImage} />
                        <div className={styles.overlay} />
                        <div className={styles.cardContent}>
                            <div className="flex items-center gap-2 mb-1">
                                <Skull size={14} className="text-red-500" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Raid Boss</span>
                            </div>
                            <h2 className={styles.raidName}>{initialRaid.name}</h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">Other Sectors</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {allRaids.filter(r => r.key !== raidKey).map(r => (
                                <Link key={r.key} href={`/admin/raid/${r.key}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border group grayscale hover:grayscale-0 transition-all">
                                    <NextImage src={r.image} alt={r.name} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
                                        <span className="text-[8px] font-black text-white uppercase tracking-tighter leading-tight drop-shadow-lg">{r.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Intel Flow */}
                <main className={styles.mainContent}>
                    <header className={styles.stickyHeader}>
                        <h1 className="text-xl font-black italic uppercase">Squad Intelligence</h1>
                        <div className="flex items-center gap-3">
                            <button onClick={handleAddSet} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors border border-border">
                                <Plus size={18} />
                                <span>Add Squad</span>
                            </button>
                            <button
                                onClick={handleSaveAll}
                                disabled={!hasDirty || saving}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all",
                                    hasDirty 
                                        ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20" 
                                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                )}
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Sync Data
                            </button>
                        </div>
                    </header>

                    <div className="space-y-6">
                        {sets.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <Skull size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                                <p className="text-muted-foreground italic">No tactical squads deployed for this boss.</p>
                            </div>
                        )}

                        {sets.map((set, idx) => (
                            <RaidTeamSet
                                key={set.id}
                                set={set}
                                index={idx}
                                assets={assets}
                                skillErrors={skillErrors}
                                isCollapsed={collapsedSets.has(set.id)}
                                onTeamUpdate={handleTeamUpdate}
                                onSetUpdate={handleUpdateSet}
                                onDelete={handleDeleteSet}
                                onToggleSkill={handleToggleSkill}
                                onToggleCollapse={toggleCollapse}
                                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
