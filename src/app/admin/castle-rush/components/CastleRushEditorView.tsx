"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ActionLabel, Marker, SectionHeader } from "../../components/AdminEditorial"
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByBoss } from '@/lib/castle-rush-actions'
import styles from '../castle-rush.module.css'
import { clsx } from 'clsx'
import CastleRushTeamSet from './CastleRushTeamSet'
import CastleRushSkillPicker from './CastleRushSkillPicker'
import { toast } from 'sonner'

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

/**
 * CastleRushEditorView - Orchestrator for Castle Rush team setups
 */
export default function CastleRushEditorView({ bossKey, initialBoss, initialSets, allBosses, assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)
    const [collapsedSets, setCollapsedSets] = useState(new Set(initialSets.map(s => s.id)))

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setSets((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                
                const newItems = arrayMove(items, oldIndex, newIndex)
                
                // Update set_index and mark all as dirty if order changed
                return newItems.map((item: any, idx) => ({
                    ...item,
                    set_index: idx + 1,
                    _dirty: true
                }))
            })
            toast.info("Tactical order adjusted")
        }
    }

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            boss_key: bossKey,
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
                    boss_key: bossKey,
                    team_name: set.team_name,
                    formation: set.formation,
                    pet_file: set.pet_file,
                    heroes: set.heroes,
                    skill_rotation: set.skill_rotation,
                    video_url: set.video_url,
                    note: set.note,
                    set_index: set.set_index
                }

                if (set._isNew) {
                    await createSet(data)
                } else {
                    await updateSet(set.id, data)
                }
            }
            
            const freshSets = await getSetsByBoss(bossKey)
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
                    <Link href="/admin/castle-rush" className="flex items-center gap-2 text-muted-foreground hover:text-amber-500 transition-colors w-fit group mb-4">
                        <ActionLabel label="ABORT TO COMMAND" />
                    </Link>

                    <div className={styles.sidebarCard}>
                        <NextImage src={initialBoss.image} alt={initialBoss.name} fill className={styles.bgImage} />
                        <div className={styles.overlay} />
                        <div className={styles.cardContent}>
                            <h2 className={styles.bossName}>{initialBoss.name}</h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">Sector Navigation</h4>
                        <div className="space-y-2">
                            {allBosses.filter(b => b.key !== bossKey).map(b => (
                                <Link key={b.key} href={`/admin/castle-rush/${b.key}`} className="relative aspect-[3168/514] block rounded-xl overflow-hidden border border-border group grayscale hover:grayscale-0 transition-all">
                                    <NextImage src={b.image} alt={b.name} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">{b.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Intel Stream */}
                <main className={styles.mainContent}>
                    <header className={styles.editorHeader}>
                        <div className="flex items-center gap-3">
                            <Marker color="bg-amber-500" />
                            <h1 className="text-xl font-black italic uppercase">Squad Configuration</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleAddSet} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors border border-border shadow-xl">
                                <ActionLabel label="ADD SQUAD" />
                            </button>
                            <button
                                onClick={handleSaveAll}
                                disabled={!hasDirty || saving}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl",
                                    hasDirty 
                                        ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20" 
                                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                )}
                            >
                                <ActionLabel label={saving ? "EXECUTING..." : "COMMIT INTEL"} color={hasDirty ? "text-black" : "text-muted-foreground"} />
                            </button>
                        </div>
                    </header>

                    <div className="space-y-6">
                        {sets.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <div className="text-[4rem] font-black opacity-5 italic mb-4">EMPTY_SECTOR</div>
                                <p className="text-muted-foreground italic uppercase text-[10px] font-black tracking-widest">No tactical squads deployed in this sector.</p>
                            </div>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={sets.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sets.map((set, idx) => (
                                    <CastleRushTeamSet
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
                            </SortableContext>
                        </DndContext>
                    </div>
                </main>
            </div>

            {/* Modal Intel */}
            <CastleRushSkillPicker
                setIdx={skillPicker?.setIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={skillPicker !== null && sets[skillPicker.setIdx] ? sets[skillPicker.setIdx].heroes : []}
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
