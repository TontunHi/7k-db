"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Loader2, Landmark } from 'lucide-react'
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByDungeon } from '@/lib/dungeon-actions'
import DungeonTeamSet from './DungeonTeamSet'
import SkillPickerModal from './SkillPickerModal'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../dungeon.module.css'

/**
 * DungeonEditorView - Main orchestrator for editing dungeon setups
 */
export default function DungeonEditorView({ dungeonKey, initialDungeon, initialSets, assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            dungeon_key: dungeonKey,
            set_index: sets.length + 1,
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
        toast.info("New team deployment added")
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
        if (!confirm(`Permanently remove Team ${index + 1}?`)) return

        try {
            if (!set._isNew) {
                await deleteSetAction(set.id)
            }
            setSets(sets.filter((_, i) => i !== index))
            toast.success("Team deployment removed")
        } catch (err) {
            toast.error("Failed to delete team set")
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const dirtySets = sets.filter(s => s._dirty)
        
        try {
            for (const set of dirtySets) {
                const data = {
                    dungeon_key: dungeonKey,
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
            toast.success("All tactical data synced to database")
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

    const hasDirty = sets.some(s => s._dirty)

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className="space-y-6">
                <Link href="/admin/dungeon" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase text-xs tracking-widest">Abort to Command Center</span>
                </Link>

                <div className={styles.heroSection}>
                    <NextImage src={initialDungeon.image} alt={initialDungeon.name} fill className={styles.bgImage} />
                    <div className={styles.heroContent}>
                        <div className="flex items-center gap-2 mb-2">
                            <Landmark size={20} className="text-primary" />
                            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Active Sector</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase">{initialDungeon.name}</h2>
                    </div>
                </div>
            </div>

            {/* Global Controls */}
            <header className={styles.editorHeader}>
                <h1 className="hidden md:block text-xl font-black italic uppercase">Squad Configurations</h1>
                <div className="flex items-center gap-3 ml-auto">
                    <button onClick={handleAddSet} className={styles.addBtn}>
                        <Plus size={18} />
                        <span>Add Squad</span>
                    </button>
                    
                    <button
                        onClick={handleSaveAll}
                        disabled={!hasDirty || saving}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all",
                            hasDirty 
                                ? "bg-primary text-black hover:brightness-110 shadow-lg shadow-primary/20" 
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        )}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save All Intel
                    </button>
                </div>
            </header>

            {/* Sets List */}
            <div className="space-y-8">
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
                        onTeamUpdate={handleTeamUpdate}
                        onSetUpdate={handleUpdateSet}
                        onDelete={handleDeleteSet}
                        onAddSlot={handleAddSlot}
                        onDeleteSlot={handleDeleteSlot}
                        onUpdateSlotLabel={handleUpdateSlotLabel}
                        onOpenSkillPicker={setSkillPicker} // ERROR: This is the state. Should be setSkillPicker function. Wait, in JS the setter is named the same? No.
                        onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
                    />
                ))}
            </div>

            {/* Modal */}
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
