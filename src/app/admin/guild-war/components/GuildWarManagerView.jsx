"use client"

import { useState, useEffect } from "react"
import { Swords, Plus, Save, Loader2, ShieldAlert } from "lucide-react"
import { 
    getGuildWarTeams, 
    createGuildWarTeam, 
    updateGuildWarTeam, 
    deleteGuildWarTeam,
    getItemFiles
} from "@/lib/guild-war-actions"
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from "@/lib/stage-actions"
import { getSkillImagePath } from "@/lib/formation-utils"
import GuildWarTeamCard from "./GuildWarTeamCard"
import GuildWarSkillPicker from "./GuildWarSkillPicker"
import GuildWarItemPicker from "./GuildWarItemPicker"
import { clsx } from "clsx"
import { toast } from "sonner"
import styles from "../guild-war.module.css"

/**
 * GuildWarManagerView - Orchestrator for Guild War strategic configurations
 */
export default function GuildWarManagerView({ initialTeams, initialHeroes, initialPets, initialFormations, initialItems, initialSkills }) {
    const [teams, setTeams] = useState(initialTeams.map(t => ({ ...t, _dirty: false })))
    const [heroes, setHeroes] = useState(initialHeroes)
    const [pets, setPets] = useState(initialPets)
    const [formations, setFormations] = useState(initialFormations)
    const [skillsMap, setSkillsMap] = useState(initialSkills)
    const [gearAssets, setGearAssets] = useState(initialItems)
    
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [skillPicker, setSkillPicker] = useState(null) // { counterIdx, heroSlot, slotIdx }
    const [itemPicker, setItemPicker] = useState(null) // { counterIdx, heroIdx, type, accIdx }
    const [activeTeamIdx, setActiveTeamIdx] = useState(null)
    const [skillErrors, setSkillErrors] = useState({})
    const handleAddTeam = () => {
        const newTeam = {
            id: `new-${Date.now()}`,
            team_index: teams.length + 1,
            team_name: '',
            formation: formations[0]?.value || '1-4',
            pet_file: '',
            pet_supports: [null, null, null],
            heroes: [null, null, null, null, null],
            skill_rotation: [],
            items: [],
            counter_teams: [],
            _isNew: true,
            _dirty: true
        }
        setTeams([...teams, newTeam])
        toast.info("New tactical squad initialized")
    }

    const handleUpdateTeam = (idx, field, value) => {
        setTeams(prev => {
            const next = [...prev]
            if (field === '_builder') {
                next[idx] = { 
                    ...next[idx], 
                    formation: value.formation,
                    pet_file: value.pet_file,
                    pet_supports: value.pet_supports,
                    heroes: value.heroes,
                    selection_order: value.selection_order,
                    _dirty: true 
                }
            } else {
                next[idx] = { ...next[idx], [field]: value, _dirty: true }
            }
            return next
        })
    }

    const handleDeleteTeam = async (idx) => {
        const team = teams[idx]
        if (!confirm(`Confirm decommissioning of ${team.team_name || 'Squad ' + (idx + 1)}?`)) return

        try {
            if (!team._isNew) await deleteGuildWarTeam(team.id)
            setTeams(teams.filter((_, i) => i !== idx))
            if (activeTeamIdx === idx) setActiveTeamIdx(null)
            toast.success("Squad decommissioned")
        } catch (err) {
            toast.error("Operation failed")
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const dirtyTeams = teams.filter(t => t._dirty)
        
        try {
            for (const team of dirtyTeams) {
                const data = {
                    team_name: team.team_name,
                    formation: team.formation,
                    pet_file: team.pet_file,
                    pet_supports: team.pet_supports,
                    heroes: team.heroes && team.heroes.length >= 5 ? team.heroes : [...(team.heroes || []), null, null, null, null, null].slice(0, 5),
                    selection_order: team.selection_order || [],
                    skill_rotation: team.skill_rotation,
                    items: team.items || [],
                    counter_teams: (team.counter_teams || []).map(ct => ({
                        ...ct,
                        heroes: ct.heroes && ct.heroes.length >= 5 ? ct.heroes : [...(ct.heroes || []), null, null, null, null, null].slice(0, 5),
                        items: ct.items || [],
                        skill_rotation: ct.skill_rotation || []
                    })),
                    note: team.note || ''
                }

                const res = team._isNew 
                    ? await createGuildWarTeam(data)
                    : await updateGuildWarTeam(team.id, data)
                
                if (!res.success) {
                    toast.error(`Failed to save ${team.team_name || 'Squad'}: ${res.error}`)
                    setSaving(false)
                    return
                }
            }
            
            const freshTeams = await getGuildWarTeams('all')
            setTeams(freshTeams.map(t => ({ ...t, _dirty: false })))
            toast.success("Strategic data synchronized")
        } catch (err) {
            toast.error("Synchronization failed")
        } finally {
            setSaving(false)
        }
    }

    const handleSkillSelect = (setIdx, slotIdx, skillKey) => {
        if (activeTeamIdx === null || !skillPicker) return
        
        const { counterIdx } = skillPicker
        setTeams(prev => {
            const next = [...prev]
            const team = next[activeTeamIdx]
            
            if (counterIdx !== null) {
                const counters = [...(team.counter_teams || [])]
                const rot = [...(counters[counterIdx].skill_rotation || [])]
                rot[slotIdx] = { ...rot[slotIdx], skill: skillKey }
                counters[counterIdx] = { ...counters[counterIdx], skill_rotation: rot }
                next[activeTeamIdx] = { ...team, counter_teams: counters, _dirty: true }
            } else {
                const rot = [...(team.skill_rotation || [])]
                rot[slotIdx] = { ...rot[slotIdx], skill: skillKey }
                next[activeTeamIdx] = { ...team, skill_rotation: rot, _dirty: true }
            }
            return next
        })
        setSkillPicker(null)
    }

    const handleItemSelect = (tid, heroIdx, type, itemFile, accIdx) => {
        if (activeTeamIdx === null || !itemPicker) return
        
        const { counterIdx } = itemPicker
        setTeams(prev => {
            const next = [...prev]
            const team = next[activeTeamIdx]
            
            const updateItems = (target) => {
                const items = [...(target.items || [])]
                while (items.length <= heroIdx) items.push({ weapon: '', armor: '', accessories: [null, null, null], note: '' })
                
                if (type === 'accessories') {
                    const accs = [...(items[heroIdx].accessories || [null, null, null])]
                    accs[accIdx] = itemFile
                    items[heroIdx] = { ...items[heroIdx], accessories: accs }
                } else {
                    items[heroIdx] = { ...items[heroIdx], [type]: itemFile }
                }
                return items
            }

            if (counterIdx !== null) {
                const counters = [...(team.counter_teams || [])]
                counters[counterIdx] = { ...counters[counterIdx], items: updateItems(counters[counterIdx]) }
                next[activeTeamIdx] = { ...team, counter_teams: counters, _dirty: true }
            } else {
                next[activeTeamIdx] = { ...team, items: updateItems(team), _dirty: true }
            }
            return next
        })
        setItemPicker(null)
    }

    const hasDirty = teams.some(t => t._dirty)

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.headerCard}>
                <div className={styles.headerGlow} />
                <div className={styles.titleSection}>
                    <div className={styles.iconWrapper}>
                        <Swords size={32} className="text-indigo-500" />
                    </div>
                    <div>
                        <h1 className={styles.title}>Strategic Intel</h1>
                        <p className={styles.subtitle}>Guild War command center. Coordinate elite squads and response incursions.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button onClick={handleAddTeam} className={styles.btnSecondary}>
                        <Plus size={18} />
                        <span>Deploy Squad</span>
                    </button>
                    <button 
                        onClick={handleSaveAll}
                        disabled={!hasDirty || saving}
                        className={styles.btnPrimary}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>Sync Intel</span>
                    </button>
                </div>
            </header>

            {/* List */}
            <div className={styles.teamList}>
                {teams.length === 0 && (
                    <div className={styles.emptyState}>
                        <ShieldAlert size={48} className="text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground font-black italic uppercase tracking-widest">No strategic squads active</p>
                        <button onClick={handleAddTeam} className={styles.btnPrimary}>Initialize First Squad</button>
                    </div>
                )}

                {teams.map((team, idx) => (
                    <GuildWarTeamCard
                        key={team.id}
                        team={team}
                        index={idx}
                        heroesList={heroes}
                        petsList={pets}
                        formations={formations}
                        onUpdate={(field, val) => handleUpdateTeam(idx, field, val)}
                        onDelete={() => handleDeleteTeam(idx)}
                        onOpenSkillPicker={(cIdx, sIdx) => {
                            setActiveTeamIdx(idx)
                            setSkillPicker({ counterIdx: cIdx, slotIdx: sIdx })
                        }}
                        onOpenItemPicker={(cIdx, hIdx, type, aIdx) => {
                            setActiveTeamIdx(idx)
                            setItemPicker({ counterIdx: cIdx, heroIdx: hIdx, type, accIdx: aIdx })
                        }}
                        getSkillImagePath={getSkillImagePath}
                    />
                ))}
            </div>

            {/* Modals */}
            <GuildWarSkillPicker
                setIdx={activeTeamIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={activeTeamIdx !== null && skillPicker
                    ? (skillPicker.counterIdx !== null && skillPicker.counterIdx !== undefined
                        ? (teams[activeTeamIdx].counter_teams?.[skillPicker.counterIdx]?.heroes || [])
                        : (teams[activeTeamIdx].heroes || []))
                    : []
                }
                skillsMap={skillsMap}
                skillErrors={skillErrors}
                onSelect={handleSkillSelect}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />

            <GuildWarItemPicker
                teamId={activeTeamIdx !== null && teams[activeTeamIdx] ? teams[activeTeamIdx].id : null}
                heroIdx={itemPicker?.heroIdx}
                type={itemPicker?.type}
                accIdx={itemPicker?.accIdx}
                items={itemPicker 
                    ? (itemPicker.type === 'weapon' ? gearAssets.weapons : itemPicker.type === 'armor' ? gearAssets.armors : gearAssets.accessories)
                    : []
                }
                onSelect={handleItemSelect}
                onClose={() => setItemPicker(null)}
            />
        </div>
    )
}
