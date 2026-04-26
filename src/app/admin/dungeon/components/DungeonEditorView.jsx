"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Loader2, Landmark } from 'lucide-react'
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByDungeon, getDungeons } from '@/lib/dungeon-actions'
import DungeonTeamSet from './DungeonTeamSet'
import SkillPickerModal from './SkillPickerModal'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../dungeon.module.css'

/**
 * DungeonEditorView - Main orchestrator for editing dungeon setups
 */
export default function DungeonEditorView({ dungeonKey, initialDungeon, initialSets, allDungeons = [], assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)
    const [collapsedSets, setCollapsedSets] = useState(new Set(initialSets.map(s => s.id)))

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            dungeon_key: dungeonKey,
            set_index: sets.length + 1,
            team_name: '',
            formation: assets.formations[0]?.value || '2-3',
            pet_file: '',
            heroes: [null, null, null, null, null],
            skill_rotation: [],
            aura: null,
            video_url: '',
            note: '',
            _isNew: true,
            _dirty: true
        }
        setSets([...sets, newSet])
        toast.info("New team deployment drafted")
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
        if (!confirm(`Permanently remove Team ${set.team_name || index + 1}?`)) return

        try {
            if (!set._isNew) {
                await deleteSetAction(set.id)
            }
            setSets(sets.filter((_, i) => i !== index))
            toast.success("Team deployment removed")
        } catch (err) {
            toast.error("Deletion failed")
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const dirtySets = sets.filter(s => s._dirty)
        
        try {
            for (const set of dirtySets) {
                const data = {
                    dungeon_key: dungeonKey,
                    team_name: set.team_name,
                    formation: set.formation,
                    pet_file: set.pet_file,
                    aura: set.aura,
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
            
            // Sync local state
            const freshSets = await getSetsByDungeon(dungeonKey)
            setSets(freshSets.map(s => ({ ...s, _dirty: false })))
            toast.success("Tactical intel synchronized")
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
        const updated = [...sets]
        const rotation = [...(updated[setIdx].skill_rotation || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
        updated[setIdx] = { ...updated[setIdx], skill_rotation: rotation, _dirty: true }
        setSets(updated)
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
                {/* Sidebar Protocol */}
                <aside className={styles.sidebar}>
                    <Link href="/admin/dungeon" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit group mb-4">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase text-xs tracking-widest">Abort to Command Center</span>
                    </Link>

                    <div className={styles.sidebarCard}>
                        <NextImage src={initialDungeon.image} alt={initialDungeon.name} fill className={styles.bgImage} />
                        <div className={styles.overlay} />
                        <div className={styles.cardContent}>
                            <h2 className={styles.bossName}>{initialDungeon.name}</h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">Sector Navigation</h4>
                        <div className="space-y-2">
                            {allDungeons.filter(d => d.key !== dungeonKey).map(d => (
                                <Link key={d.key} href={`/admin/dungeon/${d.key}`} className="relative aspect-[3168/514] block rounded-xl overflow-hidden border border-border group grayscale hover:grayscale-0 transition-all">
                                    <NextImage src={d.image} alt={d.name} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">{d.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Intel Stream */}
                <main className={styles.mainContent}>
                    <header className={styles.editorHeader}>
                        <h1 className="text-xl font-black italic uppercase">Squad Configuration</h1>
                        <div className="flex items-center gap-3">
                            <button onClick={handleAddSet} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors border border-border shadow-xl">
                                <Plus size={18} />
                                <span>Add Squad</span>
                            </button>
                            <button
                                onClick={handleSaveAll}
                                disabled={!hasDirty || saving}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl",
                                    hasDirty 
                                        ? "bg-primary text-black hover:brightness-110 shadow-primary/20" 
                                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                )}
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Sync Intel
                            </button>
                        </div>
                    </header>

                    <div className="space-y-6">
                        {sets.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <Landmark size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                                <p className="text-muted-foreground italic">No tactical squads deployed in this sector.</p>
                            </div>
                        )}

                        {sets.map((set, idx) => (
                            <DungeonTeamSet
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

            {/* Modal Intel */}
            <SkillPickerModal
                setIdx={skillPicker?.setIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={(skillPicker !== null && sets[skillPicker.setIdx]) ? sets[skillPicker.setIdx].heroes : []}
                allHeroes={assets.heroes}
                skillsMap={assets.skills}
                skillErrors={skillErrors}
                onSelect={handleSelectSkillForSlot}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />
        </div>
    )
}
