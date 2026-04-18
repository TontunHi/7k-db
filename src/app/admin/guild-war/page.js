'use client'

import { useState, useEffect } from 'react'
import SafeImage from '@/components/shared/SafeImage'
import { 
    Plus, Trash2, Video, Save, Loader2, Zap, X, Pencil, 
    ShieldAlert, Swords, Shield, ChevronDown, ChevronUp,
    Briefcase, Sparkles, UserPlus, Info, Layout, Box
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    getGuildWarTeams, 
    createGuildWarTeam, 
    updateGuildWarTeam, 
    deleteGuildWarTeam,
    getItemFiles
} from '@/lib/guild-war-actions'
import { getAllHeroes, getPets, getFormations } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'
import { getSkillImagePath } from '@/lib/formation-utils'

// Mini Hero Picker for Counter Teams
function MiniHeroPicker({ heroes, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-gray-900 w-full max-w-3xl max-h-[80vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-black text-white">Select Hero</h3>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {heroes
                        .filter(h => {
                            if (!h || !h.filename) return false
                            const lower = h.filename.toLowerCase()
                            return ['l++', 'l+', 'l', 'r'].some(g => lower.startsWith(g + '_'))
                        })
                        .sort((a, b) => {
                            const gradeOrder = { 'l++': 6, 'l+': 5, 'l': 4, 'r': 3, 'uc': 2, 'c': 1 }
                            const getGrade = f => {
                                const lower = f.toLowerCase()
                                if (lower.startsWith('l++_')) return 6
                                if (lower.startsWith('l+_')) return 5
                                if (lower.startsWith('l_')) return 4
                                if (lower.startsWith('r_')) return 3
                                return 0
                            }
                            const gA = getGrade(a.filename)
                            const gB = getGrade(b.filename)
                            if (gA !== gB) return gB - gA
                            return a.name.localeCompare(b.name)
                        })
                        .map(h => (
                        <button
                            key={h.filename}
                            onClick={() => onSelect(h.filename)}
                            className="relative aspect-[3/4] rounded-lg border border-gray-700 overflow-hidden hover:border-yellow-500 transition-all"
                        >
                            <SafeImage src={`/heroes/${h.filename}`} alt="" fill className="object-cover" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}


function SkillPickerModal({ skillPicker, teams, heroes, skillErrors, onSelect, onClose, onSkillError }) {
    if (!skillPicker) return null
    const { teamId, slotIdx, isCounter, counterIdx } = skillPicker
    const team = teams.find(t => t.id === teamId)
    if (!team) return null
    
    const teamHeroes = isCounter 
        ? (team.counter_teams?.[counterIdx]?.heroes || []) 
        : (team.heroes || [])

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
                        const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')
                        
                        const heroData = heroes?.find(h => 
                            h.filename === heroFile || 
                            h.filename.replace(/\.[^\/.]+$/, "") === heroFile
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
    const [weapons, setWeapons] = useState([])
    const [armors, setArmors] = useState([])
    const [accessories, setAccessories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillErrors, setSkillErrors] = useState({})
    const [skillPicker, setSkillPicker] = useState(null) // { teamId, slotIdx, isCounter, counterIdx }
    const [itemPicker, setItemPicker] = useState(null)
    
    // Counter Team Hero Picker
    const [counterHeroPicker, setCounterHeroPicker] = useState(null) // { teamId, counterIdx, heroSlot }

    const padArray = (arr, len, filler = null) => {
        const result = [...(arr || [])]
        while (result.length < len) result.push(filler)
        return result.slice(0, len)
    }

    const sortItems = (list) => {
        const gradeOrder = { 'l': 10, 'r': 5, 'un': 3, 'c': 1 }
        return [...list].sort((a, b) => {
            const fA = a.filename || a
            const fB = b.filename || b
            const getGrade = (f) => gradeOrder[f.split('_')[0].toLowerCase()] || 0
            const ga = getGrade(fA), gb = getGrade(fB)
            if (ga !== gb) return gb - ga
            return fA.localeCompare(fB)
        })
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [t, h, p, f, itemData] = await Promise.all([
                    getGuildWarTeams('all'),
                    getAllHeroes(),
                    getPets(),
                    getFormations(),
                    getItemFiles()
                ])
                setTeams(t.map(s => ({ ...s, _dirty: false })))
                setHeroes(h)
                setPets(p)
                setFormations(f)
                setWeapons(sortItems(itemData.weapons))
                setArmors(sortItems(itemData.armors))
                setAccessories(sortItems(itemData.accessories))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const handleAddTeam = () => {
        const newTeam = {
            id: `new-${Date.now()}`,
            team_index: teams.length + 1,
            type: 'general',
            team_name: '',
            formation: formations[0]?.value || '1-4',
            pet_file: '',
            pet_supports: [null, null, null],
            heroes: [null, null, null, null, null],
            selection_order: [],
            skill_rotation: [],
            items: [
                { weapon: '', armor: '', accessories: [null, null, null], note: '' },
                { weapon: '', armor: '', accessories: [null, null, null], note: '' },
                { weapon: '', armor: '', accessories: [null, null, null], note: '' }
            ],
            note: '',
            counter_teams: [],
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

    const handleItemUpdate = (id, heroIdx, itemField, value, accIdx = null) => {
        updateTeamState(id, team => {
            const items = [...(team.items || [])]
            while (items.length <= heroIdx) items.push({ weapon: '', armor: '', accessories: [null, null, null], note: '' })
            
            if (itemField === 'accessories' && accIdx !== null) {
                const accs = [...(items[heroIdx].accessories || [null, null, null])]
                accs[accIdx] = value
                items[heroIdx] = { ...items[heroIdx], accessories: accs }
            } else {
                items[heroIdx] = { ...items[heroIdx], [itemField]: value }
            }
            return { ...team, items }
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

    const handlePetSupportSelect = (teamId, petIdx, petFile) => {
        updateTeamState(teamId, team => {
            const supports = [...(team.pet_supports || [])]
            supports[petIdx] = petFile
            return { ...team, pet_supports: supports }
        })
        setPetSupportPicker(null)
    }

    const handleAddCounterTeam = (teamId) => {
        updateTeamState(teamId, team => {
            const counters = [...(team.counter_teams || [])]
            counters.push({
                team_name: `Counter Team ${counters.length + 1}`,
                formation: '1-4',
                heroes: [null, null, null],
                pet_file: '',
                items: [
                    { weapon: '', armor: '', accessories: [null, null, null], note: '' },
                    { weapon: '', armor: '', accessories: [null, null, null], note: '' },
                    { weapon: '', armor: '', accessories: [null, null, null], note: '' }
                ],
                skill_rotation: [],
                note: ''
            })
            return { ...team, counter_teams: counters }
        })
    }

    const handleUpdateCounterTeam = (teamId, counterIdx, updates, value) => {
        updateTeamState(teamId, team => {
            const counters = [...(team.counter_teams || [])]
            if (typeof updates === 'string') {
                const field = updates
                counters[counterIdx] = { ...counters[counterIdx], [field]: value }
            } else {
                counters[counterIdx] = { ...counters[counterIdx], ...updates }
            }
            return { ...team, counter_teams: counters }
        })
    }

    const handleCounterHeroSelect = (teamId, counterIdx, slotIdx, heroFile) => {
        updateTeamState(teamId, team => {
            const counters = [...(team.counter_teams || [])]
            const teamHeroes = [...(counters[counterIdx].heroes || [null,null,null,null,null])]
            teamHeroes[slotIdx] = heroFile
            counters[counterIdx] = { ...counters[counterIdx], heroes: teamHeroes }
            return { ...team, counter_teams: counters }
        })
        setCounterHeroPicker(null)
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
                type: team.type || 'general',
                formation: team.formation,
                pet_file: team.pet_file,
                pet_supports: padArray(team.pet_supports, 3),
                heroes: padArray(team.heroes, 5),
                selection_order: team.selection_order || [],
                skill_rotation: team.skill_rotation,
                items: padArray((team.items || []).map(item => ({
                    ...item,
                    accessories: padArray(item.accessories, 3)
                })), 3, { weapon: '', armor: '', accessories: [null, null, null], note: '' }),
                note: team.note,
                counter_teams: (team.counter_teams || []).map(ct => ({
                    ...ct,
                    heroes: padArray(ct.heroes, 5),
                    selection_order: ct.selection_order || [],
                    pet_supports: padArray(ct.pet_supports, 3),
                    items: padArray((ct.items || []).map(item => ({
                        ...item,
                        accessories: padArray(item.accessories, 3)
                    })), 3, { weapon: '', armor: '', accessories: [null, null, null], note: '' })
                }))
            }

            let result
            if (team._isNew) {
                result = await createGuildWarTeam(data)
            } else {
                result = await updateGuildWarTeam(team.id, data)
            }

            if (result && !result.success) {
                alert(`Error saving team "${team.team_name || team.id}": ${result.error}`)
                setSaving(false)
                return
            }
        }
        
        const teamsData = await getGuildWarTeams('all')
        setTeams(teamsData.map(s => ({ ...s, _dirty: false })))
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        )
    }

    const hasDirty = teams.some(s => s._dirty)

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black border border-gray-800 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                            <Swords className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Guild War Teams
                            </h1>
                            <p className="text-gray-400 font-medium mt-1">Manage unified Guild War teams with full equipment & counters</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasDirty || saving}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                                hasDirty 
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-500" 
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                            )}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save All
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" /> Team Registry
                </h2>
                <button
                    onClick={handleAddTeam}
                    className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-700 transition-all border border-gray-700 shadow-lg hover:shadow-xl active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Team
                </button>
            </div>

            <div className="space-y-6">
                {teams.length === 0 && (
                    <div className="text-center py-24 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                        <Swords className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-300 mb-2">No Teams Configured</h3>
                        <p className="text-gray-500 text-sm">Create your first Guild War team setup.</p>
                    </div>
                )}

                {teams.map((team, displayIdx) => {
                    const hasHeroes = team.heroes?.some(h => h !== null)
                    const rotation = team.skill_rotation || []

                    return (
                        <div 
                            key={team.id} 
                            className={cn(
                                "bg-gray-900/40 border rounded-2xl overflow-hidden shadow-lg transition-all",
                                team._dirty ? "border-indigo-500/50" : "border-gray-800"
                            )}
                        >
                            {/* Team Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black border shadow-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/10 text-indigo-400 border-indigo-500/30">
                                        {displayIdx + 1}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={team.team_name || ''}
                                            onChange={(e) => handleUpdateTeam(team.id, 'team_name', e.target.value)}
                                            placeholder={`Guild War Team ${displayIdx + 1}`}
                                            className="bg-transparent border-none outline-none text-xl font-black text-white placeholder-gray-600 w-64 focus:ring-0 focus:text-white transition-colors"
                                        />
                                    </div>
                                    
                                    {team._isMinimized && (
                                        <div className="hidden lg:flex items-center gap-6 ml-8 pl-8 border-l border-white/10 animate-in fade-in slide-in-from-left-4 duration-500">
                                            <div className="flex items-center gap-2.5">
                                                {(team.heroes || []).filter(h => h).map((hero, i) => (
                                                    <div key={i} className="relative w-14 h-14 rounded-2xl border-2 border-gray-950 overflow-hidden bg-gray-900 shadow-2xl group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                                        <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            {team.pet_file && (
                                                <div className="flex items-center p-2 rounded-[1.5rem] bg-black/40 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                                    <div className="relative w-12 h-12">
                                                        <SafeImage src={team.pet_file} alt="" fill className="object-contain" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                                        className="text-gray-500 hover:text-red-400 transition-colors p-2.5 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {!team._isMinimized && (
                            <div className="p-6 space-y-8">
                                {/* Core Team Builder */}
                                <div className="space-y-4">
                                    <TeamBuilder
                                        team={{
                                            index: displayIdx + 1,
                                            formation: team.formation,
                                            pet_file: team.pet_file,
                                            pet_supports: team.pet_supports,
                                            heroes: team.heroes,
                                            selection_order: team.selection_order
                                        }}
                                        index={displayIdx}
                                        heroesList={heroes}
                                        petsList={pets}
                                        formations={formations}
                                        onUpdate={(teamData) => {
                                            updateTeamState(team.id, t => ({
                                                ...t,
                                                formation: teamData.formation,
                                                pet_file: teamData.pet_file,
                                                pet_supports: teamData.pet_supports,
                                                heroes: teamData.heroes,
                                                selection_order: teamData.selection_order
                                            }))
                                        }}
                                        maxHeroes={3}
                                        className="!bg-black/20"
                                    />
                                    
                                </div>

                                {/* Items Section */}
                                <div className="space-y-6 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                            <Briefcase className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Build</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {((team.selection_order && team.selection_order.length > 0) ? team.selection_order : (team.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).map((slotIdx, heroIdx) => {
                                            const heroFile = team.heroes?.[slotIdx]
                                            const heroName = heroFile ? heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ') : `Hero ${heroIdx + 1}`
                                            const itemSet = team.items?.[heroIdx] || { weapon: '', armor: '', accessories: [null, null, null], note: '' }

                                            return (
                                                <div key={heroIdx} className={cn(
                                                    "relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500",
                                                    heroFile 
                                                        ? "bg-[#0a0d14] border-amber-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]" 
                                                        : "bg-black/20 border-white/5 opacity-40 grayscale"
                                                )}>
                                                    {/* Header: Large Portrait + Name */}
                                                    <div className="flex items-center gap-6 mb-8">
                                                        <div className="relative w-32 h-32 flex-shrink-0">
                                                            {heroFile ? (
                                                                <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-contain" />
                                                            ) : <Layout size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{heroName}</h4>
                                                            <div className="w-8 h-0.5 bg-amber-500/30 rounded-full mt-2" />
                                                        </div>
                                                    </div>

                                                    {/* Primary Gear Grid */}
                                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                                        {[
                                                            { type: 'weapon', color: 'red' },
                                                            { type: 'armor', color: 'blue' }
                                                        ].map(gear => (
                                                            <div key={gear.type} className="group/slot relative">
                                                                <div 
                                                                    onClick={() => heroFile && setItemPicker({ teamId: team.id, heroIdx, type: gear.type })}
                                                                    className={cn(
                                                                        "relative aspect-square rounded-[1.8rem] border flex items-center justify-center transition-all bg-black/60 cursor-pointer overflow-hidden group/gear shadow-2xl",
                                                                        itemSet[gear.type] 
                                                                            ? (gear.color === 'red' ? "border-red-500/30 bg-red-500/10" : "border-blue-500/30 bg-blue-500/10")
                                                                            : "border-white/5 border-dashed hover:border-amber-500/40 hover:bg-amber-500/5"
                                                                    )}
                                                                >
                                                                    {itemSet[gear.type] ? (
                                                                        <SafeImage src={`/items/${gear.type}/${itemSet[gear.type]}`} alt="" fill className="object-contain p-4 group-hover/gear:scale-110 transition-transform duration-500" />
                                                                    ) : <Plus size={32} className="text-white/5" />}
                                                                </div>
                                                                {itemSet[gear.type] && (
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); handleItemUpdate(team.id, heroIdx, gear.type, '') }}
                                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border border-red-500/50 hover:bg-red-500 transition-colors z-10"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Accessories Row */}
                                                    <div className="flex items-center gap-4 mb-8">
                                                        {[0, 1, 2].map(accIdx => {
                                                            const accImg = itemSet.accessories?.[accIdx]
                                                            return (
                                                                <div key={accIdx} className="relative group/acc-container flex-1">
                                                                    <div 
                                                                        onClick={() => heroFile && setItemPicker({ teamId: team.id, heroIdx, type: 'accessories', accIdx })}
                                                                        className={cn(
                                                                            "relative aspect-square rounded-2xl border flex items-center justify-center transition-all bg-black/60 cursor-pointer overflow-hidden group/acc",
                                                                            accImg ? "border-amber-500/40 bg-amber-500/10" : "border-white/5 border-dashed hover:border-amber-500/40 hover:bg-amber-500/5"
                                                                        )}
                                                                    >
                                                                        {accImg ? (
                                                                            <SafeImage src={`/items/accessory/${accImg}`} alt="" fill className="object-contain p-3 group-hover/acc:scale-110 transition-transform duration-500" />
                                                                        ) : <Plus size={20} className="text-white/5" />}
                                                                    </div>
                                                                    {accImg && (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); handleItemUpdate(team.id, heroIdx, 'accessories', null, accIdx) }}
                                                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border border-red-500/50 opacity-0 group-hover/acc-container:opacity-100 transition-opacity z-20"
                                                                        >
                                                                            <X size={10} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Notes */}
                                                    <textarea
                                                        value={itemSet.note || ''}
                                                        onChange={(e) => handleItemUpdate(team.id, heroIdx, 'note', e.target.value)}
                                                        placeholder="Strategic Notes..."
                                                        rows={2}
                                                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/40 transition-all text-sm font-medium resize-none leading-relaxed"
                                                        disabled={!heroFile}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Strategic Execution: Skill Rotation */}
                                <div className="space-y-6 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-3 pl-1">
                                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                            <Zap className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Skill Rotation</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-5 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                                         {rotation.map((slot, slotIdx) => {
                                             const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                                const heroFile = team.heroes?.[hIdx]
                                                const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                                return (
                                                    <div key={slotIdx} className="flex flex-col items-center group relative">
                                                        <input
                                                            type="text"
                                                            value={slot.label || ''}
                                                            onChange={(e) => {
                                                                const newRot = [...(team.skill_rotation || [])]
                                                                newRot[slotIdx] = { ...newRot[slotIdx], label: e.target.value }
                                                                handleUpdateTeam(team.id, 'skill_rotation', newRot)
                                                            }}
                                                            placeholder="..."
                                                            className="w-14 text-center text-[11px] font-black bg-transparent border-none outline-none text-indigo-400 mb-1"
                                                        />
                                                        <div
                                                            onClick={() => setSkillPicker({ teamId: team.id, slotIdx })}
                                                            className={cn(
                                                                "w-14 h-14 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all bg-gray-900 cursor-pointer relative",
                                                                slot.skill ? "border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:border-indigo-500" : "border-gray-800 border-dashed hover:border-gray-600"
                                                            )}
                                                        >
                                                            {skillPath ? <SafeImage src={skillPath} alt="" fill className="object-cover" /> : <Plus size={16} />}
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newRot = [...(team.skill_rotation || [])]
                                                                    newRot.splice(slotIdx, 1)
                                                                    handleUpdateTeam(team.id, 'skill_rotation', newRot)
                                                                }}
                                                                className="absolute -top-1 -right-1 p-1 bg-red-600/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <button 
                                                onClick={() => {
                                                    const newRot = [...(team.skill_rotation || [])]
                                                    newRot.push({ label: '', skill: null })
                                                    handleUpdateTeam(team.id, 'skill_rotation', newRot)
                                                }}
                                                className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-800 text-gray-700 hover:text-indigo-500 hover:border-indigo-500 transition-all flex items-center justify-center"
                                            >
                                                <Plus size={20} />
                                            </button>
                                    </div>
                                </div>

                                {/* General Note Section */}
                                <div className="space-y-4 pt-6 border-t border-gray-800">
                                    <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                                        <Info className="w-5 h-5 text-gray-500" />
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">General Note</h3>
                                    </div>
                                    <textarea
                                        value={team.note || ''}
                                        onChange={(e) => handleUpdateTeam(team.id, 'note', e.target.value)}
                                        placeholder="Add general strategy tips or common matchups here..."
                                        rows={3}
                                        className="w-full bg-black/40 border border-gray-800 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-gray-500/40 transition-all resize-none"
                                    />
                                </div>
                                
                                {/* Counter Strategies Section */}
                                <div className="space-y-6 pt-6 border-t border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5 text-rose-500" />
                                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Counter Strategy</h3>
                                        </div>
                                        <button
                                            onClick={() => handleAddCounterTeam(team.id)}
                                            className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all border border-rose-500/20"
                                        >
                                            <Plus size={12}/> Add Counter Team
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {(team.counter_teams || []).map((ct, ctIdx) => (
                                            <CounterTeamEditor 
                                                key={ctIdx}
                                                teamId={team.id}
                                                ct={ct}
                                                ctIdx={ctIdx}
                                                heroesList={heroes}
                                                petsList={pets}
                                                formations={formations}
                                                weapons={weapons}
                                                armors={armors}
                                                accessories={accessories}
                                                onUpdate={(updates) => handleUpdateCounterTeam(team.id, ctIdx, updates)}
                                                onRemove={() => {
                                                    const newCt = team.counter_teams.filter((_, i) => i !== ctIdx)
                                                    handleUpdateTeam(team.id, 'counter_teams', newCt)
                                                }}
                                                onOpenSkillPicker={(sidx) => setSkillPicker({ teamId: team.id, slotIdx: sidx, isCounter: true, counterIdx: ctIdx })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
            </div>

            {/* Item Picker Modal */}
            {itemPicker && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-[#0b0f1a] w-full max-w-4xl max-h-[85vh] rounded-[2rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Select {itemPicker.type}</h3>
                                <p className="text-xs text-amber-500/60 mt-1 font-bold tracking-widest">CHOOSE GEAR FOR YOUR HERO</p>
                            </div>
                            <button onClick={() => setItemPicker(null)} className="p-3 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-2xl transition-all">
                                <X size={24}/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-black/20">
                            <button 
                                onClick={() => {
                                    handleItemUpdate(itemPicker.teamId, itemPicker.heroIdx, itemPicker.type, itemPicker.type === 'accessories' ? null : '', itemPicker.accIdx)
                                    setItemPicker(null)
                                }}
                                className="aspect-square rounded-2xl border-2 border-dashed border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 flex flex-col items-center justify-center gap-2 text-[10px] font-black text-gray-500 hover:text-red-500 transition-all uppercase tracking-widest group/none"
                            >
                                <X size={20} className="group-hover/none:scale-110 transition-transform" />
                                <span>Clear</span>
                            </button>
                            {(() => {
                                const team = teams.find(t => t.id === itemPicker.teamId)
                                const heroFile = team?.heroes?.[itemPicker.heroIdx]
                                
                                let baseItems = itemPicker.type === 'weapon' ? weapons : itemPicker.type === 'armor' ? armors : accessories

                                return (
                                    <>
                                        {baseItems.map(item => (
                                            <button
                                                key={item.filename}
                                                onClick={() => {
                                                    handleItemUpdate(itemPicker.teamId, itemPicker.heroIdx, itemPicker.type, item.filename, itemPicker.accIdx)
                                                    setItemPicker(null)
                                                }}
                                                className="group aspect-square rounded-2xl border border-white/5 bg-gradient-to-br from-gray-900 to-black hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all p-3 flex items-center justify-center relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                                                    <SafeImage src={`/items/${itemPicker.type === 'accessories' ? 'accessory' : itemPicker.type}/${item.filename}`} alt="" fill className="object-contain" />
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}

            <SkillPickerModal 
                skillPicker={skillPicker}
                teams={teams}
                heroes={heroes}
                skillErrors={skillErrors}
                onSelect={(tid, sidx, skey) => {
                    if (skillPicker.isCounter) {
                        const team = teams.find(t => t.id === tid)
                        if (team) {
                            const newCt = [...(team.counter_teams || [])]
                            const rot = [...(newCt[skillPicker.counterIdx].skill_rotation || [])]
                            rot[sidx] = { ...rot[sidx], skill: skey }
                            newCt[skillPicker.counterIdx] = { ...newCt[skillPicker.counterIdx], skill_rotation: rot }
                            handleUpdateTeam(tid, 'counter_teams', newCt)
                        }
                    } else {
                        updateTeamState(tid, team => {
                            const rot = [...(team.skill_rotation || [])]
                            rot[sidx] = { ...rot[sidx], skill: skey }
                            return { ...team, skill_rotation: rot }
                        })
                    }
                    setSkillPicker(null)
                }}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />
        </div>
    )
}

function CounterTeamEditor({ teamId, ct, ctIdx, heroesList, petsList, formations, weapons, armors, accessories, onUpdate, onRemove, onOpenSkillPicker }) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [itemPicker, setItemPicker] = useState(null)

    const handleItemUpdate = (heroIdx, field, value, accIdx = null) => {
        const items = [...(ct.items || [])]
        while (items.length <= heroIdx) items.push({ weapon: '', armor: '', accessories: [null, null, null], note: '' })
        if (field === 'accessories' && accIdx !== null) {
            const accs = [...(items[heroIdx].accessories || [null, null, null])]
            accs[accIdx] = value
            items[heroIdx] = { ...items[heroIdx], accessories: accs }
        } else {
            items[heroIdx] = { ...items[heroIdx], [field]: value }
        }
        onUpdate({ items })
    }

    return (
        <div className="bg-black/40 rounded-3xl border border-white/5 overflow-hidden shadow-xl">
            {/* Header / Toggle */}
            <div 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all group"
            >
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center text-rose-500 border border-rose-500/30 group-hover:scale-105 transition-transform shadow-lg shadow-rose-500/5">
                        <Swords size={24} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{ct.team_name || `Counter Team ${ctIdx + 1}`}</h4>
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2.5">
                                {(ct.heroes || []).filter(h => h).map((hero, i) => (
                                    <div key={i} className="relative w-10 h-10 rounded-xl border border-gray-950 overflow-hidden bg-gray-900 shadow-md">
                                        <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            {ct.pet_file && (
                                <div className="flex items-center p-1.5 rounded-xl bg-white/5 border border-white/10">
                                    <div className="relative w-6 h-6">
                                        <SafeImage src={ct.pet_file} alt="" fill className="object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-2 text-gray-600 hover:text-rose-500 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className={cn("transition-transform duration-300", !isCollapsed && "rotate-180")}>
                        <ChevronDown className="text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="p-6 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Configuration Name</label>
                            <input
                                type="text"
                                value={ct.team_name || ''}
                                onChange={(e) => onUpdate({ team_name: e.target.value })}
                                className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-rose-500/40 transition-all outline-none"
                                placeholder="Anti-Defense, Magic Burst..."
                            />
                        </div>
                        <TeamBuilder 
                            team={ct}
                            heroesList={heroesList}
                            petsList={petsList}
                            formations={formations}
                            onUpdate={(updated) => {
                                onUpdate({
                                    heroes: updated.heroes,
                                    formation: updated.formation,
                                    pet_file: updated.pet_file,
                                    pet_supports: updated.pet_supports,
                                    selection_order: updated.selection_order
                                })
                            }}
                            className="bg-transparent border-none p-0"
                        />
                    </div>

                    {/* Items Section */}
                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                <Box className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Build Counter</h4>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {((ct.selection_order && ct.selection_order.length > 0) ? ct.selection_order : (ct.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).map((slotIdx, heroIdx) => {
                                const heroFile = ct.heroes?.[slotIdx]
                                const heroName = heroFile ? heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ') : `Hero ${heroIdx + 1}`
                                const itemSet = ct.items?.[heroIdx] || { weapon: '', armor: '', accessories: [null, null, null], note: '' }

                                return (
                                    <div key={heroIdx} className={cn(
                                        "relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500", 
                                        heroFile 
                                            ? "bg-[#0d0a11] border-rose-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]" 
                                            : "bg-black/20 border-white/5 opacity-40 grayscale"
                                    )}>
                                        {/* Header: Large Portrait + Name */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative w-32 h-32 flex-shrink-0">
                                                {heroFile ? (
                                                    <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-contain" />
                                                ) : <Layout size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{heroName}</h4>
                                                <div className="w-8 h-0.5 bg-rose-500/30 rounded-full mt-2" />
                                            </div>
                                        </div>

                                        {/* Primary Gear Grid */}
                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            {[
                                                { type: 'weapon', color: 'red' },
                                                { type: 'armor', color: 'blue' }
                                            ].map(gear => (
                                                <div key={gear.type} className="group/slot relative">
                                                    <div 
                                                        onClick={() => heroFile && setItemPicker({ heroIdx, type: gear.type })}
                                                        className={cn(
                                                            "relative aspect-square rounded-[1.8rem] border flex items-center justify-center transition-all bg-black/60 cursor-pointer overflow-hidden group/gear shadow-2xl",
                                                            itemSet[gear.type] 
                                                                ? (gear.color === 'red' ? "border-rose-500/50 bg-rose-500/20" : "border-indigo-500/50 bg-indigo-500/20")
                                                                : "border-white/10 border-dashed hover:border-rose-500/40 hover:bg-rose-500/5"
                                                        )}
                                                    >
                                                        {itemSet[gear.type] ? (
                                                            <SafeImage src={`/items/${gear.type}/${itemSet[gear.type]}`} alt="" fill className="object-contain p-4 group-hover/gear:scale-110 transition-transform duration-500" />
                                                        ) : <Plus size={32} className="text-white/5" />}
                                                    </div>
                                                    {itemSet[gear.type] && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleItemUpdate(heroIdx, gear.type, '') }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border border-red-500/50 hover:bg-red-500 transition-colors z-10"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Accessories Row */}
                                        <div className="flex items-center gap-4 mb-8">
                                            {[0, 1, 2].map(accIdx => {
                                                const accImg = itemSet.accessories?.[accIdx]
                                                return (
                                                    <div key={accIdx} className="relative group/acc-container flex-1">
                                                        <div 
                                                            onClick={() => heroFile && setItemPicker({ heroIdx, type: 'accessories', accIdx })}
                                                            className={cn(
                                                                "relative aspect-square rounded-2xl border flex items-center justify-center transition-all bg-black/60 cursor-pointer overflow-hidden group/acc",
                                                                accImg ? "border-rose-500/40 bg-rose-500/10" : "border-white/10 border-dashed hover:border-rose-500/40 hover:bg-rose-500/5"
                                                            )}
                                                        >
                                                            {accImg ? (
                                                                <SafeImage src={`/items/accessory/${accImg}`} alt="" fill className="object-contain p-3 group-hover/acc:scale-110 transition-transform duration-500" />
                                                            ) : <Plus size={20} className="text-white/5" />}
                                                        </div>
                                                        {accImg && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleItemUpdate(heroIdx, 'accessories', null, accIdx) }}
                                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border border-red-500/50 opacity-0 group-hover/acc-container:opacity-100 transition-opacity z-20"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Notes */}
                                        <textarea 
                                            value={itemSet.note || ''}
                                            onChange={(e) => handleItemUpdate(heroIdx, 'note', e.target.value)}
                                            placeholder="Counter Strategic Notes..."
                                            rows={2}
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/10 focus:outline-none focus:border-rose-500/40 transition-all text-sm font-medium resize-none leading-relaxed"
                                            disabled={!heroFile}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Counter Strategy Execution */}
                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 pl-1">
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                <Zap className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Skill Rotation</h4>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                            {(ct.skill_rotation || []).map((step, sidx) => {
                                const [hIdx, sNum] = (step.skill || '').split('-').map(Number)
                                    const heroFile = ct.heroes?.[hIdx]
                                    const skillPath = step.skill ? getSkillImagePath(heroFile, sNum) : null
                                    return (
                                        <div key={sidx} className="flex flex-col items-center group relative">                   
                                            <input
                                                type="text"
                                                value={step.label || ''}
                                                onChange={(e) => {
                                                    const newRot = [...(ct.skill_rotation || [])]
                                                    newRot[sidx] = { ...newRot[sidx], label: e.target.value }
                                                    onUpdate({ skill_rotation: newRot })
                                                }}
                                                placeholder="..."
                                                className="w-14 text-center text-[11px] font-black bg-transparent border-none outline-none text-indigo-400 mb-1"
                                            />
                                            
                                            <div className="w-14 h-14 rounded-xl border-2 border-indigo-500/40 bg-indigo-500/5 overflow-hidden relative">
                                                {skillPath && <SafeImage src={skillPath} alt="" fill className="object-cover" />}
                                            </div>
                                            <button 
                                                onClick={() => onUpdate({ skill_rotation: ct.skill_rotation.filter((_, i) => i !== sidx) })}
                                                className="absolute -bottom-2 -right-2 p-1 bg-rose-600/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    )
                                })}
                                <button 
                                    onClick={() => {
                                        const newRot = [...(ct.skill_rotation || [])]
                                        newRot.push({ label: '', skill: null })
                                        onUpdate({ skill_rotation: newRot })
                                        onOpenSkillPicker(newRot.length - 1)
                                    }}
                                    className="w-14 h-14 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 flex items-center justify-center text-indigo-500/50 transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Local Item Picker for Counter */}
            {itemPicker && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-[#0b0f1a] w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Select Counter {itemPicker.type}</h3>
                                <p className="text-xs text-rose-500/60 mt-1 font-black tracking-widest uppercase">Precision Selection</p>
                            </div>
                            <button onClick={() => setItemPicker(null)} className="p-3 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-2xl transition-all">
                                <X size={24}/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-black/20">
                            <button 
                                onClick={() => { handleItemUpdate(itemPicker.heroIdx, itemPicker.type, itemPicker.type === 'accessories' ? null : '', itemPicker.accIdx); setItemPicker(null); }}
                                className="aspect-square rounded-2xl border-2 border-dashed border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 flex flex-col items-center justify-center gap-2 text-[10px] font-black text-gray-500 hover:text-red-500 transition-all uppercase tracking-widest group/none"
                            >
                                <X size={20} className="group-hover/none:scale-110 transition-transform" />
                                <span>Clear</span>
                            </button>
                            {(() => {
                                const heroFile = ct.heroes?.[itemPicker.heroIdx]
                                let baseItems = itemPicker.type === 'weapon' ? weapons : itemPicker.type === 'armor' ? armors : accessories
                                
                                return (
                                    <>
                                        {baseItems.map(item => (
                                            <button
                                                key={item.filename}
                                                onClick={() => {
                                                    handleItemUpdate(itemPicker.heroIdx, itemPicker.type, item.filename, itemPicker.accIdx)
                                                    setItemPicker(null)
                                                }}
                                                className="group aspect-square rounded-2xl border border-white/5 bg-gradient-to-br from-gray-900 to-black hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all p-3 flex items-center justify-center relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                                                    <SafeImage src={`/items/${itemPicker.type === 'accessories' ? 'accessory' : itemPicker.type}/${item.filename}`} alt="" fill className="object-contain" />
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
