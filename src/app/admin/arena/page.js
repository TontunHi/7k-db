'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { Plus, Trash2, Video, Save, Loader2, Zap, X, Pencil, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getArenaTeams, 
    createArenaTeam, 
    updateArenaTeam, 
    deleteArenaTeam,
    reorderArenaTeams
} from '@/lib/arena-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

import { toast } from 'sonner'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from '@/components/admin/SortableItem'

// Helper to get hero skill image path
function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace(/\.[^/.]+$/, '')
    return `/skills/${folderName}/${skillNumber}.webp`
}

export default function AdminArenaPage() {
    const [teams, setTeams] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    // Skill picker state: { teamIdx, slotIdx } or null
    const [skillPicker, setSkillPicker] = useState(null)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [teamsData, heroesData, petsData, formationsData] = await Promise.all([
                getArenaTeams(),
                getAllHeroes(),
                getPets(),
                getFormations()
            ])
            setTeams(teamsData.map(s => ({ ...s, id: s.id || `db-${s.team_index}-${Date.now()}`, _dirty: false, _isMinimized: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
            setLoading(false)
        }
        loadData()
    }, [])

    const handleAddTeam = () => {
        const newTeam = {
            id: `new-${Date.now()}`,
            team_index: teams.length + 1,
            team_name: '',
            formation: formations[0]?.value || '2-3',
            pet_file: '',
            heroes: [null, null, null, null, null],
            skill_rotation: [],
            video_url: '',
            note: '',
            note: '',
            _isNew: true,
            _dirty: true,
            _isMinimized: false
        }
        setTeams([...teams, newTeam])
    }

    const handleUpdateTeam = (index, field, value) => {
        const updated = [...teams]
        updated[index] = { ...updated[index], [field]: value, _dirty: true }
        setTeams(updated)
    }

    const handleTeamBuilderUpdate = (index, teamData) => {
        const updated = [...teams]
        updated[index] = { 
            ...updated[index], 
            formation: teamData.formation,
            pet_file: teamData.pet_file,
            heroes: teamData.heroes,
            _dirty: true 
        }
        setTeams(updated)
    }

    const handleDeleteTeam = async (index) => {
        const team = teams[index]
        if (!team._isNew) {
            await deleteArenaTeam(team.id)
        }
        setTeams(teams.filter((_, i) => i !== index))
    }

    const handleSaveAll = async () => {
        setSaving(true)
        
        const savePromise = new Promise(async (resolve, reject) => {
            try {
                for (const team of teams) {
                    if (!team._dirty) continue

                    const data = {
                        team_name: team.team_name,
                        team_index: team.team_index, // Include updated index
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
                
                // After save, just reload order from db
                const teamsData = await getArenaTeams()
                setTeams(teamsData.map(s => ({ ...s, id: s.id || `db-${s.team_index}-${Date.now()}`, _dirty: false, _isMinimized: false })))
                
                resolve()
            } catch (err) {
                reject(err)
            } finally {
                setSaving(false)
            }
        });

        toast.promise(savePromise, {
            loading: 'Saving Arena configurations...',
            success: 'Arena configurations saved successfully 😎',
            error: (err) => `Failed to save: ${err.message}`
        })
    }

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
                
                // Reassign team_index and mark dirty
                return newArr.map((team, idx) => ({
                    ...team,
                    team_index: idx + 1,
                    _dirty: true
                }))
            })
        }
    }

    // --- Skill Slot Handlers ---
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

    const handleClearSlotSkill = (teamIdx, slotIdx) => {
        const updated = [...teams]
        const rotation = [...(updated[teamIdx].skill_rotation || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], skill: null }
        updated[teamIdx] = { ...updated[teamIdx], skill_rotation: rotation, _dirty: true }
        setTeams(updated)
    }

    const handleDeleteSlot = (teamIdx, slotIdx) => {
        const updated = [...teams]
        const rotation = [...(updated[teamIdx].skill_rotation || [])]
        rotation.splice(slotIdx, 1)
        updated[teamIdx] = { ...updated[teamIdx], skill_rotation: rotation, _dirty: true }
        setTeams(updated)
    }

    const handleSkillError = (key) => {
        setSkillErrors(prev => ({ ...prev, [key]: true }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
            </div>
        )
    }

    const hasDirty = teams.some(s => s._dirty)

    // Skill Picker Modal
    const SkillPickerModal = () => {
        if (!skillPicker) return null
        const { teamIdx, slotIdx } = skillPicker
        const team = teams[teamIdx]
        const teamHeroes = team.heroes || []

        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <div>
                            <h3 className="text-xl font-black text-white">Select Skill</h3>
                            <p className="text-sm text-gray-400 mt-1">Choose a skill from the team heroes</p>
                        </div>
                        <button onClick={() => setSkillPicker(null)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
                            <X size={22} />
                        </button>
                    </div>
                    <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        {teamHeroes.map((heroFile, heroIdx) => {
                            if (!heroFile) return null
                            const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ')

                            return (
                                <div key={heroIdx} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-700">
                                            {(() => {
                                                const heroData = heroes?.find(h => 
                                                    h.filename === heroFile || 
                                                    h.filename.replace(/\.[^/.]+$/, "") === heroFile
                                                )
                                                const actualFile = heroData?.filename || heroFile
                                                return <SafeImage src={`/heroes/${actualFile}`} alt={heroName} fill className="object-cover" />
                                            })()}
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 capitalize">{heroName}</span>
                                    </div>
                                    <div className="flex gap-2 ml-10">
                                        {[4, 3, 2, 1].map(skillNum => {
                                            const skillKey = `${heroIdx}-${skillNum}`
                                            const skillPath = getSkillImagePath(heroFile, skillNum)
                                            const errKey = `pick-${heroIdx}-${skillNum}`
                                            const hasError = skillErrors[errKey]

                                            return (
                                                <button
                                                    key={skillNum}
                                                    type="button"
                                                    onClick={() => handleSelectSkillForSlot(teamIdx, slotIdx, skillKey)}
                                                    className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all bg-gray-900"
                                                >
                                                    {skillPath && !hasError ? (
                                                        <SafeImage
                                                            src={skillPath}
                                                            alt={`Skill ${skillNum}`}
                                                            fill
                                                            className="object-cover"
                                                            onError={() => handleSkillError(errKey)}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600 text-xs flex items-center justify-center w-full h-full">S{skillNum}</span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                        {!teamHeroes.some(h => h) && (
                            <p className="text-center text-gray-500 py-8">No heroes in team yet</p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-purple-500/20 flex items-center justify-center border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                            <ShieldAlert className="w-8 h-8 text-[#FFD700]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Arena Team Manager
                            </h1>
                            <p className="text-gray-400 font-medium mt-1">Manage public arena teams, formations, and skill rotations</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAddTeam}
                            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all border border-gray-700 shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Add Team
                        </button>
                        
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasDirty || saving}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                                hasDirty 
                                    ? "bg-[#FFD700] text-black hover:bg-[#FFE55C] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] border border-[#FFD700]" 
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                            )}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save All
                        </button>
                    </div>
                </div>
            </div>

            {/* Teams List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-6">
                    {teams.length === 0 && (
                        <div className="text-center py-24 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                            <ShieldAlert className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-gray-300 mb-2">No Teams Configured</h3>
                            <p className="text-gray-500 text-sm">Create your first Arena team setup to display to users.</p>
                            <button
                                onClick={handleAddTeam}
                                className="mt-6 inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] px-6 py-2 rounded-lg font-bold hover:bg-[#FFD700]/20 transition-all border border-[#FFD700]/20"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Team
                            </button>
                        </div>
                    )}

                    <SortableContext items={teams.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {teams.map((team, idx) => {
                    const hasHeroes = team.heroes?.some(h => h !== null)
                    const rotation = team.skill_rotation || []

                    return (
                        <SortableItem key={team.id} id={team.id}>
                            <div 
                                className={cn(
                                    "bg-gray-900/40 border-y border-r rounded-r-2xl overflow-hidden shadow-lg transition-all flex-1 min-w-0 flex flex-col",
                                    team._dirty ? "border-[#FFD700]/50" : "border-gray-800"
                                )}
                            >
                            {/* Team Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 flex items-center justify-center text-[#FFD700] font-black border border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.05)]">
                                        {idx + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 italic transform -skew-x-6">
                                                {team.team_name || `Untitled Arena Team`}
                                            </h3>
                                            {team._dirty && (
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdateTeam(idx, 'team_name', prompt('Enter team name:', team.team_name || '') || team.team_name)}
                                        className="text-gray-400 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-xl"
                                        title="Rename Team"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateTeam(idx, '_isMinimized', !team._isMinimized)}
                                        className="text-gray-400 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-xl"
                                    >
                                        {team._isMinimized ? <Plus className="w-5 h-5" /> : <X className="w-5 h-5 rotate-45" />}
                                    </button>
                                    <div className="w-px h-6 bg-gray-800 mx-1" />
                                    <button
                                        onClick={() => handleDeleteTeam(idx)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-2.5 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {!team._isMinimized && (
                            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                {/* Team Name Inline Edit (Secondary) */}
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Name:</span>
                                    <input
                                        type="text"
                                        value={team.team_name || ''}
                                        onChange={(e) => handleUpdateTeam(idx, 'team_name', e.target.value)}
                                        placeholder="Enter Team Name..."
                                        className="bg-transparent border-b border-gray-800 focus:border-[#FFD700] outline-none text-white font-bold text-sm px-1 py-0.5 transition-colors w-full max-w-sm"
                                    />
                                </div>
                                {/* Team Builder */}
                                <TeamBuilder
                                    team={{
                                        index: idx + 1,
                                        formation: team.formation,
                                        pet_file: team.pet_file,
                                        heroes: team.heroes
                                    }}
                                    index={idx}
                                    heroesList={heroes}
                                    petsList={pets}
                                    formations={formations}
                                    onUpdate={(teamData) => handleTeamBuilderUpdate(idx, teamData)}
                                    // Make bg slightly transparent
                                    className="!bg-black/20"
                                />

                                {/* ===== Skill Slots Row ===== */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                                        <Zap className="w-5 h-5 text-[#FFD700]" />
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Skill Rotation</h3>
                                    </div>

                                    <div className="bg-black/30 rounded-xl border border-gray-800/80 p-5">
                                        <div className="flex flex-wrap items-end gap-2">
                                            {rotation.map((slot, slotIdx) => {
                                                const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                                const heroFile = team.heroes?.[hIdx]
                                                const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                                const errKey = `slot-${team.id}-${slotIdx}`
                                                const hasError = skillErrors[errKey]

                                                return (
                                                    <div key={slotIdx} className="flex flex-col items-center group relative">
                                                        {/* Editable Label */}
                                                        <input
                                                            type="text"
                                                            value={slot.label || ''}
                                                            onChange={(e) => handleUpdateSlotLabel(idx, slotIdx, e.target.value)}
                                                            placeholder="..."
                                                            className="w-14 text-center text-[11px] font-black text-[#FFD700]/90 bg-transparent border-none outline-none placeholder-gray-600 mb-1 truncate focus:bg-gray-800/50 rounded"
                                                        />
                                                        {/* Skill Square */}
                                                        <div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSkillPicker({ teamIdx: idx, slotIdx })}
                                                                disabled={!hasHeroes}
                                                                className={cn(
                                                                    "w-14 h-14 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all bg-gray-900 relative",
                                                                    slot.skill 
                                                                        ? "border-[#FFD700]/50 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]" 
                                                                        : "border-gray-700 border-dashed hover:border-gray-500",
                                                                    !hasHeroes && "cursor-not-allowed opacity-40"
                                                                )}
                                                            >
                                                                {slot.skill && heroFile && skillPath && !hasError ? (
                                                                    <NextImage
                                                                        src={skillPath}
                                                                        alt=""
                                                                        fill
                                                                        className="object-cover"
                                                                        onError={() => handleSkillError(errKey)}
                                                                    />
                                                                ) : (
                                                                    <Plus className="w-5 h-5 text-gray-600" />
                                                                )}
                                                            </button>
                                                            {/* Delete btn on hover */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteSlot(idx, slotIdx) }}
                                                                className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                            {/* Add Slot Button */}
                                            <div className="flex flex-col items-center">
                                                <div className="h-[20px]" /> {/* spacer for label alignment */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSlot(idx)}
                                                    disabled={!hasHeroes}
                                                    className={cn(
                                                        "w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center transition-all",
                                                        hasHeroes
                                                            ? "border-[#FFD700]/30 text-[#FFD700]/50 hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/5 bg-black/20"
                                                            : "border-gray-700 text-gray-700 cursor-not-allowed bg-black/20"
                                                    )}
                                                >
                                                    <Plus className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>

                                        {!hasHeroes && (
                                            <div className="flex items-center gap-2 mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-400 text-sm">
                                                <ShieldAlert className="w-4 h-4 text-gray-500" />
                                                Add Heroes to the team first to configure the skill rotation.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Video URL */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                            <Video className="w-4 h-4 text-purple-400" />
                                            Video URL
                                        </label>
                                        <input
                                            type="url"
                                            value={team.video_url || ''}
                                            onChange={(e) => handleUpdateTeam(idx, 'video_url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                            Note / Strategy
                                        </label>
                                        <textarea
                                            value={team.note || ''}
                                            onChange={(e) => handleUpdateTeam(idx, 'note', e.target.value)}
                                            placeholder="Optional notes or strategy for this team..."
                                            rows={2}
                                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            )}
                            </div>
                        </SortableItem>
                    )
                })}
                </SortableContext>
            </div>
            </DndContext>

            <SkillPickerModal />
        </div>
    )
}
