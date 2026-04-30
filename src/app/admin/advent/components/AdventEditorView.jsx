"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Loader2, Compass } from 'lucide-react'
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByBoss } from '@/lib/advent-actions'
import AdventTeamSet from './AdventTeamSet'
import AdventSkillPicker from './AdventSkillPicker'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../advent.module.css'

/**
 * AdventEditorView - Orchestrator for Advent Expedition strategy editing
 */
export default function AdventEditorView({ bossKey, initialBoss, initialSets, allBosses, assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)
    const [collapsedSets, setCollapsedSets] = useState(new Set(initialSets.map(s => s.id)))

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            boss_key: bossKey,
            phase: 'Phase 1',
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
        toast.info("New mission profile drafted")
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
        if (!confirm(`Permanently remove Strategy Profile ${set.team_name || index + 1}?`)) return

        try {
            if (!set._isNew) {
                await deleteSetAction(set.id)
            }
            setSets(sets.filter((_, i) => i !== index))
            toast.success("Mission profile purged")
        } catch (err) {
            toast.error("Purge failed")
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const dirtySets = sets.filter(s => s._dirty)
        
        try {
            for (const set of dirtySets) {
                const data = {
                    boss_key: bossKey,
                    phase: set.phase,
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
            
            const freshSets = await getSetsByBoss(bossKey)
            setSets(freshSets.map(s => ({ ...s, _dirty: false })))
            toast.success("Strategic data synchronized")
        } catch (err) {
            toast.error("Synchronization failed")
        } finally {
            setSaving(false)
        }
    }

    // --- Slot Handlers ---
    const handleAddSlot = (setIdx) => {
        const updated = [...sets]
        const rotation = [...(updated[setIdx].skill_rotation || [])]
        rotation.push({ label: '', skill: null })
        updated[setIdx] = { ...updated[setIdx], skill_rotation: rotation, _dirty: true }
        setSets(updated)
    }

    const handleUpdateSlotLabel = (setIdx, slotIdx, label) => {
        const updated = [...sets]
        const rotation = [...(updated[setIdx].skill_rotation || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], label }
        updated[setIdx] = { ...updated[setIdx], skill_rotation: rotation, _dirty: true }
        setSets(updated)
    }

    const handleSelectSkillForSlot = (setIdx, slotIdx, skillKey) => {
        setSets(prev => {
            const next = [...prev]
            if (!next[setIdx]) return prev
            
            const rotation = [...(next[setIdx].skill_rotation || [])]
            rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
            
            next[setIdx] = { ...next[setIdx], skill_rotation: rotation, _dirty: true }
            return next
        })
        setSkillPicker(null)
    }

    const handleDeleteSlot = (setIdx, slotIdx) => {
        const updated = [...sets]
        const rotation = [...(updated[setIdx].skill_rotation || [])]
        rotation.splice(slotIdx, 1)
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
                {/* Tactical Sidebar */}
                <aside className={styles.sidebar}>
                    <Link href="/admin/advent" className="flex items-center gap-2 text-muted-foreground hover:text-violet-400 transition-colors w-fit group mb-4">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase text-xs tracking-widest">Return to Expedition HUB</span>
                    </Link>

                    <div className={styles.sidebarCard}>
                        {initialBoss.image && !initialBoss.image.includes('undefined') ? (
                            <NextImage src={initialBoss.image} alt={initialBoss.name} fill className={styles.bgImage} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-violet-950/20">
                                <Compass size={48} className="text-violet-500 opacity-20" />
                            </div>
                        )}
                        <div className={styles.overlay} />
                        <div className={styles.cardContent}>
                            <h2 className={styles.bossName}>{initialBoss.name}</h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">Expedition Vectors</h4>
                        <div className="grid grid-cols-1 gap-2 pr-2">
                            {allBosses.filter(b => b.key !== bossKey).map(b => (
                                <Link key={b.key} href={`/admin/advent/${b.key}`} className="relative aspect-video block rounded-xl overflow-hidden border border-border group grayscale hover:grayscale-0 transition-all">
                                    <NextImage src={b.image} alt={b.name} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{b.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Data Stream */}
                <main className={styles.mainContent}>
                    <header className={styles.editorHeader}>
                        <h1 className="text-xl font-black italic uppercase">Strategy Matrix</h1>
                        <div className="flex items-center gap-3">
                            <button onClick={handleAddSet} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors border border-border shadow-xl">
                                <Plus size={18} />
                                <span>Draft Strategy</span>
                            </button>
                            <button
                                onClick={handleSaveAll}
                                disabled={!hasDirty || saving}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl",
                                    hasDirty 
                                        ? "bg-violet-600 text-white hover:bg-violet-500 shadow-violet-600/20" 
                                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                )}
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Upload Intel
                            </button>
                        </div>
                    </header>

                    <div className="space-y-6">
                        {sets.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <Compass size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                                <p className="text-muted-foreground italic">No tactical strategies logged for this boss.</p>
                            </div>
                        )}

                        {sets.map((set, idx) => (
                            <AdventTeamSet
                                key={set.id}
                                set={set}
                                index={idx}
                                assets={assets}
                                skillErrors={skillErrors}
                                isCollapsed={collapsedSets.has(set.id)}
                                onTeamUpdate={handleTeamUpdate}
                                onSetUpdate={handleUpdateSet}
                                onDelete={handleDeleteSet}
                                onAddSlot={handleAddSlot}
                                onDeleteSlot={handleDeleteSlot}
                                onUpdateSlotLabel={handleUpdateSlotLabel}
                                onOpenSkillPicker={setSkillPicker}
                                onToggleCollapse={toggleCollapse}
                                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
                            />
                        ))}
                    </div>
                </main>
            </div>

            {/* Tactical Intel Picker */}
            <AdventSkillPicker
                setIdx={skillPicker?.setIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={skillPicker !== null && sets[skillPicker.setIdx] ? sets[skillPicker.setIdx].heroes : []}
                skillsMap={assets.skills}
                skillErrors={skillErrors}
                onSelect={handleSelectSkillForSlot}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />
        </div>
    )
}
