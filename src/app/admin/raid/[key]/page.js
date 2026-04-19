'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Skull, Zap, Pencil, ScrollText, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getRaidInfo, 
    getSetsByRaid, 
    createSet, 
    updateSet, 
    deleteSet,
    getRaids
} from '@/lib/raid-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
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
    const [allRaids, setAllRaids] = useState([])
    const [skillErrors, setSkillErrors] = useState({})
    const [skillsMap, setSkillsMap] = useState({})
    const [collapsedSets, setCollapsedSets] = useState(new Set())

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [raidInfo, setsData, heroesData, petsData, formationsData, allRaidsData, skillsData] = await Promise.all([
                getRaidInfo(raidKey),
                getSetsByRaid(raidKey),
                getAllHeroes(),
                getPets(),
                getFormations(),
                getRaids(),
                getHeroSkillsMap()
            ])
            setRaid(raidInfo)
            setAllRaids(allRaidsData)
            setSets(setsData.map(s => ({ ...s, _dirty: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
            setSkillsMap(skillsData)
            setLoading(false)
        }
        loadData()
    }, [raidKey])

    const handleAddSet = () => {
        const newSet = {
            id: `new-${Date.now()}`,
            raid_key: raidKey,
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
                team_name: set.team_name,
                formation: set.formation,
                pet_file: set.pet_file,
                heroes: set.heroes,
                skill_rotation: set.skill_rotation,
                video_url: set.video_url,
                note: set.note
            }

            let result
            if (set._isNew) {
                result = await createSet(data)
            } else {
                result = await updateSet(set.id, data)
            }

            if (result && !result.success) {
                alert(`Error saving team ${set.team_name || idx + 1}: ${result.error}`)
                setSaving(false)
                return
            }
        }
        
        const setsData = await getSetsByRaid(raidKey)
        setSets(setsData.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

    // --- Grid-based Skill Rotation Handler (Reverted to Original Style) ---
    const handleToggleSkillRotation = (setIdx, skillKey) => {
        const updated = [...sets]
        let rotation = [...(updated[setIdx].skill_rotation || [])]
        
        const existingIdx = rotation.indexOf(skillKey)
        if (existingIdx >= 0) {
            // Remove if already exists
            rotation = rotation.filter(k => k !== skillKey)
        } else {
            // Add to end if doesn't exist
            rotation.push(skillKey)
        }
        
        updated[setIdx] = { ...updated[setIdx], skill_rotation: rotation, _dirty: true }
        setSets(updated)
    }

    const handleSkillError = (key) => {
        setSkillErrors(prev => ({ ...prev, [key]: true }))
    }

    const toggleCollapse = (id) => {
        const next = new Set(collapsedSets)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setCollapsedSets(next)
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
        <div className="flex gap-6 pb-20">
            {/* Left Sidebar - Raid Image (Vertical) */}
            <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-8 space-y-4">
                    <Link 
                        href="/admin/raid" 
                        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-gray-800/50 rounded-lg transition-colors w-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Raids</span>
                    </Link>

                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-800 bg-black/40 shadow-2xl group">
                        {/* Ambient Background */}
                        <SafeImage src={raid.image} alt="" fill className="object-cover opacity-20 blur-xl scale-125 transition-transform duration-1000 group-hover:scale-110" />
                        {/* Contain Image */}
                        <SafeImage src={raid.image} alt={raid.name} fill className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.03]" priority />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 font-bold tracking-tight z-30">
                            <div className="flex items-center gap-2 mb-1">
                                <Skull className="w-4 h-4 text-red-500" />
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Raid Boss</span>
                            </div>
                            <h2 className="text-xl font-black text-white">{raid.name}</h2>
                        </div>
                    </div>

                    {/* Raids List */}
                    <div className="mt-8 space-y-3 pt-6 border-t border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Browse Bosses</h3>
                        <div className="space-y-3 pr-2">
                            {allRaids.map((r) => (
                                <Link
                                    key={r.key}
                                    href={`/admin/raid/${r.key}`}
                                    className={cn(
                                        "group relative block w-full aspect-[2/3] rounded-lg overflow-hidden transition-all border bg-black/40",
                                        r.key === raid.key 
                                            ? "border-red-500 ring-1 ring-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                                            : "border-gray-800/80 hover:border-gray-500"
                                    )}
                                >
                                    <SafeImage src={r.image} alt="" fill className="object-cover opacity-10 blur-md group-hover:opacity-20 transition-opacity" />
                                    <SafeImage src={r.image} alt={r.name} fill className="object-contain relative z-10 p-1 group-hover:scale-105 transition-transform duration-500" />
                                    
                                    <div className="absolute inset-0 bg-black/40 z-20 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center p-2 text-center z-30">
                                        <h4 className={cn(
                                            "font-black tracking-widest uppercase text-[10px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]", 
                                            r.key === raid.key ? "text-red-500" : "text-white group-hover:text-red-500"
                                        )}>
                                            {r.name}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center gap-4 mb-4">
                    <Link href="/admin/raid" className="p-2 hover:bg-gray-800 rounded-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-gray-800 bg-black/40">
                            <NextImage src={raid.image} alt="" fill className="object-cover opacity-20 blur-sm" />
                            <NextImage src={raid.image} alt={raid.name} fill className="object-contain relative z-10" />
                        </div>
                        <h1 className="text-2xl font-black">{raid.name}</h1>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl sticky top-4 z-10 backdrop-blur-md shadow-lg">
                    <h1 className="hidden lg:block text-2xl font-black text-white">Team Management</h1>
                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            onClick={handleAddSet}
                            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-gray-700 transition-all border border-gray-700 shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Add Team
                        </button>
                        
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasDirty || saving}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-xl",
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
                        <div className="text-center py-16 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                            <Skull className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-wider">No teams configured yet.</p>
                            <p className="text-gray-600 text-sm mt-1">Click &quot;Add Team&quot; to begin strategy design.</p>
                        </div>
                    )}

                    {sets.map((set, idx) => {
                        const rotation = set.skill_rotation || []
                        const isCollapsed = collapsedSets.has(set.id)

                        return (
                            <div 
                                key={set.id} 
                                className={cn(
                                    "bg-gray-900/40 border rounded-2xl overflow-hidden transition-all duration-300",
                                    set._dirty ? "border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]" : "border-gray-800"
                                )}
                            >
                                {/* Team Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40">
                                    <div 
                                        className="flex items-center gap-4 cursor-pointer group/header flex-1"
                                        onClick={() => toggleCollapse(set.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-black text-lg group-hover/header:bg-red-500/20 transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Pencil className="w-4 h-4 text-gray-600" />
                                                <input
                                                    type="text"
                                                    value={set.team_name || ''}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateSet(idx, 'team_name', e.target.value);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    placeholder={`Team ${idx + 1}`}
                                                    className="bg-transparent border-none outline-none text-xl font-black text-white placeholder-gray-600 w-64 focus:ring-0"
                                                />
                                            </div>
                                            {set._dirty && <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-red-500/20">Unsaved</span>}
                                        </div>

                                        {/* Collapse Summary (Icons when minimized) */}
                                        {isCollapsed && (
                                            <div className="flex items-center gap-1.5 ml-8 animate-in fade-in slide-in-from-left-2 duration-300">
                                                {set.heroes.map((hero, hIdx) => hero && (
                                                    <div key={hIdx} className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-700">
                                                        <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                                    </div>
                                                ))}
                                                {set.pet_file && (
                                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-700/50 bg-gray-800/30 p-1 ml-2">
                                                        <SafeImage src={set.pet_file} alt="" fill className="object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleCollapse(set.id)}
                                            className="text-gray-500 hover:text-red-400 p-2 hover:bg-gray-800 rounded-xl transition-colors"
                                        >
                                            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSet(idx)}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {!isCollapsed && (
                                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
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

                                    {/* ===== Skill Rotation Grid (Original Style Restored) ===== */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
                                            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                                <Zap className="w-4 h-4 text-red-500" />
                                                Skill Rotation Grid
                                            </label>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase italic">Click icons to set sequence</span>
                                        </div>

                                        <div className="bg-black/40 rounded-2xl border border-gray-800 p-6">
                                            <div className="grid grid-cols-5 gap-4">
                                                {[0, 1, 2, 3, 4].map(heroIdx => {
                                                    const heroFile = set.heroes?.[heroIdx]
                                                    if (!heroFile) return <div key={heroIdx} className="space-y-4 flex flex-col items-center" />
                                                    
                                                    return (
                                                        <div key={heroIdx} className="space-y-4 flex flex-col items-center">
                                                            {(skillsMap?.[heroFile.replace(/\.[^/.]+$/, "")] || [4, 3, 2, 1]).map(skillName => {
                                                                const skillKey = `set-${set.id}-h${heroIdx}-s${skillName}`
                                                                const skillDataKey = `${heroIdx}-${skillName}`
                                                                const skillPath = getSkillImagePath(heroFile, skillName)
                                                                const orderIndex = rotation.indexOf(skillDataKey)
                                                                const order = orderIndex >= 0 ? orderIndex + 1 : null

                                                                if (!heroFile || (skillPath && skillErrors[skillKey])) {
                                                                    return null
                                                                }

                                                                return (
                                                                    <button
                                                                        key={skillName}
                                                                        type="button"
                                                                        onClick={() => handleToggleSkillRotation(idx, skillDataKey)}
                                                                        className={cn(
                                                                            "relative w-16 h-16 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all duration-300",
                                                                            order 
                                                                                ? "border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] bg-red-950/20" 
                                                                                : "border-gray-700/50 hover:border-gray-500",
                                                                            !heroFile && "opacity-20 cursor-not-allowed bg-gray-900"
                                                                        )}
                                                                    >
                                                                        {heroFile && skillPath && (
                                                                            <NextImage
                                                                                src={skillPath}
                                                                                alt={`Skill ${skillName}`}
                                                                                fill
                                                                                className={cn("object-contain p-1", order ? "opacity-100" : "opacity-60")}
                                                                                onError={() => handleSkillError(skillKey)}
                                                                            />
                                                                        )}
                                                                        {order && (
                                                                            <div className="absolute top-0 right-0 p-1">
                                                                                <div className="w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg transform translate-x-1 -translate-y-1">
                                                                                    {order}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video URL */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <Video className="w-4 h-4 text-red-500" />
                                            Demonstration Video
                                        </label>
                                        <input
                                            type="url"
                                            value={set.video_url || ''}
                                            onChange={(e) => handleUpdateSet(idx, 'video_url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all font-medium"
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <ScrollText className="w-4 h-4 text-red-500" />
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                Strategic Notes
                                            </label>
                                        </div>
                                        <textarea
                                            value={set.note || ''}
                                            onChange={(e) => handleUpdateSet(idx, 'note', e.target.value)}
                                            placeholder="Document key phases, timing instructions, or specific hero requirements..."
                                            rows={4}
                                            className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all resize-y min-h-[120px] font-medium"
                                        />
                                    </div>
                                </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
