"use client"

import { useState } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { Marker, ActionLabel } from '@/app/admin/components/AdminEditorial'
import { createSet, updateSet, deleteSet as deleteSetAction, getSetsByDungeon, getDungeons } from '@/lib/dungeon-actions'
import DungeonTeamSet from './DungeonTeamSet'
import SkillPickerModal from './SkillPickerModal'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../dungeon.module.css'
import { ArrowLeft, Plus, Save, Loader2, Compass } from 'lucide-react'

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
 * DungeonEditorView - Main orchestrator for editing dungeon setups
 */
export default function DungeonEditorView({ dungeonKey, initialDungeon, initialSets, allDungeons = [], assets }) {
    const [sets, setSets] = useState(initialSets.map(s => ({ ...s, id: s.id.toString(), _dirty: false })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)
    const [collapsedSets, setCollapsedSets] = useState(new Set(initialSets.map(s => s.id.toString())))

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
            _dirty: true 
        }
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
            setSets(freshSets.map(s => ({ ...s, id: s.id.toString(), _dirty: false })))
            toast.success("All teams saved successfully")
        } catch (err) {
            toast.error("Failed to save teams")
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
                {/* Left Sidebar */}
                <aside className={styles.sidebar}>
                    <Link href="/admin/dungeon" className="flex items-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-secondary border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 w-fit group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase text-[10px] tracking-widest">Back to List</span>
                    </Link>

                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-2xl group/sidebar-main">
                        <NextImage src={initialDungeon.image} alt={initialDungeon.name} fill className="object-cover group-hover/sidebar-main:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Active Target</span>
                            </div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">{initialDungeon.name}</h2>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 flex items-center gap-1.5">
                            <span className="w-1 h-3 bg-primary/50 rounded-full" />
                            Other Dungeons
                        </h4>
                        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                            {allDungeons.filter(d => d.key !== dungeonKey).map(d => (
                                <Link 
                                    key={d.key} 
                                    href={`/admin/dungeon/${d.key}`} 
                                    className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:border-primary/20 bg-card/40 hover:bg-card/90 transition-all duration-300 group"
                                >
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                        <NextImage src={d.image} alt={d.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] font-black text-foreground/80 group-hover:text-primary transition-colors uppercase truncate">
                                            {d.name}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Intel Stream */}
                <main className={styles.mainContent}>
                    <header className={styles.editorHeader}>
                        <h1 className="text-xl font-black italic uppercase">Dungeon Teams Setup</h1>
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
                                        ? "bg-primary text-black hover:brightness-110 shadow-primary/20" 
                                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                )}
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </header>

                    <div className="space-y-6">
                        {sets.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                                <Compass size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                                <p className="text-muted-foreground italic">No dungeon teams configured for this dungeon.</p>
                            </div>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sets.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
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
                                        onDuplicate={handleDuplicateSet}
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
