'use client'

import { useState, useEffect } from 'react'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { Plus, Trash2, Video, Save, Loader2, Zap, X, Pencil, ShieldAlert, Swords, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getGuildWarTeams, 
    createGuildWarTeam, 
    updateGuildWarTeam, 
    deleteGuildWarTeam
} from '@/lib/guild-war-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

// Helper to get hero skill image path
function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace(/\.[^/.]+$/, '')
    return `/skills/${folderName}/${skillNumber}.webp`
}

function SkillPickerModal({ skillPicker, teams, heroes, skillErrors, onSelect, onClose, onSkillError }) {
    if (!skillPicker) return null
    const { teamId, slotIdx } = skillPicker
    const team = teams.find(t => t.id === teamId)
    if (!team) return null
    const teamHeroes = team.heroes || []

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div>
                        <h3 className="text-xl font-black text-white">Select Skill</h3>
                        <p className="text-sm text-gray-400 mt-1">Choose a skill from the team heroes</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
                        <X size={22} />
                    </button>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {teamHeroes.map((heroFile, heroIdx) => {
                        if (!heroFile) return null
                        const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
                        
                        // Resolve actual filename
                        const heroData = heroes?.find(h => 
                            h.filename === heroFile || 
                            h.filename.replace(/\.[^/.]+$/, "") === heroFile
                        )
                        const actualFile = heroData?.filename || heroFile

                        return (
                            <div key={heroIdx} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-700">
                                        <SafeImage src={`/heroes/${actualFile}`} alt={heroName} fill className="object-cover" />
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
                                                onClick={() => onSelect(teamId, slotIdx, skillKey)}
                                                className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all bg-gray-900"
                                            >
                                                {skillPath && !hasError ? (
                                                    <SafeImage
                                                        src={skillPath}
                                                        alt={`Skill ${skillNum}`}
                                                        fill
                                                        className="object-cover"
                                                        onError={() => onSkillError(errKey)}
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

export default function AdminGuildWarPage() {
    const [teams, setTeams] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    // Skill picker state: { teamId, slotIdx } or null
    const [skillPicker, setSkillPicker] = useState(null)
    const [activeTab, setActiveTab] = useState('attacker') // 'attacker' or 'defender'

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [attTeamsData, defTeamsData, heroesData, petsData, formationsData] = await Promise.all([
                getGuildWarTeams('attacker'),
                getGuildWarTeams('defender'),
                getAllHeroes(),
                getPets(),
                getFormations()
            ])
            const allTeams = [...attTeamsData, ...defTeamsData]
            setTeams(allTeams.map(s => ({ ...s, _dirty: false })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formationsData)
            setLoading(false)
        }
        loadData()
    }, [])

    const handleAddTeam = () => {
        const currentTypeTeams = teams.filter(t => t.type === activeTab)
        const newTeam = {
            id: `new-${Date.now()}`,
            team_index: currentTypeTeams.length + 1,
            type: activeTab,
            team_name: '',
            formation: formations[0]?.value || '1-4',
            pet_file: '',
            heroes: [null, null, null, null, null], // Still uses 5 slots internally but UI limits max 3
            skill_rotation: [],
            video_url: '',
            note: '',
            counters: [],
            _isNew: true,
            _dirty: true,
            _isMinimized: false
        }
        setTeams([...teams, newTeam])
    }

    const updateTeamState = (id, updater) => {
        setTeams(prevTeams => prevTeams.map(team => 
            team.id === id ? { ...updater(team), _dirty: true } : team
        ))
    }

    const handleUpdateTeam = (id, field, value) => {
        updateTeamState(id, team => ({ ...team, [field]: value }))
    }

    const toggleCounter = (id, attackerId) => {
        updateTeamState(id, team => {
            const currentCounters = team.counters || []
            const newCounters = currentCounters.includes(attackerId)
                ? currentCounters.filter(cid => cid !== attackerId)
                : [...currentCounters, attackerId]
            return { ...team, counters: newCounters }
        })
    }

    const handleTeamBuilderUpdate = (id, teamData) => {
        updateTeamState(id, team => ({
            ...team,
            formation: teamData.formation,
            pet_file: teamData.pet_file,
            heroes: teamData.heroes
        }))
    }

    const handleDeleteTeam = async (id) => {
        const team = teams.find(t => t.id === id)
        if (!team._isNew) {
            await deleteGuildWarTeam(team.id)
        }
        setTeams(teams.filter(t => t.id !== id))
    }

    const handleSaveAll = async () => {
        setSaving(true)
        for (const team of teams) {
            if (!team._dirty) continue

            const data = {
                team_name: team.team_name,
                type: team.type,
                formation: team.formation,
                pet_file: team.pet_file,
                heroes: team.heroes,
                skill_rotation: team.skill_rotation,
                video_url: team.video_url,
                note: team.note,
                counters: team.counters || []
            }

            if (team._isNew) {
                await createGuildWarTeam(data)
            } else {
                await updateGuildWarTeam(team.id, data)
            }
        }
        
        // After save, reload
        const [attTeamsData, defTeamsData] = await Promise.all([
            getGuildWarTeams('attacker'),
            getGuildWarTeams('defender')
        ])
        const allTeams = [...attTeamsData, ...defTeamsData]
        setTeams(allTeams.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

    // --- Skill Slot Handlers ---
    const handleAddSlot = (id) => {
        updateTeamState(id, team => {
            const rotation = [...(team.skill_rotation || [])]
            rotation.push({ label: '', skill: null })
            return { ...team, skill_rotation: rotation }
        })
    }

    const handleUpdateSlotLabel = (id, slotIdx, label) => {
        updateTeamState(id, team => {
            const rotation = [...(team.skill_rotation || [])]
            rotation[slotIdx] = { ...rotation[slotIdx], label }
            return { ...team, skill_rotation: rotation }
        })
    }

    const handleSelectSkillForSlot = (id, slotIdx, skillKey) => {
        updateTeamState(id, team => {
            const rotation = [...(team.skill_rotation || [])]
            rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
            return { ...team, skill_rotation: rotation }
        })
        setSkillPicker(null)
    }

    const handleDeleteSlot = (id, slotIdx) => {
        updateTeamState(id, team => {
            const rotation = [...(team.skill_rotation || [])]
            rotation.splice(slotIdx, 1)
            return { ...team, skill_rotation: rotation }
        })
    }

    const handleSkillError = (key) => {
        setSkillErrors(prev => ({ ...prev, [key]: true }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        )
    }

    const hasDirty = teams.some(s => s._dirty)
    const activeTeams = teams.filter(t => t.type === activeTab)


    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black border border-gray-800 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <Swords className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Guild War Teams
                            </h1>
                            <p className="text-gray-400 font-medium mt-1">Manage Attacker and Defender Guild War teams (Max 3 Heroes)</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasDirty || saving}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                                hasDirty 
                                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] border border-red-500" 
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                            )}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save All
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-8 flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-gray-800/80 w-fit">
                    <button
                        onClick={() => setActiveTab('attacker')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all",
                            activeTab === 'attacker'
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                        )}
                    >
                        <Swords className="w-4 h-4" />
                        Attacker Teams
                    </button>
                    <button
                        onClick={() => setActiveTab('defender')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all",
                            activeTab === 'defender'
                                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                        )}
                    >
                        <Shield className="w-4 h-4" />
                        Defender Teams
                    </button>
                </div>
            </div>

            {/* Sticky Add Button Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                    {activeTab === 'attacker' ? (
                        <><Swords className="w-5 h-5 text-red-500" /> Attackers</>
                    ) : (
                        <><Shield className="w-5 h-5 text-amber-500" /> Defenders</>
                    )}
                </h2>
                <button
                    onClick={handleAddTeam}
                    className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-700 transition-all border border-gray-700 shadow-lg hover:shadow-xl active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Team
                </button>
            </div>

            {/* Teams List */}
            <div className="space-y-6">
                {activeTeams.length === 0 && (
                    <div className="text-center py-24 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                        {activeTab === 'attacker' ? <Swords className="w-16 h-16 text-gray-600 mx-auto mb-4" /> : <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
                        <h3 className="text-xl font-black text-gray-300 mb-2">No Teams Configured</h3>
                        <p className="text-gray-500 text-sm">Create your first {activeTab} team setup to display to users.</p>
                        <button
                            onClick={handleAddTeam}
                            className={cn(
                                "mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all border",
                                activeTab === 'attacker' 
                                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                    : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                            )}
                        >
                            <Plus className="w-4 h-4" />
                            Add First Team
                        </button>
                    </div>
                )}

                {activeTeams.map((team, displayIdx) => {
                    const hasHeroes = team.heroes?.some(h => h !== null)
                    const rotation = team.skill_rotation || []
                    const accentColor = activeTab === 'attacker' ? 'red' : 'amber'

                    return (
                        <div 
                            key={team.id} 
                            className={cn(
                                "bg-gray-900/40 border rounded-2xl overflow-hidden shadow-lg transition-all",
                                team._dirty ? `border-${accentColor}-500/50` : "border-gray-800"
                            )}
                        >
                            {/* Team Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-black border shadow-[0_0_15px_rgba(0,0,0,0.2)]",
                                        activeTab === 'attacker' 
                                            ? "bg-gradient-to-br from-red-600/20 to-rose-600/10 text-red-400 border-red-500/30"
                                            : "bg-gradient-to-br from-amber-500/20 to-yellow-600/10 text-amber-400 border-amber-500/30"
                                    )}>
                                        {displayIdx + 1}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={team.team_name || ''}
                                            onChange={(e) => handleUpdateTeam(team.id, 'team_name', e.target.value)}
                                            placeholder={`${activeTab === 'attacker' ? 'Attacker' : 'Defender'} Team ${displayIdx + 1}`}
                                            className="bg-transparent border-none outline-none text-xl font-black text-white placeholder-gray-600 w-64 focus:ring-0 focus:text-white transition-colors capitalize"
                                        />
                                    </div>
                                    {team._dirty && (
                                        <span className={cn(
                                            "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border",
                                            activeTab === 'attacker' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}>
                                            Unsaved
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdateTeam(team.id, '_isMinimized', !team._isMinimized)}
                                        className="text-gray-400 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-xl"
                                    >
                                        {team._isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTeam(team.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-2.5 hover:bg-red-500/10 rounded-xl flex items-center gap-2 group border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="sm:hidden font-medium text-sm">Delete Team</span>
                                    </button>
                                </div>
                            </div>

                            {!team._isMinimized && (
                            <div className="p-6 space-y-8">
                                {/* Team Builder */}
                                <TeamBuilder
                                    team={{
                                        index: displayIdx + 1,
                                        formation: team.formation,
                                        pet_file: team.pet_file,
                                        heroes: team.heroes
                                    }}
                                    index={displayIdx}
                                    heroesList={heroes}
                                    petsList={pets}
                                    formations={formations}
                                    onUpdate={(teamData) => handleTeamBuilderUpdate(team.id, teamData)}
                                    maxHeroes={3}
                                    className="!bg-black/20"
                                />

                                {/* ===== Skill Slots Row ===== */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                                        <Zap className={cn("w-5 h-5", activeTab === 'attacker' ? 'text-red-500' : 'text-amber-500')} />
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
                                                            onChange={(e) => handleUpdateSlotLabel(team.id, slotIdx, e.target.value)}
                                                            placeholder="..."
                                                            className={cn(
                                                                "w-14 text-center text-[11px] font-black bg-transparent border-none outline-none placeholder-gray-600 mb-1 truncate focus:bg-gray-800/50 rounded",
                                                                activeTab === 'attacker' ? 'text-red-400' : 'text-amber-400'
                                                            )}
                                                        />
                                                        {/* Skill Square */}
                                                        <div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSkillPicker({ teamId: team.id, slotIdx })}
                                                                disabled={!hasHeroes}
                                                                className={cn(
                                                                    "w-14 h-14 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all bg-gray-900 relative",
                                                                    slot.skill 
                                                                        ? (activeTab === 'attacker' ? "border-red-500/50 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-amber-500/50 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]")
                                                                        : "border-gray-700 border-dashed hover:border-gray-500",
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
                                                                    <Plus className="w-5 h-5 text-gray-600" />
                                                                )}
                                                            </button>
                                                            {/* Delete btn on hover */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteSlot(team.id, slotIdx) }}
                                                                className="absolute -top-1 -right-2 w-5 h-5 bg-gray-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                                                    onClick={() => handleAddSlot(team.id)}
                                                    disabled={!hasHeroes}
                                                    className={cn(
                                                        "w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center transition-all",
                                                        hasHeroes
                                                            ? (activeTab === 'attacker' 
                                                                ? "border-red-500/30 text-red-500/50 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 bg-black/20"
                                                                : "border-amber-500/30 text-amber-500/50 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 bg-black/20")
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
                                            onChange={(e) => handleUpdateTeam(team.id, 'video_url', e.target.value)}
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
                                            onChange={(e) => handleUpdateTeam(team.id, 'note', e.target.value)}
                                            placeholder="Optional notes or strategy for this team..."
                                            rows={2}
                                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                {/* ===== Counter Section (Defenders only) ===== */}
                                {activeTab === 'defender' && (
                                    <div className="space-y-4 pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5 text-red-500" />
                                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest text-red-500">Beaten By (Attacker Teams)</h3>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-black/30 p-4 rounded-xl border border-gray-800/80">
                                            {teams.filter(t => t.type === 'attacker').map(attacker => {
                                                const isSelected = (team.counters || []).includes(attacker.id)
                                                return (
                                                    <button
                                                        key={attacker.id}
                                                        type="button"
                                                        onClick={() => toggleCounter(team.id, attacker.id)}
                                                        className={cn(
                                                            "flex flex-col gap-2 p-2 rounded-lg border transition-all text-left group",
                                                            isSelected 
                                                                ? "bg-red-500/10 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                                                                : "bg-gray-900/50 border-gray-800 hover:border-gray-600"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase truncate",
                                                            isSelected ? "text-red-400" : "text-gray-500"
                                                        )}>
                                                            {attacker.team_name || `#${attacker.team_index} Attacker`}
                                                        </span>
                                                        <div className="flex -space-x-1.5">
                                                            {(attacker.heroes || []).filter(h => h).map((h, i) => (
                                                                <div key={i} className="relative w-6 h-6 rounded border border-black overflow-hidden bg-gray-950">
                                                                    <SafeImage src={`/heroes/${h}`} alt="" fill className="object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                            {teams.filter(t => t.type === 'attacker').length === 0 && (
                                                <p className="text-xs text-gray-600 italic py-2">No attacker teams available yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <SkillPickerModal 
                skillPicker={skillPicker}
                teams={teams}
                heroes={heroes}
                skillErrors={skillErrors}
                onSelect={handleSelectSkillForSlot}
                onClose={() => setSkillPicker(null)}
                onSkillError={handleSkillError}
            />
        </div>
    )
}
