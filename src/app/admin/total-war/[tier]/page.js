'use client'

import { useState, useEffect, use } from 'react'
import NextImage from 'next/image'
import SafeImage from '@/components/shared/SafeImage'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2, Swords, Zap, X, Pencil, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIER_CONFIG } from '@/lib/total-war-config'
import {
    getSetsByTier,
    createSet,
    updateSet,
    deleteSet,
    createTeam,
    updateTeam,
    deleteTeam,
} from '@/lib/total-war-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'

const uid = () => `new-${Date.now()}-${Math.random()}`

function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    return `/skills/${heroFilename.replace(/\.[^/.]+$/, '')}/${skillNumber}.webp`
}

// ─── Skill Picker Modal ────────────────────────────────────────────────────────
function SkillPickerModal({ open, teamHeroes, heroes, skillsMap, skillErrors, onError, onSelect, onClose }) {
    if (!open) return null
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
                                        const hasError = skillErrors[`pick-${heroIdx}-${skillName}`]
                                        return (
                                            <button
                                                key={skillName}
                                                type="button"
                                                onClick={() => onSelect(skillKey)}
                                                className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all bg-gray-900"
                                            >
                                                {skillPath && !hasError ? (
                                                    <SafeImage src={skillPath} alt={`Skill ${skillName}`} fill className="object-cover"
                                                        onError={() => onError(`pick-${heroIdx}-${skillName}`)} />
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
                    {!teamHeroes.length > 0 && (
                        <p className="text-center text-gray-500 py-8">No heroes in team yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({ team, teamIdx, tierCfg, heroes, pets, formations, skillErrors, onSkillError, onChange, onDelete, onOpenSkillPicker }) {
    const hasHeroes = team.heroes?.some(h => h)
    const rotation = team.skill_rotation || []

    return (
        <div className={cn(
            "border rounded-xl overflow-hidden",
            team._dirty ? "border-[#FFD700]/40 bg-gray-900/40" : "border-gray-800 bg-gray-900/20"
        )}>
            {/* Team Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/30">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs text-black shrink-0"
                        style={{ backgroundColor: tierCfg.accent + 'cc' }}>
                        {teamIdx + 1}
                    </div>
                    <Pencil className="w-3 h-3 text-gray-600" />
                    <input
                        type="text"
                        value={team.team_name || ''}
                        onChange={e => onChange('team_name', e.target.value)}
                        placeholder={`Team ${teamIdx + 1}`}
                        className="bg-transparent border-none outline-none text-sm font-bold text-white placeholder-gray-600 w-40"
                    />
                    {team._dirty && <span className="px-1.5 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-bold rounded">Unsaved</span>}
                </div>
                <button onClick={onDelete} className="text-gray-600 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <TeamBuilder
                    team={{ index: teamIdx + 1, formation: team.formation, pet_file: team.pet_file, heroes: team.heroes }}
                    index={teamIdx}
                    heroesList={heroes}
                    petsList={pets}
                    formations={formations}
                    onUpdate={(td) => onChange('_teamData', td)}
                    onRemove={null}
                />

                {/* Skill Rotation */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 text-[#FFD700]" /> Skill Rotation
                    </label>
                    <div className="bg-black/40 rounded-xl border border-gray-800 p-3">
                        <div className="flex flex-wrap items-end gap-1.5">
                            {rotation.map((slot, slotIdx) => {
                                const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                const heroFile = team.heroes?.[hIdx]
                                const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                const errKey = `slot-${team._uid}-${slotIdx}`
                                const hasError = skillErrors[errKey]
                                return (
                                    <div key={slotIdx} className="flex flex-col items-center group/slot">
                                        <input
                                            type="text"
                                            value={slot.label || ''}
                                            onChange={e => {
                                                const r = [...rotation]
                                                r[slotIdx] = { ...r[slotIdx], label: e.target.value }
                                                onChange('skill_rotation', r)
                                            }}
                                            placeholder="..."
                                            className="w-12 text-center text-[10px] font-bold text-[#FFD700]/80 bg-transparent border-none outline-none placeholder-gray-700 mb-0.5"
                                        />
                                        <div className="relative">
                                            <button type="button"
                                                onClick={() => onOpenSkillPicker(slotIdx)}
                                                disabled={!hasHeroes}
                                                className={cn(
                                                    "w-11 h-11 rounded-md overflow-hidden border-2 flex items-center justify-center transition-all",
                                                    slot.skill ? "border-[#FFD700]/50 bg-gray-900 hover:border-[#FFD700]" : "border-gray-700 border-dashed bg-gray-900/30 hover:border-gray-500",
                                                    !hasHeroes && "cursor-not-allowed opacity-40"
                                                )}
                                            >
                                                {slot.skill && heroFile && skillPath && !hasError ? (
                                                    <SafeImage src={skillPath} alt="" fill className="object-cover"
                                                        onError={() => onSkillError(errKey)} />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                                                )}
                                            </button>
                                            <button type="button"
                                                onClick={() => { const r = [...rotation]; r.splice(slotIdx, 1); onChange('skill_rotation', r) }}
                                                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full items-center justify-center text-[7px] hidden group-hover/slot:flex shadow">
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            {/* Add Slot */}
                            <div className="flex flex-col items-center">
                                <div className="h-[14px]" />
                                <button type="button" onClick={() => onChange('skill_rotation', [...rotation, { label: '', skill: null }])}
                                    disabled={!hasHeroes}
                                    className={cn("w-11 h-11 rounded-md border-2 border-dashed flex items-center justify-center transition-all",
                                        hasHeroes ? "border-[#FFD700]/30 text-[#FFD700]/50 hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/5" : "border-gray-700 text-gray-700 cursor-not-allowed"
                                    )}>
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {!hasHeroes && <p className="text-gray-700 text-xs mt-2">Add heroes to the team first to select skills</p>}
                    </div>
                </div>

                {/* Video + Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <Video className="w-3.5 h-3.5" /> Video URL
                        </label>
                        <input type="url" value={team.video_url || ''} onChange={e => onChange('video_url', e.target.value)}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-700 focus:outline-none focus:border-[#FFD700] transition-colors text-xs" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Note</label>
                        <input type="text" value={team.note || ''} onChange={e => onChange('note', e.target.value)}
                            placeholder="Optional note..."
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-700 focus:outline-none focus:border-[#FFD700] transition-colors text-xs" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Set Card ─────────────────────────────────────────────────────────────────
function SetCard({ set, setIdx, tierCfg, heroes, pets, formations, skillErrors, onSkillError,
    onSetChange, onAddTeam, onTeamChange, onDeleteTeam, onDeleteSet, onSaveSet, onOpenSkillPicker, saving }) {
    const [collapsed, setCollapsed] = useState(false)
    const maxTeams = tierCfg.maxTeams
    const canAdd = (set.teams?.length || 0) < maxTeams

    return (
        <div className={cn(
            "rounded-xl border overflow-hidden",
            set._dirty ? "border-[#FFD700]/40" : "border-gray-800"
        )}>
            {/* Set Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-900/60 border-b border-gray-800">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-black shrink-0"
                    style={{ backgroundColor: tierCfg.accent }}>
                    {setIdx + 1}
                </div>

                <div className="flex items-center gap-2 flex-1">
                    <Pencil className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <input
                        type="text"
                        value={set.set_name || ''}
                        onChange={e => onSetChange('set_name', e.target.value)}
                        placeholder={`Set ${setIdx + 1}`}
                        className="bg-transparent border-none outline-none text-base font-bold text-white placeholder-gray-600 flex-1 min-w-0"
                    />
                    {set._dirty && <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-bold rounded shrink-0">Unsaved</span>}
                </div>

                <span className="text-xs text-gray-600 font-mono shrink-0">
                    {set.teams?.length || 0}/{maxTeams} teams
                </span>

                <div className="flex items-center gap-1">
                    <button onClick={() => setCollapsed(c => !c)}
                        className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-700/40 rounded-lg transition-colors">
                        {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <button onClick={onDeleteSet}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!collapsed && (
                <div className="p-5 space-y-4 bg-black/20">
                    {/* Set Note */}
                    <input
                        type="text"
                        value={set.note || ''}
                        onChange={e => onSetChange('note', e.target.value)}
                        placeholder="Set description (optional)..."
                        className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-gray-400 placeholder-gray-700 focus:outline-none focus:border-gray-600 transition-colors text-xs"
                    />

                    {/* Teams */}
                    <div className="space-y-3">
                        {(set.teams || []).map((team, teamIdx) => (
                            <TeamCard
                                key={team._uid || team.id}
                                team={team}
                                teamIdx={teamIdx}
                                tierCfg={tierCfg}
                                heroes={heroes}
                                pets={pets}
                                formations={formations}
                                skillErrors={skillErrors}
                                onSkillError={onSkillError}
                                onChange={(field, value) => onTeamChange(teamIdx, field, value)}
                                onDelete={() => onDeleteTeam(teamIdx)}
                                onOpenSkillPicker={(slotIdx) => onOpenSkillPicker(setIdx, teamIdx, slotIdx)}
                            />
                        ))}

                        {canAdd ? (
                            <button
                                onClick={onAddTeam}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-700 text-gray-600 hover:border-gray-500 hover:text-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                Add Team ({(set.teams?.length || 0)}/{maxTeams})
                            </button>
                        ) : (
                            <div className="w-full py-2.5 rounded-xl border border-gray-800 text-gray-600 text-center text-xs font-bold">
                                Maximum {maxTeams} teams reached
                            </div>
                        )}
                    </div>

                    {/* Save Set */}
                    {set._dirty && (
                        <div className="flex justify-end">
                            <button
                                onClick={onSaveSet}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm bg-[#FFD700] text-black hover:bg-[#FFE55C] transition-all"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Set
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminTotalWarTierPage({ params }) {
    const { tier: tierKey } = use(params)
    const tierCfg = TIER_CONFIG.find(t => t.key === tierKey)

    const [sets, setSets] = useState([])
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const [skillPicker, setSkillPicker] = useState(null) // { setIdx, teamIdx, slotIdx }
    const [skillsMap, setSkillsMap] = useState({})
    const [savingSetId, setSavingSetId] = useState(null)

    useEffect(() => {
        if (!tierCfg) return
        async function load() {
            setLoading(true)
            const [setsData, heroesData, petsData, formsData, skillsData] = await Promise.all([
                getSetsByTier(tierKey),
                getAllHeroes(),
                getPets(),
                getFormations(),
                getHeroSkillsMap()
            ])
            setSets(setsData.map(s => ({
                ...s,
                _dirty: false,
                teams: (s.teams || []).map(t => ({ ...t, _uid: String(t.id), _dirty: false }))
            })))
            setHeroes(heroesData)
            setPets(petsData)
            setFormations(formsData)
            setSkillsMap(skillsData)
            setLoading(false)
        }
        load()
    }, [tierKey, tierCfg])

    const handleAddSet = () => {
        setSets(prev => [...prev, {
            id: uid(), tier: tierKey, set_name: '', note: '', teams: [], _isNew: true, _dirty: true
        }])
    }

    const handleSetChange = (setIdx, field, value) => {
        setSets(prev => {
            const next = [...prev]
            next[setIdx] = { ...next[setIdx], [field]: value, _dirty: true }
            return next
        })
    }

    const handleDeleteSet = async (setIdx) => {
        const set = sets[setIdx]
        if (!set._isNew) await deleteSet(set.id)
        setSets(prev => prev.filter((_, i) => i !== setIdx))
    }

    const handleAddTeam = (setIdx) => {
        const defFormation = formations[0]?.value || '2-3'
        setSets(prev => {
            const next = [...prev]
            next[setIdx] = {
                ...next[setIdx],
                _dirty: true,
                teams: [...(next[setIdx].teams || []), {
                    id: uid(), _uid: uid(), _isNew: true, _dirty: true,
                    team_name: '', formation: defFormation, pet_file: '',
                    heroes: [null, null, null, null, null], skill_rotation: [], video_url: '', note: ''
                }]
            }
            return next
        })
    }

    const handleTeamChange = (setIdx, teamIdx, field, value) => {
        setSets(prev => {
            const next = [...prev]
            const teams = [...next[setIdx].teams]
            if (field === '_teamData') {
                teams[teamIdx] = { ...teams[teamIdx], formation: value.formation, pet_file: value.pet_file, heroes: value.heroes, _dirty: true }
            } else {
                teams[teamIdx] = { ...teams[teamIdx], [field]: value, _dirty: true }
            }
            next[setIdx] = { ...next[setIdx], teams, _dirty: true }
            return next
        })
    }

    const handleDeleteTeam = async (setIdx, teamIdx) => {
        const team = sets[setIdx].teams[teamIdx]
        if (!team._isNew) await deleteTeam(team.id)
        setSets(prev => {
            const next = [...prev]
            next[setIdx] = { ...next[setIdx], teams: next[setIdx].teams.filter((_, i) => i !== teamIdx), _dirty: true }
            return next
        })
    }

    const handleSaveSet = async (setIdx) => {
        const set = sets[setIdx]
        setSavingSetId(setIdx)

        let setId = set.id
        if (set._isNew) {
            const res = await createSet({ tier: tierKey, set_name: set.set_name, note: set.note })
            if (!res.success) { setSavingSetId(null); return }
            setId = res.id
        } else {
            await updateSet(setId, { set_name: set.set_name, note: set.note })
        }

        // Save each dirty team
        for (const team of set.teams) {
            if (!team._dirty) continue
            const teamData = { set_id: setId, team_name: team.team_name, formation: team.formation, pet_file: team.pet_file, heroes: team.heroes, skill_rotation: team.skill_rotation, video_url: team.video_url, note: team.note }
            if (team._isNew) {
                await createTeam(teamData)
            } else {
                await updateTeam(team.id, teamData)
            }
        }

        // Refresh
        const refreshed = await getSetsByTier(tierKey)
        setSets(refreshed.map(s => ({
            ...s, _dirty: false,
            teams: (s.teams || []).map(t => ({ ...t, _uid: String(t.id), _dirty: false }))
        })))
        setSavingSetId(null)
    }

    const handleSkillError = (key) => setSkillErrors(prev => ({ ...prev, [key]: true }))

    const handleSkillSelect = (skillKey) => {
        if (!skillPicker) return
        const { setIdx, teamIdx, slotIdx } = skillPicker
        setSets(prev => {
            const next = [...prev]
            const teams = [...next[setIdx].teams]
            const rotation = [...(teams[teamIdx].skill_rotation || [])]
            rotation[slotIdx] = { ...rotation[slotIdx], skill: skillKey }
            teams[teamIdx] = { ...teams[teamIdx], skill_rotation: rotation, _dirty: true }
            next[setIdx] = { ...next[setIdx], teams, _dirty: true }
            return next
        })
        setSkillPicker(null)
    }

    if (!tierCfg) return <div className="py-20 text-center text-gray-500">Tier not found</div>
    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: tierCfg.accent }} />
        </div>
    )

    const pickerHeroes = skillPicker != null
        ? (sets[skillPicker.setIdx]?.teams[skillPicker.teamIdx]?.heroes || [])
        : []

    return (
        <div className="flex gap-6 pb-20">
            {/* Sidebar */}
            <div className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-8 space-y-4">
                    <Link href="/admin/total-war"
                        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors w-full text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Total War
                    </Link>

                    {/* Logo */}
                    <div className="relative w-full aspect-square rounded-xl border-2 p-3 bg-gray-900/40"
                        style={{ borderColor: tierCfg.accent + '60' }}>
                        <NextImage src={tierCfg.logo} alt={tierCfg.label} fill className="object-contain p-3" priority />
                    </div>

                    {/* Tier Switcher */}
                    <div className="pt-3 border-t border-gray-800 space-y-1">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-2 mb-2">Switch Tier</p>
                        {TIER_CONFIG.map(t => (
                            <Link key={t.key} href={`/admin/total-war/${t.key}`}
                                className={cn("flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border transition-all",
                                    t.key === tierKey ? "border-gray-600 bg-gray-800/80" : "border-transparent hover:bg-gray-800/40 hover:border-gray-700"
                                )}>
                                <div className="relative w-7 h-7 shrink-0">
                                    <NextImage src={t.logo} alt={t.label} fill className="object-contain" sizes="28px" />
                                </div>
                                <span className="text-xs font-bold" style={{ color: t.key === tierKey ? t.accent : '#6b7280' }}>
                                    {t.label}
                                </span>
                                <span className="ml-auto text-[10px] text-gray-700">{t.maxTeams}t</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0 space-y-5">
                {/* Top Bar */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 shrink-0">
                            <NextImage src={tierCfg.logo} alt={tierCfg.label} fill className="object-contain" sizes="36px" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black" style={{ color: tierCfg.accent }}>{tierCfg.label}</h1>
                            <p className="text-xs text-gray-500">{sets.length} Sets · {tierCfg.maxTeams} teams per set</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddSet}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Set
                    </button>
                </div>

                {/* Sets */}
                {sets.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl">
                        <Layers className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No sets yet. Click &quot;Add Set&quot; to create one.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sets.map((set, setIdx) => (
                            <SetCard
                                key={set.id}
                                set={set}
                                setIdx={setIdx}
                                tierCfg={tierCfg}
                                heroes={heroes}
                                pets={pets}
                                formations={formations}
                                skillErrors={skillErrors}
                                onSkillError={handleSkillError}
                                onSetChange={(field, value) => handleSetChange(setIdx, field, value)}
                                onAddTeam={() => handleAddTeam(setIdx)}
                                onTeamChange={(teamIdx, field, value) => handleTeamChange(setIdx, teamIdx, field, value)}
                                onDeleteTeam={(teamIdx) => handleDeleteTeam(setIdx, teamIdx)}
                                onDeleteSet={() => handleDeleteSet(setIdx)}
                                onSaveSet={() => handleSaveSet(setIdx)}
                                onOpenSkillPicker={(si, ti, sli) => setSkillPicker({ setIdx: si, teamIdx: ti, slotIdx: sli })}
                                saving={savingSetId === setIdx}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Skill Picker Modal */}
            <SkillPickerModal
                open={skillPicker !== null}
                teamHeroes={pickerHeroes}
                heroes={heroes}
                skillsMap={skillsMap}
                skillErrors={skillErrors}
                onError={handleSkillError}
                onSelect={handleSkillSelect}
                onClose={() => setSkillPicker(null)}
            />
        </div>
    )
}
