'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Compass, Zap, X, ChevronDown, ChevronUp } from 'lucide-react'
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
    const folderName = heroFilename.replace(/\.[^/.]+$/, '')
    return `/skills/${folderName}/${skillNumber}.webp`
}

function SkillSlotRow({ heroes, rotation, onAddSlot, onUpdateLabel, onSelectSkill, onDeleteSlot, onOpenPicker, skillErrors, setId }) {
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
                        const errKey = `slot-${setId}-${slotIdx}`
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
                                            <SafeImage src={skillPath} alt="" fill className="object-contain p-0.5" onError={() => {}} />
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
                    <p className="text-gray-600 text-xs mt-2">Add heroes to the team first to select skills</p>
                )}
            </div>
        </div>
    )
}

const SkillPickerModal = ({ skillPicker, sets, teamHeroes, heroes, onSelectSkill, onClose }) => {
    if (!skillPicker) return null
    const { setIdx, slotIdx } = skillPicker

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div>
                        <h3 className="text-xl font-black text-white">Select Skill</h3>
                        <p className="text-sm text-gray-400 mt-1">Choose a skill for the Team</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
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

                                        return (
                                            <button
                                                key={skillNum}
                                                type="button"
                                                onClick={() => onSelectSkill(setIdx, slotIdx, skillKey)}
                                                className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all bg-gray-900"
                                            >
                                                {skillPath ? (
                                                    <SafeImage src={skillPath} alt={`Skill ${skillNum}`} fill className="object-contain p-0.5" />
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
    const [skillPicker, setSkillPicker] = useState(null)
    const [expandedSets, setExpandedSets] = useState({})

    const toggleSetExpand = (idx) => {
        setExpandedSets(prev => ({
            ...prev,
            [idx]: prev[idx] === false ? true : false
        }))
    }

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
            phase: 'Phase 1',
            set_index: sets.length + 1,
            team_name: '',
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

    const handleTeamUpdate = (setIdx, teamData) => {
        const updated = [...sets]
        updated[setIdx] = { 
            ...updated[setIdx], 
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
                phase: set.phase,
                team_name: set.team_name,
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

        const setsData = await getSetsByBoss(bossKey)
        setSets(setsData.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

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

    return (
        <div className="flex gap-6 pb-20">
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
                            <NextImage src={boss.image} alt={boss.name} fill className="object-contain object-center" priority />
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

            <div className="flex-1 space-y-6">
                <div className="lg:hidden flex items-center gap-4 mb-4">
                    <Link href="/admin/advent" className="p-2 hover:bg-gray-800 rounded-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-3">
                        {boss.image && !boss.image.includes('undefined') && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-800">
                                <NextImage src={boss.image} alt={boss.name} fill className="object-cover" />
                            </div>
                        )}
                        <h1 className="text-2xl font-black">{boss.name}</h1>
                    </div>
                </div>

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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/50 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-black">
                                        {idx + 1}
                                    </div>
                                    <select
                                        value={set.phase || 'Phase 1'}
                                        onChange={(e) => handleUpdateSet(idx, 'phase', e.target.value)}
                                        className="bg-black border border-gray-800 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-violet-500"
                                    >
                                        <option value="Phase 1">Phase 1</option>
                                        <option value="Phase 2">Phase 2</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={set.team_name || ''}
                                        onChange={(e) => handleUpdateSet(idx, 'team_name', e.target.value)}
                                        placeholder={`Name (Optional)`}
                                        className="text-lg font-bold bg-transparent border-none outline-none text-white focus:ring-0 p-0 placeholder-gray-500 max-w-[150px]"
                                    />
                                    {set._dirty && <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-bold rounded">Unsaved</span>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => toggleSetExpand(idx)}
                                        className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg shrink-0"
                                    >
                                        {expandedSets[idx] === false ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSet(idx)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg shrink-0"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className={cn("p-5 space-y-6 transition-all", expandedSets[idx] === false && "hidden")}>
                                <TeamBuilder
                                    team={{
                                        index: 1,
                                        formation: set.formation,
                                        pet_file: set.pet_file,
                                        heroes: set.heroes || [null, null, null, null, null]
                                    }}
                                    index={idx}
                                    heroesList={heroes}
                                    petsList={pets}
                                    formations={formations}
                                    onUpdate={(teamData) => handleTeamUpdate(idx, teamData)}
                                    onRemove={null}
                                />

                                <SkillSlotRow
                                    heroes={set.heroes || [null, null, null, null, null]}
                                    rotation={set.skill_rotation || []}
                                    onAddSlot={() => handleAddSlot(idx)}
                                    onUpdateLabel={(slotIdx, label) => handleUpdateSlotLabel(idx, slotIdx, label)}
                                    onSelectSkill={(slotIdx, skillKey) => handleSelectSkillForSlot(idx, slotIdx, skillKey)}
                                    onDeleteSlot={(slotIdx) => handleDeleteSlot(idx, slotIdx)}
                                    onOpenPicker={(slotIdx) => setSkillPicker({ setIdx: idx, slotIdx })}
                                    skillErrors={skillErrors}
                                    setId={set.id}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Note</label>
                                    <textarea
                                        value={set.note || ''}
                                        onChange={(e) => handleUpdateSet(idx, 'note', e.target.value)}
                                        placeholder="Optional notes or strategy..."
                                        rows={3}
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-400 transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <SkillPickerModal 
                skillPicker={skillPicker}
                sets={sets}
                teamHeroes={skillPicker ? sets[skillPicker.setIdx].heroes : []}
                heroes={heroes}
                onSelectSkill={handleSelectSkillForSlot}
                onClose={() => setSkillPicker(null)}
            />
        </div>
    )
}
