'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getBossInfo, 
    getSetsByBoss, 
    createSet, 
    updateSet, 
    deleteSet 
} from '@/lib/castle-rush-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

export default function BossDetailPage({ params }) {
    const router = useRouter()
    const { boss: bossKey } = use(params)

    const [boss, setBoss] = useState(null)
    const [sets, setSets] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [bossInfo, setsData, heroesData, petsData, formationsData] = await Promise.all([
                getBossInfo(bossKey),
                getSetsByBoss(bossKey),
                getAllHeroes(),
                getPets(),
                getFormations()
            ])
            setBoss(bossInfo)
            setSets(setsData.map(s => ({ ...s, _dirty: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
            setLoading(false)
        }
        loadData()
    }, [bossKey])

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            boss_key: bossKey,
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
                boss_key: bossKey,
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
        const setsData = await getSetsByBoss(bossKey)
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

    if (!boss) {
        return <div className="text-center py-20 text-gray-500">Boss not found</div>
    }

    const hasDirty = sets.some(s => s._dirty)

    return (
        <div className="flex gap-6 pb-20">
            {/* Left Sidebar - Boss Image */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8 space-y-4">
                    {/* Back Button */}
                    <Link 
                        href="/admin/castle-rush" 
                        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors w-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Bosses</span>
                    </Link>

                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black">
                        <Image 
                            src={boss.image} 
                            alt={boss.name} 
                            fill 
                            className="object-contain object-center" 
                            priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-12">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="w-5 h-5 text-[#FFD700]" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Castle Rush</span>
                            </div>
                            <h2 className="text-2xl font-black text-white">{boss.name}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center gap-4 mb-4">
                    <Link href="/admin/castle-rush" className="p-2 hover:bg-gray-800 rounded-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-800">
                            <Image src={boss.image} alt={boss.name} fill className="object-cover" />
                        </div>
                        <h1 className="text-2xl font-black">{boss.name}</h1>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                    <h1 className="hidden lg:block text-2xl font-black text-white">Team Management</h1>
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
                            <Crown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
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
        </div>
    )
}
