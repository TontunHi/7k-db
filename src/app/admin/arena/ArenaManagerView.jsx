"use client"

import { useState } from "react"
import { Plus, Save, Loader2, ShieldAlert } from "lucide-react"
import { 
    createArenaTeam, 
    updateArenaTeam, 
    deleteArenaTeam as deleteArenaAction,
    reorderArenaTeams
} from "@/lib/arena-actions"
import ArenaTeamSet from "./components/ArenaTeamSet"
import ArenaSkillPicker from "./components/ArenaSkillPicker"
import { clsx } from "clsx"
import { toast } from "sonner"
import styles from "./arena.module.css"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"

/**
 * ArenaManagerView - Orchestrator for Arena squad management
 */
export default function ArenaManagerView({ initialTeams, assets }) {
    const [teams, setTeams] = useState(initialTeams.map(t => ({ 
        ...t, 
        id: t.id.toString(), 
        _dirty: false 
    })))
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null)
    const [collapsedSets, setCollapsedSets] = useState(new Set(initialTeams.map(t => t.id.toString())))

    // --- DND Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setTeams((items) => {
                const oldIndex = items.findIndex(t => t.id === active.id)
                const newIndex = items.findIndex(t => t.id === over.id)
                const newArr = arrayMove(items, oldIndex, newIndex)
                
                // Reassign team_index and mark as dirty for reorder save
                return newArr.map((team, idx) => ({
                    ...team,
                    team_index: idx + 1,
                    _dirty: true
                }))
            })
        }
    }

    const handleAddTeam = () => {
        const newTeam = {
            id: `new-${Date.now()}`,
            team_index: teams.length + 1,
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
        setTeams([...teams, newTeam])
        toast.info("New squad configuration drafted")
    }

    const handleUpdateTeam = (index, field, value) => {
        const updated = [...teams]
        if (field === 'builder') {
            updated[index] = { 
                ...updated[index], 
                formation: value.formation,
                pet_file: value.pet_file,
                heroes: value.heroes,
                _dirty: true 
            }
        } else {
            updated[index] = { ...updated[index], [field]: value, _dirty: true }
        }
        setTeams(updated)
    }

    const handleDeleteTeam = async (index) => {
        const team = teams[index]
        if (!confirm(`Permanently decommission ${team.team_name || 'Squad ' + (index + 1)}?`)) return

        try {
            if (!team._isNew) {
                await deleteArenaAction(team.id)
            }
            setTeams(teams.filter((_, i) => i !== index))
            toast.success("Squad decommissioned")
        } catch (err) {
            toast.error("Operation failed")
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const dirtyTeams = teams.filter(t => t._dirty)
        
        try {
            // First save/update dirty teams
            for (const team of dirtyTeams) {
                const data = {
                    team_index: team.team_index,
                    team_name: team.team_name,
                    formation: team.formation,
                    pet_file: team.pet_file,
                    heroes: team.heroes,
                    skill_rotation: team.skill_rotation,
                    video_url: team.video_url,
                    note: team.note
                }

                if (team._isNew) {
                    await createArenaTeam(data)
                } else {
                    await updateArenaTeam(team.id, data)
                }
            }

            // Sync reorder if order changed (reorderArenaTeams handles the index logic)
            const orderedIds = teams.map(t => t.id)
            await reorderArenaTeams(orderedIds)
            
            // Refresh state
            const freshTeams = await (await import('@/lib/arena-actions')).getArenaTeams()
            setTeams(freshTeams.map(t => ({ ...t, id: t.id.toString(), _dirty: false })))
            toast.success("Tactical configurations synchronized")
        } catch (err) {
            console.error(err)
            toast.error("Synchronization failed")
        } finally {
            setSaving(false)
        }
    }

    // --- Slot Handlers ---
    const handleAddSlot = (teamIdx) => {
        const updated = [...teams]
        const rotation = [...(updated[teamIdx].skill_rotation || [])]
        rotation.push({ label: '', skill: null })
        updated[teamIdx] = { ...updated[teamIdx], skill_rotation: rotation, _dirty: true }
        setTeams(updated)
    }

    const handleUpdateSlotLabel = (teamIdx, slotIdx, label) => {
        const updated = [...teams]
        const rotation = [...(updated[teamIdx].skill_rotation || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], label }
        updated[teamIdx] = { ...updated[teamIdx], skill_rotation: rotation, _dirty: true }
        setTeams(updated)
    }

    const handleSelectSkillForSlot = (teamIdx, slotIdx, skillKey) => {
        const updated = [...teams]
        const rotation = [...(updated[teamIdx].skill_rotation || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
        updated[teamIdx] = { ...updated[teamIdx], skill_rotation: rotation, _dirty: true }
        setTeams(updated)
        setSkillPicker(null)
    }

    const handleDeleteSlot = (teamIdx, slotIdx) => {
        const updated = [...teams]
        const rotation = [...(updated[teamIdx].skill_rotation || [])]
        rotation.splice(slotIdx, 1)
        updated[teamIdx] = { ...updated[teamIdx], skill_rotation: rotation, _dirty: true }
        setTeams(updated)
    }

    const toggleCollapse = (id) => {
        const next = new Set(collapsedSets)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setCollapsedSets(next)
    }

    const hasDirty = teams.some(s => s._dirty)

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerCard}>
                <div className={styles.headerGlow} />
                <div className={styles.titleSection}>
                    <div className={styles.iconWrapper}>
                        <ShieldAlert size={32} className="text-amber-500" />
                    </div>
                    <div>
                        <h1 className={styles.title}>Arena Commander</h1>
                        <p className={styles.subtitle}>Configure elite squads and tactical rotations for public Arena matchmaking.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={handleAddTeam}
                        className="flex items-center gap-2 px-5 py-3 bg-white/5 text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-border shadow-xl"
                    >
                        <Plus size={18} />
                        <span>Deploy Squad</span>
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={!hasDirty || saving}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl",
                            hasDirty 
                                ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20" 
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        )}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Sortable List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className={styles.teamList}>
                    {teams.length === 0 && (
                        <div className={styles.emptyState}>
                            <ShieldAlert size={48} className="text-muted-foreground opacity-20" />
                            <p className="text-muted-foreground font-bold italic">No combat squads currently deployed.</p>
                            <button onClick={handleAddTeam} className="text-amber-500 font-black uppercase text-xs tracking-widest py-2 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all">Initialize First Squad</button>
                        </div>
                    )}

                    <SortableContext items={teams.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {teams.map((team, idx) => (
                            <ArenaTeamSet
                                key={team.id}
                                team={team}
                                index={idx}
                                assets={assets}
                                skillErrors={skillErrors}
                                isMinimized={collapsedSets.has(team.id)}
                                onTeamUpdate={handleUpdateTeam}
                                onDelete={handleDeleteTeam}
                                onAddSlot={handleAddSlot}
                                onDeleteSlot={handleDeleteSlot}
                                onUpdateSlotLabel={handleUpdateSlotLabel}
                                onOpenSkillPicker={setSkillPicker}
                                onToggleMinimize={toggleCollapse}
                                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {/* Modal */}
            <ArenaSkillPicker
                setIdx={skillPicker?.teamIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={skillPicker !== null && teams[skillPicker.teamIdx] ? teams[skillPicker.teamIdx].heroes : []}
                skillsMap={assets.skills}
                skillErrors={skillErrors}
                onSelect={handleSelectSkillForSlot}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />
        </div>
    )
}
