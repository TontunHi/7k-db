'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Skull, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getRaidInfo, 
    getSetsByRaid, 
    createSet, 
    updateSet, 
    deleteSet 
} from '@/lib/raid-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

// Helper to get hero skill image path
function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace(/\.[^/.]+$/, '')
    return `/skills/${folderName}/${skillNumber}.webp`
}

export default function RaidDetailPage({ params }) {
    const router = useRouter()
    const { key: raidKey } = use(params)

    const [raid, setRaid] = useState(null)
    const [sets, setSets] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({}) // Track missing skill images

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [raidInfo, setsData, heroesData, petsData, formationsData] = await Promise.all([
                getRaidInfo(raidKey),
                getSetsByRaid(raidKey),
                getAllHeroes(),
                getPets(),
                getFormations()
            ])
            setRaid(raidInfo)
            setSets(setsData.map(s => ({ ...s, _dirty: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
            setLoading(false)
        }
        loadData()
    }, [raidKey])

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            raid_key: raidKey,
            set_index: sets.length + 1,
            formation: formations[0]?.value || '2-3',
            pet_file: '',
            heroes: [null, null, null, null, null],
            skill_rotation: [],
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
                raid_key: raidKey,
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
        
        // Reload data
        const setsData = await getSetsByRaid(raidKey)
        setSets(setsData.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

    // Handle skill image error
    const handleSkillError = (setId, heroIdx, skillNum) => {
        setSkillErrors(prev => ({
            ...prev,
            [`${setId}-${heroIdx}-${skillNum}`]: true
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        )
    }

    if (!raid) {
        return <div className="text-center py-20 text-gray-500">Raid not found</div>
    }

    const hasDirty = sets.some(s => s._dirty)

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="space-y-6">
                <Link 
                    href="/admin/raid" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors w-fit"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Raids</span>
                </Link>

                <div className="relative w-full max-w-2xl h-48 md:h-64 rounded-2xl overflow-hidden border border-red-900/30 bg-gray-900 group">
                    <SafeImage 
                        src={raid.image} 
                        alt={raid.name} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                        priority
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-1">
                            <Skull className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-500 uppercase tracking-wider font-bold">Raid</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white">{raid.name}</h2>
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
                                ? "bg-red-600 text-white hover:bg-red-500" 
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
                        <Skull className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">No teams configured yet.</p>
                        <p className="text-gray-600 text-sm mt-1">Click &quot;Add Team&quot; to create your first team.</p>
                    </div>
                )}

                {sets.map((set, idx) => (
                    <div 
                        key={set.id} 
                        className={cn(
                            "bg-gray-900/50 border rounded-xl overflow-hidden",
                            set._dirty ? "border-red-500/50" : "border-gray-800"
                        )}
                    >
                        {/* Team Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-black">
                                    {idx + 1}
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Team {idx + 1}
                                </h3>
                                {set._dirty && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">Unsaved</span>}
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
                                    heroes: set.heroes
                                }}
                                index={idx}
                                heroesList={heroes}
                                petsList={pets}
                                formations={formations}
                                onUpdate={(teamData) => handleTeamUpdate(idx, teamData)}
                                onRemove={null}
                            />

                            {/* Skill Rotation Grid */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    Skill Rotation (Click to set order)
                                </label>
                                
                                <div className="bg-black/50 rounded-xl p-4 border border-gray-800">
                                    <div className="flex gap-4">
                                        {[0, 1, 2, 3, 4].map(heroIdx => {
                                            const heroFile = set.heroes?.[heroIdx]
                                            
                                            return (
                                                <div key={heroIdx} className="space-y-2">
                                                    {/* Skill 2 */}
                                                    {(() => {
                                                        const skillKey = `${heroIdx}-2`
                                                        const skillPath = getSkillImagePath(heroFile, 2)
                                                        const hasError = skillErrors[`${set.id}-${heroIdx}-2`]
                                                        const orderIndex = (set.skill_rotation || []).indexOf(skillKey)
                                                        const order = orderIndex >= 0 ? orderIndex + 1 : null
                                                        
                                                        return (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const rotation = [...(set.skill_rotation || [])]
                                                                    const existingIdx = rotation.indexOf(skillKey)
                                                                    if (existingIdx >= 0) {
                                                                        rotation.splice(existingIdx, 1)
                                                                    } else {
                                                                        rotation.push(skillKey)
                                                                    }
                                                                    handleUpdateSet(idx, 'skill_rotation', rotation)
                                                                }}
                                                                className={cn(
                                                                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center transition-all",
                                                                    order ? "border-yellow-500 ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20" : "border-gray-700 hover:border-gray-500",
                                                                    heroFile && skillPath && !hasError ? "bg-gray-900" : "bg-gray-900/30"
                                                                )}
                                                            >
                                                                {heroFile && skillPath && !hasError ? (
                                                                    <SafeImage
                                                                        src={skillPath}
                                                                        alt="Skill 2"
                                                                        fill
                                                                        className="object-contain p-1"
                                                                        onError={() => handleSkillError(set.id, heroIdx, 2)}
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-700 text-sm">-</span>
                                                                )}
                                                                {order && (
                                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 text-black text-sm font-black rounded-full flex items-center justify-center shadow-lg">
                                                                        {order}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    })()}
                                                    
                                                    {/* Skill 3 */}
                                                    {(() => {
                                                        const skillKey = `${heroIdx}-3`
                                                        const skillPath = getSkillImagePath(heroFile, 3)
                                                        const hasError = skillErrors[`${set.id}-${heroIdx}-3`]
                                                        const orderIndex = (set.skill_rotation || []).indexOf(skillKey)
                                                        const order = orderIndex >= 0 ? orderIndex + 1 : null
                                                        
                                                        return (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const rotation = [...(set.skill_rotation || [])]
                                                                    const existingIdx = rotation.indexOf(skillKey)
                                                                    if (existingIdx >= 0) {
                                                                        rotation.splice(existingIdx, 1)
                                                                    } else {
                                                                        rotation.push(skillKey)
                                                                    }
                                                                    handleUpdateSet(idx, 'skill_rotation', rotation)
                                                                }}
                                                                className={cn(
                                                                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center transition-all",
                                                                    order ? "border-yellow-500 ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20" : "border-gray-700 hover:border-gray-500",
                                                                    heroFile && skillPath && !hasError ? "bg-gray-900" : "bg-gray-900/30"
                                                                )}
                                                            >
                                                                {heroFile && skillPath && !hasError ? (
                                                                    <SafeImage
                                                                        src={skillPath}
                                                                        alt="Skill 3"
                                                                        fill
                                                                        className="object-contain p-1"
                                                                        onError={() => handleSkillError(set.id, heroIdx, 3)}
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-700 text-sm">-</span>
                                                                )}
                                                                {order && (
                                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 text-black text-sm font-black rounded-full flex items-center justify-center shadow-lg">
                                                                        {order}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    })()}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    
                                    {/* Clear rotation button */}
                                    {(set.skill_rotation?.length > 0) && (
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateSet(idx, 'skill_rotation', [])}
                                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 rounded-lg text-sm font-bold transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Clear Rotation
                                        </button>
                                    )}
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
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
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
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
