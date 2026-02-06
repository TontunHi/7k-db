'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getDungeonInfo, 
    getSetsByDungeon, 
    createSet, 
    updateSet, 
    deleteSet 
} from '@/lib/dungeon-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

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

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [dungeonInfo, setsData, heroesData, petsData, formationsData] = await Promise.all([
                getDungeonInfo(dungeonKey),
                getSetsByDungeon(dungeonKey),
                getAllHeroes(),
                getPets(),
                getFormations()
            ])
            setDungeon(dungeonInfo)
            setSets(setsData.map(s => ({ ...s, _dirty: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
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
                heroes: set.heroes,
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
                    <Image 
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
                                    heroes: set.heroes
                                }}
                                index={idx}
                                heroesList={heroes}
                                petsList={pets}
                                formations={formations}
                                onUpdate={(teamData) => handleTeamUpdate(idx, teamData)}
                                onRemove={null}
                            />

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
        </div>
    )
}
