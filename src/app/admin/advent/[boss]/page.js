'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Compass, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getBossInfo, 
    getSetsByBoss, 
    createSet, 
    updateSet, 
    deleteSet 
} from '@/lib/advent-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace('.png', '')
    return `/skills/${folderName}/${skillNumber}.png`
}

// Sub-Team Skill Rotation component
function SkillSlotRow({ heroes, rotation, onAddSlot, onUpdateLabel, onSelectSkill, onDeleteSlot, onOpenPicker, skillErrors, setId, teamNum }) {
    const hasHeroes = heroes?.some(h => h !== null)
    
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-violet-400" />
                    Skill Rotation
                </label>
            </div>
            <div className="bg-black/40 rounded-xl border border-gray-800 p-4">
                <div className="flex flex-wrap items-end gap-1.5">
                    {rotation.map((slot, slotIdx) => {
                        const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                        const heroFile = heroes?.[hIdx]
                        const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                        const errKey = `slot-${setId}-t${teamNum}-${slotIdx}`
                        const hasError = skillErrors[errKey]

                        return (
                            <div key={slotIdx} className="flex flex-col items-center group">
                                <input
                                    type="text"
                                    value={slot.label || ''}
                                    onChange={(e) => onUpdateLabel(slotIdx, e.target.value)}
                                    placeholder="..."
                                    className="w-14 text-center text-[10px] font-bold text-violet-400/80 bg-transparent border-none outline-none placeholder-gray-600 mb-0.5 truncate"
                                />
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => onOpenPicker(slotIdx)}
                                        disabled={!hasHeroes}
                                        className={cn(
                                            "w-12 h-12 rounded-md overflow-hidden border-2 flex items-center justify-center transition-all",
                                            slot.skill
                                                ? "border-violet-500/50 bg-gray-900 hover:border-violet-400"
                                                : "border-gray-700 border-dashed bg-gray-900/30 hover:border-gray-500",
                                            !hasHeroes && "cursor-not-allowed opacity-40"
                                        )}
                                    >
                                        {slot.skill && heroFile && skillPath && !hasError ? (
                                            <Image src={skillPath} alt="" fill className="object-contain p-0.5" onError={() => {}} />
                                        ) : (
                                            <Plus className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onDeleteSlot(slotIdx) }}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center text-[8px] hidden group-hover:flex shadow"
                                    >✕</button>
                                </div>
                            </div>
                        )
                    })}
                    <div className="flex flex-col items-center">
                        <div className="h-[14px]" />
                        <button
                            type="button"
                            onClick={onAddSlot}
                            disabled={!hasHeroes}
                            className={cn(
                                "w-12 h-12 rounded-md border-2 border-dashed flex items-center justify-center transition-all",
                                hasHeroes
                                    ? "border-violet-500/30 text-violet-400/50 hover:border-violet-400 hover:text-violet-400 hover:bg-violet-500/5"
                                    : "border-gray-700 text-gray-700 cursor-not-allowed"
                            )}
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {!hasHeroes && (
                    <p className="text-gray-600 text-xs mt-2">ใส่ Heroes ในทีมก่อนเพื่อเลือก Skills</p>
                )}
            </div>
        </div>
    )
}

