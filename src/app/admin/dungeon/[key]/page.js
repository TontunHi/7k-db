'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Landmark, Zap, X, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getDungeonInfo, 
    getSetsByDungeon, 
    createSet, 
    updateSet, 
    deleteSet 
} from '@/lib/dungeon-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

// Helper to get hero skill image path
function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace(/\.[^/.]+$/, '')
    return `/skills/${folderName}/${skillNumber}.webp`
}

export default function DungeonDetailPage({ params }) {
    const router = useRouter()
    const { key: dungeonKey } = use(params)

    const [dungeon, setDungeon] = useState(null)
    const [sets, setSets] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillsMap, setSkillsMap] = useState({})
    // Skill picker state: { setIdx, slotIdx } or null
    const [skillPicker, setSkillPicker] = useState(null)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [dungeonInfo, setsData, heroesData, petsData, formationsData, skillsData] = await Promise.all([
                getDungeonInfo(dungeonKey),
                getSetsByDungeon(dungeonKey),
                getAllHeroes(),
                getPets(),
                getFormations(),
                getHeroSkillsMap()
            ])
            setDungeon(dungeonInfo)
            setSets(setsData.map(s => ({ ...s, _dirty: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
            setSkillsMap(skillsData)
            setLoading(false)
        }
        loadData()
    }, [dungeonKey])

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            dungeon_key: dungeonKey,
            set_index: sets.length + 1,
            formation: formations[0]?.value || '2-3',
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
        if (!set._isNew) {
            await deleteSet(set.id)
        }
        setSets(sets.filter((_, i) => i !== index))
    }

    const handleSaveAll = async () => {
        setSaving(true)
        for (const set of sets) {
            if (!set._dirty) continue
            
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
        
        // Reload data
        const setsData = await getSetsByDungeon(dungeonKey)
        setSets(setsData.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

    // --- Skill Slot Handlers ---
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

    if (!dungeon) {
        return <div className="text-center py-20 text-gray-500">Dungeon not found</div>
    }

    const hasDirty = sets.some(s => s._dirty)

    return (
        <div className="space-y-8 pb-20">
             {/* Header Section */}
             <div className="space-y-6">
                <Link 
                    href="/admin/dungeon" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors w-fit"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dungeons</span>
                </Link>

                <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 group">
                    <NextImage 
                        src={dungeon.image} 
                        alt={dungeon.name} 
                        fill 
                        className="object-contain transition-transform duration-700 group-hover:scale-105" 
                        priority
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-2">
                            <Landmark className="w-6 h-6 text-[#FFD700]" />
                            <span className="text-sm text-[#FFD700] uppercase tracking-wider font-bold">Dungeon</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white">{dungeon.name}</h2>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl sticky top-4 z-10 backdrop-blur-md">
                <h1 className="hidden md:block text-2xl font-black text-white">Team Management</h1>
                <div className="flex items-center gap-3 ml-auto">
                    <button
                        onClick={handleAddSet}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-gray-700 transition-all border border-gray-700"
                    >
                        <Plus className="w-5 h-5" />
                        Add Team
                    </button>
                    
                    <button
                        onClick={handleSaveAll}
                        disabled={!hasDirty || saving}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all",
                            hasDirty 
                                ? "bg-[#FFD700] text-black hover:bg-[#FFE55C]" 
                                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                        )}
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save All
                    </button>
                </div>
            </div>

            {/* Teams List */}
            <div className="space-y-6">
                {sets.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl bg-gray-900/30">
                        <Landmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">No teams configured yet.</p>
                        <p className="text-gray-600 text-sm mt-1">Click &quot;Add Team&quot; to create your first team.</p>
                    </div>
                )}

                {sets.map((set, idx) => (
                    <div 
                        key={set.id} 
                        className={cn(
                            "bg-gray-900/50 border rounded-xl overflow-hidden",
                            set._dirty ? "border-[#FFD700]/50" : "border-gray-800"
                        )}
                    >
                        {/* Team Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] font-black">
                                    {idx + 1}
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Team {idx + 1}
                                </h3>
                                {set._dirty && <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold rounded">Unsaved</span>}
                            </div>
                            <button
                                onClick={() => handleDeleteSet(idx)}
                                className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-6">
                            {/* Team Builder */}
                            <TeamBuilder
                                team={{
                                    index: idx + 1,
                                    formation: set.formation,
                                    pet_file: set.pet_file,
                                    aura: set.aura,
                                    heroes: set.heroes
                                }}
                                index={idx}
                                heroesList={heroes}
                                petsList={pets}
                                formations={formations}
                                onUpdate={(teamData) => handleTeamUpdate(idx, teamData)}
                                onRemove={null}
                            />

                            {/* Skill Rotation */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <Zap className="w-4 h-4 text-[#FFD700]" />
                                    Skill Rotation
                                </label>

                                <div className="bg-black/40 rounded-xl border border-gray-800 p-4">
                                    <div className="flex flex-wrap items-end gap-1.5">
                                        {(set.skill_rotation || []).map((slot, slotIdx) => {
                                            const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                            const heroFile = set.heroes?.[hIdx]
                                            const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                            const errKey = `slot-${set.id}-${slotIdx}`
                                            const hasError = skillErrors[errKey]
                                            const hasHeroes = set.heroes?.some(h => h !== null)

                                            return (
                                                <div key={slotIdx} className="flex flex-col items-center group">
                                                    <input
                                                        type="text"
                                                        value={slot.label || ''}
                                                        onChange={(e) => handleUpdateSlotLabel(idx, slotIdx, e.target.value)}
                                                        placeholder="..."
                                                        className="w-14 text-center text-[10px] font-bold text-[#FFD700]/80 bg-transparent border-none outline-none placeholder-gray-600 mb-0.5 truncate"
                                                    />
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSkillPicker({ setIdx: idx, slotIdx })}
                                                            disabled={!hasHeroes}
                                                            className={cn(
                                                                "w-12 h-12 rounded-md overflow-hidden border-2 flex items-center justify-center transition-all",
                                                                slot.skill 
                                                                    ? "border-[#FFD700]/50 bg-gray-900 hover:border-[#FFD700]" 
                                                                    : "border-gray-700 border-dashed bg-gray-900/30 hover:border-gray-500",
                                                                !hasHeroes && "cursor-not-allowed opacity-40"
                                                            )}
                                                        >
                                                            {slot.skill && heroFile && skillPath && !hasError ? (
                                                                <SafeImage
                                                                    src={skillPath}
                                                                    alt=""
                                                                    fill
                                                                    className="object-cover"
                                                                    onError={() => handleSkillError(errKey)}
                                                                />
                                                            ) : (
                                                                <Plus className="w-4 h-4 text-gray-600" />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteSlot(idx, slotIdx) }}
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center text-[8px] hidden group-hover:flex shadow"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        <button
                                            type="button"
                                            onClick={() => handleAddSlot(idx)}
                                            disabled={!set.heroes?.some(h => h !== null)}
                                            className={cn(
                                                "w-12 h-12 rounded-md border-2 border-dashed flex items-center justify-center transition-all",
                                                set.heroes?.some(h => h !== null)
                                                    ? "border-[#FFD700]/30 text-[#FFD700]/50 hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/5"
                                                    : "border-gray-700 text-gray-700 cursor-not-allowed"
                                            )}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Video URL */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <Video className="w-4 h-4" />
                                    Video URL
                                </label>
                                <input
                                    type="url"
                                    value={set.video_url || ''}
                                    onChange={(e) => handleUpdateSet(idx, 'video_url', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                                />
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Note
                                </label>
                                <textarea
                                    value={set.note || ''}
                                    onChange={(e) => handleUpdateSet(idx, 'note', e.target.value)}
                                    placeholder="Optional notes for this team..."
                                    rows={2}
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700] transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Skill Picker Modal */}
            {skillPicker && (
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
                            {(sets[skillPicker.setIdx]?.heroes || []).map((heroFile, heroIdx) => {
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
                                        <div className="flex gap-2 ml-10 flex-wrap">
                                            {(skillsMap?.[heroFile.replace(/\.[^/.]+$/, "")] || [4, 3, 2, 1]).map(skillName => {
                                                const skillKey = `${heroIdx}-${skillName}`
                                                const skillPath = getSkillImagePath(heroFile, skillName)
                                                const errKey = `pick-${heroIdx}-${skillName}`
                                                const hasError = skillErrors[errKey]

                                                return (
                                                    <button
                                                        key={skillName}
                                                        type="button"
                                                        onClick={() => handleSelectSkillForSlot(skillPicker.setIdx, skillPicker.slotIdx, skillKey)}
                                                        className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all bg-gray-900"
                                                    >
                                                        {skillPath && !hasError ? (
                                                            <SafeImage
                                                                src={skillPath}
                                                                alt={`Skill ${skillName}`}
                                                                fill
                                                                className="object-cover"
                                                                onError={() => handleSkillError(errKey)}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-600 text-xs flex items-center justify-center w-full h-full">S{skillName}</span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                            {!(sets[skillPicker.setIdx]?.heroes?.some(h => h)) && (
                                <p className="text-center text-gray-500 py-8">No heroes in team yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
