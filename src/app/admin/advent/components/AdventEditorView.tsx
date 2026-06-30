"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Loader2, Compass } from 'lucide-react'
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByBoss } from '@/lib/advent-actions'
import AdventTeamSet from './AdventTeamSet'
import AdventSkillPicker from './AdventSkillPicker'
import AdventHeroBuildPicker from './AdventHeroBuildPicker'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../advent.module.css'

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
 * AdventEditorView - Orchestrator for Advent Expedition strategy editing
 */
export default function AdventEditorView({ bossKey, initialBoss, initialSets, allBosses, assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, id: s.id.toString(), _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)
    const [buildPicker, setBuildPicker] = useState(null)
    const [collapsedSets, setCollapsedSets] = useState(new Set<number | string>())

    // --- DND Sensors ---
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

    const handleDragEnd = (event: any) => {
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
            toast.info("Team order adjusted")
        }
    }

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
            hero_builds: {},
            video_url: '',
            note: '',
            _isNew: true,
            _dirty: true
        }
        setSets([...sets, newSet])
        toast.info("New team draft created")
    }

    const handleDuplicateSet = (index: number) => {
        const setToDuplicate = sets[index]
        const duplicatedSet = {
            ...setToDuplicate,
            id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            team_name: setToDuplicate.team_name ? `${setToDuplicate.team_name} (Copy)` : '',
            set_index: sets.length + 1,
            heroes: setToDuplicate.heroes ? [...setToDuplicate.heroes] : [null, null, null, null, null],
            selection_order: setToDuplicate.selection_order ? [...setToDuplicate.selection_order] : [],
            hero_builds: setToDuplicate.hero_builds ? JSON.parse(JSON.stringify(setToDuplicate.hero_builds)) : {},
            skill_rotation: setToDuplicate.skill_rotation ? [...setToDuplicate.skill_rotation] : [],
            _isNew: true,
            _dirty: true
        }
        setSets([...sets, duplicatedSet])
        toast.success("Team duplicated successfully (unsaved)")
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
            selection_order: teamData.selection_order || updated[index].selection_order || [],
            _dirty: true 
        }
        setSets(updated)
    }

    const handleUpdateHeroBuild = (setIdx, heroIdx, buildData) => {
        const updated = [...sets]
        const currentSet = updated[setIdx]
        const newHeroBuilds = { ...(currentSet.hero_builds || {}) }
        if (buildData) {
            newHeroBuilds[heroIdx] = buildData
        } else {
            delete newHeroBuilds[heroIdx] // Clear build if null
        }
        updated[setIdx] = { ...currentSet, hero_builds: newHeroBuilds, _dirty: true }
        setSets(updated)
    }

    const handleDeleteSet = async (index) => {
        const set = sets[index]
        if (!confirm(`Are you sure you want to permanently delete Team ${set.team_name || index + 1}?`)) return

        try {
            if (!set._isNew) {
                await deleteSetAction(set.id)
            }
            setSets(sets.filter((_, i) => i !== index))
            toast.success("Team deleted successfully")
        } catch (err) {
            toast.error("Failed to delete team")
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
                    selection_order: set.selection_order || [],
                    skill_rotation: set.skill_rotation,
                    hero_builds: set.hero_builds || {},
                    video_url: set.video_url,
                    note: set.note
                }

                let res;
                if (set._isNew) {
                    res = await createSet(data)
                } else {
                    res = await updateSet(set.id, data)
                }

                if (res && !res.success) {
                    throw new Error(res.error || "Validation failed")
                }
            }
            
            const freshSets = await getSetsByBoss(bossKey)
            setSets(freshSets.map(s => ({ ...s, id: s.id.toString(), _dirty: false })))
            toast.success("All teams saved successfully")
        } catch (err: any) {
            toast.error(err.message || "Failed to save teams")
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
                {/* Left Sidebar */}
                <aside className={styles.sidebar}>
                    <Link href="/admin/advent" className="flex items-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-secondary border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 w-fit group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase text-[10px] tracking-widest">Back to List</span>
                    </Link>

                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-2xl group/sidebar-main">
                        {initialBoss.image && !initialBoss.image.includes('undefined') ? (
                            <NextImage src={initialBoss.image} alt={initialBoss.name} fill className="object-cover group-hover/sidebar-main:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-violet-950/20">
                                <Compass size={48} className="text-violet-500 opacity-20 animate-pulse" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                                <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest">Active Target</span>
                            </div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">{initialBoss.name}</h2>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 flex items-center gap-1.5">
                            <span className="w-1 h-3 bg-violet-500/50 rounded-full" />
                            Other Advent Targets
                        </h4>
                        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                            {allBosses.filter(b => b.key !== bossKey).map(b => (
                                <Link 
                                    key={b.key} 
                                    href={`/admin/advent/${b.key}`} 
                                    className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:border-violet-500/20 bg-card/40 hover:bg-card/90 transition-all duration-300 group"
                                >
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                        <NextImage src={b.image} alt={b.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] font-black text-foreground/80 group-hover:text-violet-400 transition-colors uppercase truncate">
                                            {b.name}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Data Stream */}
                <main className={styles.mainContent}>
                    <header className={styles.editorHeader}>
                        <h1 className="text-xl font-black italic uppercase">Advent Teams Setup</h1>
                        <div className="flex items-center gap-3">
                            <button onClick={handleAddSet} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors border border-border shadow-xl">
                                <Plus size={18} />
                                <span>Add Team</span>
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
                                Save Changes
                            </button>
                        </div>
                    </header>

                    <div className="space-y-12">
                        {sets.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <Compass size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                                <p className="text-muted-foreground italic">No advent teams configured for this boss.</p>
                            </div>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                        >
                            {['Phase 1', 'Phase 2'].map(phase => {
                                const phaseSets = sets.filter(s => (s.phase || 'Phase 1') === phase)
                                if (phaseSets.length === 0) return null

                                return (
                                    <div key={phase} className="space-y-4">
                                        <div className="flex items-center gap-4 px-2">
                                            <h3 className="text-lg font-black italic uppercase text-violet-400 tracking-wider">
                                                {phase} Operations
                                            </h3>
                                            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                                        </div>
                                        
                                        <SortableContext
                                            items={phaseSets.map(s => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-6">
                                                {phaseSets.map((set) => {
                                                    const originalIdx = sets.findIndex(s => s.id === set.id)
                                                    return (
                                                        <AdventTeamSet
                                                            key={set.id}
                                                            set={set}
                                                            index={originalIdx}
                                                            assets={assets}
                                                            skillErrors={skillErrors}
                                                            isCollapsed={collapsedSets.has(set.id)}
                                                            onTeamUpdate={handleTeamUpdate}
                                                            onSetUpdate={handleUpdateSet}
                                                            onDelete={handleDeleteSet}
                                                            onDuplicate={handleDuplicateSet}
                                                            onAddSlot={handleAddSlot}
                                                            onDeleteSlot={handleDeleteSlot}
                                                            onUpdateSlotLabel={handleUpdateSlotLabel}
                                                            onOpenSkillPicker={setSkillPicker}
                                                            onToggleCollapse={toggleCollapse}
                                                            onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
                                                            onOpenBuildPicker={(heroIdx) => setBuildPicker({ setIdx: originalIdx, heroIdx })}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </SortableContext>
                                    </div>
                                )
                            })}
                        </DndContext>
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

            {/* Hero Build Picker */}
            {buildPicker && (
                <AdventHeroBuildPicker
                    isOpen={!!buildPicker}
                    onClose={() => setBuildPicker(null)}
                    heroFile={sets[buildPicker.setIdx]?.heroes?.[buildPicker.heroIdx]}
                    initialBuild={sets[buildPicker.setIdx]?.hero_builds?.[buildPicker.heroIdx] || null}
                    items={assets.items}
                    onSave={(buildData) => {
                        handleUpdateHeroBuild(buildPicker.setIdx, buildPicker.heroIdx, buildData)
                        setBuildPicker(null)
                    }}
                />
            )}
        </div>
    )
}