export default function AdventBossDetailPage({ params }) {
    const router = useRouter()
    const { boss: bossKey } = use(params)

    const [boss, setBoss] = useState(null)
    const [sets, setSets] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null) // { setIdx, teamNum (1|2), slotIdx }

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
            team1_formation: formations[0]?.value || '2-3',
            team1_pet_file: '',
            team1_heroes: [null, null, null, null, null],
            team1_skill_rotation: [],
            team2_formation: formations[0]?.value || '2-3',
            team2_pet_file: '',
            team2_heroes: [null, null, null, null, null],
            team2_skill_rotation: [],
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

    const handleTeamUpdate = (setIdx, teamNum, teamData) => {
        const updated = [...sets]
        const prefix = `team${teamNum}_`
        updated[setIdx] = { 
            ...updated[setIdx], 
            [`${prefix}formation`]: teamData.formation,
            [`${prefix}pet_file`]: teamData.pet_file,
            [`${prefix}heroes`]: teamData.heroes,
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
                team1_formation: set.team1_formation,
                team1_pet_file: set.team1_pet_file,
                team1_heroes: set.team1_heroes,
                team1_skill_rotation: set.team1_skill_rotation,
                team2_formation: set.team2_formation,
                team2_pet_file: set.team2_pet_file,
                team2_heroes: set.team2_heroes,
                team2_skill_rotation: set.team2_skill_rotation,
                video_url: set.video_url,
                note: set.note
            }

            if (set._isNew) {
                await createSet(data)
            } else {
                await updateSet(set.id, data)
            }
        }

        const setsData = await getSetsByBoss(bossKey)
        setSets(setsData.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

    // Skill Slot handlers
    const handleAddSlot = (setIdx, teamNum) => {
        const key = `team${teamNum}_skill_rotation`
        const updated = [...sets]
        const rotation = [...(updated[setIdx][key] || [])]
        rotation.push({ label: '', skill: null })
        updated[setIdx] = { ...updated[setIdx], [key]: rotation, _dirty: true }
        setSets(updated)
    }

    const handleUpdateSlotLabel = (setIdx, teamNum, slotIdx, label) => {
        const key = `team${teamNum}_skill_rotation`
        const updated = [...sets]
        const rotation = [...(updated[setIdx][key] || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], label }
        updated[setIdx] = { ...updated[setIdx], [key]: rotation, _dirty: true }
        setSets(updated)
    }

    const handleSelectSkillForSlot = (setIdx, teamNum, slotIdx, skillKey) => {
        const key = `team${teamNum}_skill_rotation`
        const updated = [...sets]
        const rotation = [...(updated[setIdx][key] || [])]
        rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
        updated[setIdx] = { ...updated[setIdx], [key]: rotation, _dirty: true }
        setSets(updated)
        setSkillPicker(null)
    }

    const handleDeleteSlot = (setIdx, teamNum, slotIdx) => {
        const key = `team${teamNum}_skill_rotation`
        const updated = [...sets]
        const rotation = [...(updated[setIdx][key] || [])]
        rotation.splice(slotIdx, 1)
        updated[setIdx] = { ...updated[setIdx], [key]: rotation, _dirty: true }
        setSets(updated)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
        )
    }

    if (!boss) {
        return <div className="text-center py-20 text-gray-500">Boss not found</div>
    }

    const hasDirty = sets.some(s => s._dirty)

    // Skill Picker Modal
    const SkillPickerModal = () => {
        if (!skillPicker) return null
        const { setIdx, teamNum, slotIdx } = skillPicker
        const set = sets[setIdx]
        const teamHeroes = set[`team${teamNum}_heroes`] || []

        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <div>
                            <h3 className="text-xl font-black text-white">เลือกสกิล</h3>
                            <p className="text-sm text-gray-400 mt-1">เลือกสกิลจาก Hero ใน Team {teamNum}</p>
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
                                            <Image src={`/heroes/${heroFile}`} alt={heroName} fill className="object-cover" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 capitalize">{heroName}</span>
                                    </div>
                                    <div className="flex gap-2 ml-10">
                                        {[1, 2, 3, 4].map(skillNum => {
                                            const skillKey = `${heroIdx}-${skillNum}`
                                            const skillPath = getSkillImagePath(heroFile, skillNum)

                                            return (
                                                <button
                                                    key={skillNum}
                                                    type="button"
                                                    onClick={() => handleSelectSkillForSlot(setIdx, teamNum, slotIdx, skillKey)}
                                                    className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all bg-gray-900"
                                                >
                                                    {skillPath ? (
                                                        <Image src={skillPath} alt={`Skill ${skillNum}`} fill className="object-contain p-0.5" />
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
                            <p className="text-center text-gray-500 py-8">ยังไม่มี Hero ในทีม</p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex gap-6 pb-20">
            {/* Left Sidebar - Boss Image */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8 space-y-4">
                    <Link 
                        href="/admin/advent" 
                        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-violet-400 hover:bg-gray-800/50 rounded-lg transition-colors w-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Bosses</span>
                    </Link>

                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black">
                        {boss.image && !boss.image.includes('undefined') ? (
                            <Image src={boss.image} alt={boss.name} fill className="object-contain object-center" priority />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Compass className="w-16 h-16 text-gray-700" />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-12">
                            <div className="flex items-center gap-2 mb-2">
                                <Compass className="w-5 h-5 text-violet-400" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Advent Expedition</span>
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
                    <Link href="/admin/advent" className="p-2 hover:bg-gray-800 rounded-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-3">
                        {boss.image && !boss.image.includes('undefined') && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-800">
                                <Image src={boss.image} alt={boss.name} fill className="object-cover" />
                            </div>
                        )}
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
                            Add Set
                        </button>
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasDirty || saving}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all",
                                hasDirty 
                                    ? "bg-violet-500 text-white hover:bg-violet-400" 
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                            )}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save All
                        </button>
                    </div>
                </div>

                {/* Sets List */}
                <div className="space-y-6">
                    {sets.length === 0 && (
                        <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl bg-gray-900/30">
                            <Compass className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500">No sets configured yet.</p>
                            <p className="text-gray-600 text-sm mt-1">Click &quot;Add Set&quot; to create your first set.</p>
                        </div>
                    )}

                    {sets.map((set, idx) => (
                        <div 
                            key={set.id} 
                            className={cn(
                                "bg-gray-900/50 border rounded-xl overflow-hidden",
                                set._dirty ? "border-violet-500/50" : "border-gray-800"
                            )}
                        >
                            {/* Set Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-black">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Set {idx + 1}</h3>
                                    {set._dirty && <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-bold rounded">Unsaved</span>}
                                </div>
                                <button
                                    onClick={() => handleDeleteSet(idx)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-6">
                                {/* Sub-Team 1 */}
                                {[1, 2].map(teamNum => {
                                    const teamHeroes = set[`team${teamNum}_heroes`] || [null, null, null, null, null]
                                    const teamRotation = set[`team${teamNum}_skill_rotation`] || []

                                    return (
                                        <div key={teamNum} className="space-y-4">
                                            <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-md flex items-center justify-center text-xs font-black",
                                                    teamNum === 1 ? "bg-sky-500/20 text-sky-400" : "bg-rose-500/20 text-rose-400"
                                                )}>
                                                    {teamNum}
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-bold uppercase tracking-wider",
                                                    teamNum === 1 ? "text-sky-400" : "text-rose-400"
                                                )}>
                                                    Team {teamNum}
                                                </span>
                                            </div>

                                            <TeamBuilder
                                                team={{
                                                    index: teamNum,
                                                    formation: set[`team${teamNum}_formation`],
                                                    pet_file: set[`team${teamNum}_pet_file`],
                                                    heroes: teamHeroes
                                                }}
                                                index={`${idx}-t${teamNum}`}
                                                heroesList={heroes}
                                                petsList={pets}
                                                formations={formations}
                                                onUpdate={(teamData) => handleTeamUpdate(idx, teamNum, teamData)}
                                                onRemove={null}
                                            />

                                            <SkillSlotRow
                                                heroes={teamHeroes}
                                                rotation={teamRotation}
                                                onAddSlot={() => handleAddSlot(idx, teamNum)}
                                                onUpdateLabel={(slotIdx, label) => handleUpdateSlotLabel(idx, teamNum, slotIdx, label)}
                                                onSelectSkill={(slotIdx, skillKey) => handleSelectSkillForSlot(idx, teamNum, slotIdx, skillKey)}
                                                onDeleteSlot={(slotIdx) => handleDeleteSlot(idx, teamNum, slotIdx)}
                                                onOpenPicker={(slotIdx) => setSkillPicker({ setIdx: idx, teamNum, slotIdx })}
                                                skillErrors={skillErrors}
                                                setId={set.id}
                                                teamNum={teamNum}
                                            />
                                        </div>
                                    )
                                })}

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
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-400 transition-colors"
                                    />
                                </div>

                                {/* Note */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Note</label>
                                    <textarea
                                        value={set.note || ''}
                                        onChange={(e) => handleUpdateSet(idx, 'note', e.target.value)}
                                        placeholder="Optional notes..."
                                        rows={2}
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-400 transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <SkillPickerModal />
        </div>
    )
}
